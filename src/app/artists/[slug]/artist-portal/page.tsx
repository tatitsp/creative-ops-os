import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { WORKSPACES } from "@/lib/workspaces";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/lib/authorize";
import { ArtistPortalReadOnly } from "@/components/artist-portal/ArtistPortalReadOnly";
import type { ApiRelease } from "@/store/releases-store";
import type { ApiContentItem } from "@/store/pipeline-store";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Artist Portal` : "Artist Portal" };
}

// Roles that get read-only access to the portal
const READ_ONLY_ROLES = new Set([
  "CREATIVE_ASSISTANT",
  "PHOTOGRAPHER_VIDEOGRAPHER",
  "SOCIAL_MEDIA",
  "GRAPHIC_DESIGNER",
  "CONTRACTOR",
  "EDITOR",
]);

// Roles with full access (can use the full workspace dashboard instead)
const FULL_ACCESS_ROLES = new Set([
  "CREATIVE_OPS_DIRECTOR",
  "MANAGEMENT",
  "ARTIST_CEO",
]);

export default async function ArtistPortalPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  // Require workspace membership
  const auth = await requireWorkspaceAccess(slug);
  if (!auth.ok) redirect(`/login?next=/artists/${slug}/artist-portal`);

  const { role } = auth.ctx;

  // Full-access roles → redirect to workspace dashboard
  if (FULL_ACCESS_ROLES.has(role)) {
    redirect(`/artists/${slug}/dashboard`);
  }

  // Read-only roles proceed; unknown roles get denied
  if (!READ_ONLY_ROLES.has(role)) {
    notFound();
  }

  // Fetch workspace data
  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true, name: true },
  });
  if (!workspace) notFound();

  // Fetch recent content items (last 10)
  const contentRows = await prisma.contentItem.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      caption: true,
      phase: true,
      type: true,
      platforms: true,
      scheduledAt: true,
      postedAt: true,
      isOrganic: true,
      notes: true,
      priority: true,
      createdAt: true,
      campaign: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true, image: true, role: true, status: true } },
    },
  });

  const contentItems: ApiContentItem[] = contentRows.map((item) => ({
    id: item.id,
    title: item.title,
    caption: item.caption,
    phase: item.phase,
    type: item.type,
    platforms: item.platforms,
    scheduledAt: item.scheduledAt ? item.scheduledAt.toISOString() : null,
    priority: item.priority,
    isOrganic: item.isOrganic,
    campaign: item.campaign ?? null,
    assignee: item.assignee
      ? {
          id: item.assignee.id,
          name: item.assignee.name ?? "Unknown",
          image: item.assignee.image ?? null,
          role: item.assignee.role,
          status: item.assignee.status,
        }
      : null,
  }));

  // Fetch pending approvals for the workspace
  const approvalRows = await prisma.approval.findMany({
    where: {
      status: "PENDING",
      OR: [
        { content: { workspaceId: workspace.id } },
        { task: { project: { workspaceId: workspace.id } } },
      ],
    },
    orderBy: { requestedAt: "desc" },
    take: 10,
    select: {
      id: true,
      status: true,
      stage: true,
      requestedAt: true,
      requester: { select: { id: true, name: true, image: true } },
      content: { select: { id: true, title: true, type: true } },
      task: { select: { id: true, title: true } },
    },
  });

  type PortalApproval = {
    id: string;
    title: string;
    type: string;
    stage: string;
    requestedAt: string;
    requesterName: string | null;
  };

  const approvals: PortalApproval[] = approvalRows.map((a) => ({
    id: a.id,
    title: a.content?.title ?? a.task?.title ?? "Untitled",
    type: a.content ? a.content.type : "task",
    stage: a.stage,
    requestedAt: a.requestedAt.toISOString(),
    requesterName: a.requester.name,
  }));

  // Fetch upcoming releases (next 5 by date)
  const releaseRows = await prisma.release.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { releaseDate: "asc" },
    take: 5,
    select: {
      id: true,
      title: true,
      artist: true,
      type: true,
      status: true,
      releaseDate: true,
      announcementDate: true,
      coverArt: true,
      trackCount: true,
      leadSingles: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const releases: ApiRelease[] = releaseRows.map((r) => ({
    ...r,
    releaseDate: r.releaseDate.toISOString(),
    announcementDate: r.announcementDate ? r.announcementDate.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <ArtistPortalReadOnly
      slug={slug}
      artistName={ws.artistName}
      workspaceName={workspace.name}
      contentItems={contentItems}
      approvals={approvals}
      releases={releases}
    />
  );
}

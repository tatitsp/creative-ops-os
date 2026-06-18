import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WORKSPACES } from "@/lib/workspaces";
import { ClientFolderCard } from "@/components/workspace/ClientFolderCard";
import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";
import {
  AdminCommandCenter,
  type AdminClientData,
  type ActivityItem,
} from "@/components/admin/AdminCommandCenter";
import { formatRelativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Command Center — SCOPE" };
export const dynamic = "force-dynamic";

export default async function CommandCenterPage() {
  const session = await auth();

  if (!session?.user?.email) redirect("/sign-in");

  const { email, name, workspaceSlugs, isAdmin } = session.user;

  if (!isAdmin && workspaceSlugs.length === 0) redirect("/access-pending");

  const firstName = name?.split(" ")[0] ?? email.split("@")[0];

  // ── Shared: fetch clients + unassigned workspaces ─────────────────────────
  const [dbClients, dbWorkspaces, dbAllWorkspaceSlugs] = await Promise.all([
    prisma.client.findMany({
      where: isAdmin
        ? {}
        : { workspaces: { some: { slug: { in: workspaceSlugs } } } },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        brandColor: true,
        status: true,
        _count: { select: { workspaces: true } },
        workspaces: {
          take: 1,
          orderBy: { createdAt: "asc" },
          select: { dashboardHref: true },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.workspace.findMany({
      where: {
        clientId: null,
        ...(isAdmin ? {} : { slug: { in: workspaceSlugs } }),
      },
      select: { id: true, name: true, slug: true, dashboardHref: true },
      orderBy: { name: "asc" },
    }),
    prisma.workspace.findMany({
      where: isAdmin ? {} : { slug: { in: workspaceSlugs } },
      select: { slug: true },
    }),
  ]);

  // ── Resolve static enrichment + direct access ─────────────────────────────
  const dbSlugSet = new Set(dbAllWorkspaceSlugs.map((w) => w.slug));

  const unassignedCards = dbWorkspaces
    .map((dw) => WORKSPACES.find((sw) => sw.slug === dw.slug) ?? null)
    .filter(Boolean) as typeof WORKSPACES;

  const staticOrphans = WORKSPACES.filter(
    (ws) =>
      (isAdmin || workspaceSlugs.includes(ws.slug)) && !dbSlugSet.has(ws.slug)
  );

  const directAccess = [...unassignedCards, ...staticOrphans];

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN PATH: full mission control dashboard
  // ─────────────────────────────────────────────────────────────────────────

  if (isAdmin) {
    // Admin stats
    const [activeClients, totalMembers, pendingInvites] = await Promise.all([
      prisma.client.count({ where: { status: "ACTIVE" } }),
      prisma.workspaceMember.count(),
      prisma.invite.count({
        where: {
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
      }),
    ]);

    // Recent activity — pull from real tables, merge + sort
    const [recentAssets, recentApprovals, recentMembers, recentContent] =
      await Promise.all([
        prisma.asset.findMany({
          take: 8,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            createdAt: true,
            workspace: { select: { name: true } },
          },
        }),
        prisma.approval.findMany({
          take: 8,
          orderBy: { requestedAt: "desc" },
          select: {
            id: true,
            requestedAt: true,
            status: true,
            content: { select: { title: true, workspace: { select: { name: true } } } },
          },
        }),
        prisma.workspaceMember.findMany({
          take: 8,
          orderBy: { invitedAt: "desc" },
          select: {
            userId: true,
            invitedAt: true,
            user: { select: { name: true, email: true } },
            workspace: { select: { name: true } },
          },
        }),
        prisma.contentItem.findMany({
          take: 8,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            createdAt: true,
            workspace: { select: { name: true } },
          },
        }),
      ]);

    // Build unified activity list
    const rawActivity: ActivityItem[] = [
      ...recentAssets.map((a) => ({
        id: `asset-${a.id}`,
        type: "upload" as const,
        label: `Asset uploaded: ${a.name}`,
        sub: a.workspace?.name ?? "Unknown workspace",
        time: formatRelativeTime(a.createdAt.toISOString()),
        _at: a.createdAt,
      })),
      ...recentApprovals.map((a) => ({
        id: `approval-${a.id}`,
        type: "approval" as const,
        label: `Approval submitted: ${a.content?.title ?? a.status}`,
        sub: a.content?.workspace?.name ?? "Unknown workspace",
        time: formatRelativeTime(a.requestedAt.toISOString()),
        _at: a.requestedAt,
      })),
      ...recentMembers.map((m) => ({
        id: `member-${m.userId}-${m.workspace.name}`,
        type: "member" as const,
        label: `${m.user.name ?? m.user.email} joined the team`,
        sub: m.workspace.name,
        time: formatRelativeTime(m.invitedAt.toISOString()),
        _at: m.invitedAt,
      })),
      ...recentContent.map((c) => ({
        id: `content-${c.id}`,
        type: "content" as const,
        label: `Content added: ${c.title}`,
        sub: c.workspace?.name ?? "Unknown workspace",
        time: formatRelativeTime(c.createdAt.toISOString()),
        _at: c.createdAt,
      })),
    ]
      .sort((a, b) => b._at.getTime() - a._at.getTime())
      .slice(0, 15)
      .map(({ _at: _unused, ...rest }) => rest);

    // Admin client cards
    const adminClients: AdminClientData[] = dbClients.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      type: c.type,
      brandColor: c.brandColor,
      status: c.status,
      workspaceCount: c._count.workspaces,
      primaryWorkspaceHref: c.workspaces[0]?.dashboardHref ?? null,
    }));

    // Direct access for admin — resolve hrefs
    const adminDirectAccess = directAccess.map((ws) => ({
      slug: ws.slug,
      name: ws.artistName,
      href: dbWorkspaces.find((d) => d.slug === ws.slug)?.dashboardHref ?? ws.href,
    }));

    return (
      <AdminCommandCenter
        firstName={firstName}
        stats={{ activeClients, totalMembers, pendingInvites }}
        clients={adminClients}
        directAccess={adminDirectAccess}
        activity={rawActivity}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NON-ADMIN PATH: simple workspace picker (unchanged)
  // ─────────────────────────────────────────────────────────────────────────

  const clientCards = dbClients.map((c) => ({
    name: c.name,
    slug: c.slug,
    type: c.type,
    brandColor: c.brandColor,
    status: c.status,
    workspaceCount: c._count.workspaces,
  }));

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#0A0A0A" }}
    >
      <p className="text-xs font-black tracking-[-0.02em] text-white mb-12 opacity-40">
        SCOPE
      </p>

      <div className="text-center mb-10">
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          Welcome back, {firstName}.
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          {clientCards.length > 0
            ? "Choose a client to continue."
            : "Choose a workspace to continue."}
        </p>
      </div>

      {clientCards.length > 0 && (
        <div className="w-full max-w-xl mb-8">
          <p
            className="text-2xs tracking-[0.2em] uppercase font-semibold mb-4"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Clients
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clientCards.map((c) => (
              <ClientFolderCard key={c.slug} client={c} />
            ))}
          </div>
        </div>
      )}

      {directAccess.length > 0 && (
        <div className="w-full max-w-xl mb-8">
          {clientCards.length > 0 && (
            <p
              className="text-2xs tracking-[0.2em] uppercase font-semibold mb-4"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              Direct Access
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {directAccess.map((ws) => (
              <WorkspaceCard key={ws.slug} workspace={ws} />
            ))}
          </div>
        </div>
      )}

      <p
        className="mt-14 text-[0.6rem] tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.08)" }}
      >
        © 2026 The Sighte Project
      </p>
    </div>
  );
}

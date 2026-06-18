import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/lib/authorize";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const auth = await requireWorkspaceAccess(slug);
  if (!auth.ok) return auth.response;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

  const items = await prisma.contentItem.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" },
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

  return Response.json({ items });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const auth = await requireWorkspaceAccess(slug);
  if (!auth.ok) return auth.response;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

  const body = await req.json();
  const { title, type, phase, platforms, campaignId, scheduledAt, isOrganic, notes, priority, assigneeId } = body;

  if (!title || !type) {
    return Response.json({ error: "title and type are required" }, { status: 400 });
  }

  const item = await prisma.contentItem.create({
    data: {
      title,
      type,
      phase: phase ?? "IDEA",
      platforms: platforms ?? [],
      campaignId: campaignId || null,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      isOrganic: isOrganic ?? false,
      notes: notes || null,
      priority: priority ?? "MEDIUM",
      workspaceId: workspace.id,
      assigneeId: assigneeId || null,
    },
    select: {
      id: true,
      title: true,
      phase: true,
      type: true,
      platforms: true,
      scheduledAt: true,
      priority: true,
      isOrganic: true,
      campaign: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true, image: true, role: true, status: true } },
    },
  });

  return Response.json({ item }, { status: 201 });
}

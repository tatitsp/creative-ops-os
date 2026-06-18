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
  if (!workspace) return Response.json({ error: "Not found" }, { status: 404 });

  const approvals = await prisma.approval.findMany({
    where: {
      OR: [
        { content: { workspaceId: workspace.id } },
        { task: { project: { workspaceId: workspace.id } } },
      ],
    },
    orderBy: { requestedAt: "desc" },
    select: {
      id: true,
      status: true,
      stage: true,
      history: true,
      notes: true,
      feedback: true,
      requestedAt: true,
      reviewedAt: true,
      requester: { select: { id: true, name: true, image: true, role: true, status: true } },
      reviewer: { select: { id: true, name: true, image: true, role: true, status: true } },
      content: {
        select: {
          id: true,
          title: true,
          type: true,
          phase: true,
          campaign: { select: { id: true, name: true } },
        },
      },
      task: { select: { id: true, title: true, priority: true } },
    },
  });

  return Response.json({ approvals });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const auth = await requireWorkspaceAccess(slug);
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const { contentId, taskId, notes } = body;

  if (!contentId && !taskId) {
    return Response.json({ error: "contentId or taskId required" }, { status: 400 });
  }

  // Check for existing pending approval
  const existing = await prisma.approval.findFirst({
    where: {
      ...(contentId ? { contentId } : { taskId }),
      status: "PENDING",
    },
  });
  if (existing) {
    return Response.json({ error: "An approval request already exists" }, { status: 409 });
  }

  const now = new Date().toISOString();
  const initialHistory = [
    {
      id: `h-${Date.now()}`,
      stage: "INTERNAL_REVIEW",
      action: "SUBMITTED",
      actorId: auth.ctx.userId,
      timestamp: now,
      note: notes || null,
    },
  ];

  const approval = await prisma.approval.create({
    data: {
      contentId: contentId || null,
      taskId: taskId || null,
      requesterId: auth.ctx.userId,
      status: "PENDING",
      stage: "INTERNAL_REVIEW",
      notes: notes || null,
      history: initialHistory,
    },
    select: {
      id: true,
      status: true,
      stage: true,
      requestedAt: true,
      requester: { select: { id: true, name: true, image: true, role: true, status: true } },
      content: { select: { id: true, title: true, type: true } },
    },
  });

  return Response.json({ approval }, { status: 201 });
}

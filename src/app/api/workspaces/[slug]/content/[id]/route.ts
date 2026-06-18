import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/lib/authorize";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  const auth = await requireWorkspaceAccess(slug);
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const { phase, title, caption, platforms, scheduledAt, notes, priority, assigneeId } = body;

  const item = await prisma.contentItem.update({
    where: { id },
    data: {
      ...(phase !== undefined && { phase }),
      ...(title !== undefined && { title }),
      ...(caption !== undefined && { caption }),
      ...(platforms !== undefined && { platforms }),
      ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
      ...(notes !== undefined && { notes }),
      ...(priority !== undefined && { priority }),
      ...(assigneeId !== undefined && { assigneeId: assigneeId || null }),
    },
    select: {
      id: true,
      title: true,
      phase: true,
      type: true,
      platforms: true,
      scheduledAt: true,
      priority: true,
      campaign: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true, image: true, role: true, status: true } },
    },
  });

  return Response.json({ item });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  const auth = await requireWorkspaceAccess(slug);
  if (!auth.ok) return auth.response;

  await prisma.contentItem.delete({ where: { id } });

  return Response.json({ ok: true });
}

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/lib/authorize";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  const auth = await requireWorkspaceAccess(slug);
  if (!auth.ok) return auth.response;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

  const event = await prisma.calendarEvent.findFirst({
    where: { id, workspaceId: workspace.id },
    select: { id: true },
  });
  if (!event) return Response.json({ error: "Event not found" }, { status: 404 });

  await prisma.calendarEvent.delete({ where: { id } });

  return Response.json({ ok: true });
}

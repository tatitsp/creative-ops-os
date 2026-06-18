import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/lib/authorize";

async function resolveWorkspace(slug: string) {
  return prisma.workspace.findUnique({
    where: { slug },
    select: { id: true, ownerId: true },
  });
}

function isOwnerOrAdmin(ctx: { isAdmin: boolean; role: string }) {
  return (
    ctx.isAdmin ||
    ctx.role === "ARTIST_CEO" ||
    ctx.role === "CREATIVE_OPS_DIRECTOR"
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; userId: string }> }
) {
  const { slug, userId } = await params;
  const auth = await requireWorkspaceAccess(slug);
  if (!auth.ok) return auth.response;

  if (!isOwnerOrAdmin(auth.ctx)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const workspace = await resolveWorkspace(slug);
  if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

  const body = await req.json();
  const { role } = body;

  if (!role) {
    return Response.json({ error: "role is required" }, { status: 400 });
  }

  const member = await prisma.workspaceMember.findFirst({
    where: { workspaceId: workspace.id, userId },
  });
  if (!member) return Response.json({ error: "Member not found" }, { status: 404 });

  const updated = await prisma.workspaceMember.update({
    where: { id: member.id },
    data: { role },
    select: {
      id: true,
      role: true,
      invitedAt: true,
      joinedAt: true,
      user: {
        select: { id: true, name: true, email: true, image: true, status: true },
      },
    },
  });

  return Response.json({ member: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; userId: string }> }
) {
  const { slug, userId } = await params;
  const auth = await requireWorkspaceAccess(slug);
  if (!auth.ok) return auth.response;

  if (!isOwnerOrAdmin(auth.ctx)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const workspace = await resolveWorkspace(slug);
  if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

  // Prevent removing the workspace owner
  if (workspace.ownerId === userId) {
    return Response.json({ error: "Cannot remove the workspace owner" }, { status: 400 });
  }

  const member = await prisma.workspaceMember.findFirst({
    where: { workspaceId: workspace.id, userId },
  });
  if (!member) return Response.json({ error: "Member not found" }, { status: 404 });

  await prisma.workspaceMember.delete({ where: { id: member.id } });

  return Response.json({ ok: true });
}

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

  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { invitedAt: "asc" },
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

  return Response.json({ members });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const auth = await requireWorkspaceAccess(slug);
  if (!auth.ok) return auth.response;

  const { ctx } = auth;
  const isOwnerOrAdmin =
    ctx.isAdmin ||
    ctx.role === "ARTIST_CEO" ||
    ctx.role === "CREATIVE_OPS_DIRECTOR";

  if (!isOwnerOrAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true, ownerId: true },
  });
  if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

  const body = await req.json();
  const { email, role } = body;

  if (!email) {
    return Response.json({ error: "email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!user) {
    return Response.json({ error: "No user found with that email" }, { status: 404 });
  }

  const existing = await prisma.workspaceMember.findFirst({
    where: { workspaceId: workspace.id, userId: user.id },
  });
  if (existing) {
    return Response.json({ error: "User is already a member" }, { status: 409 });
  }

  const member = await prisma.workspaceMember.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      role: role ?? "CREATIVE_ASSISTANT",
      joinedAt: new Date(),
    },
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

  return Response.json({ member }, { status: 201 });
}

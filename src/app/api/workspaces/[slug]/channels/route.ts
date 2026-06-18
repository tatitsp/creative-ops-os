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

  const channels = await prisma.channel.findMany({
    where: { workspaceId: workspace.id },
    orderBy: [{ isPinned: "desc" }, { createdAt: "asc" }],
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      isPrivate: true,
      isPinned: true,
      createdAt: true,
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return Response.json({ channels });
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
  const { name, description } = body;

  if (!name) {
    return Response.json({ error: "name is required" }, { status: 400 });
  }

  const channel = await prisma.channel.create({
    data: {
      workspaceId: workspace.id,
      name,
      description: description || null,
      createdById: auth.ctx.userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      isPrivate: true,
      isPinned: true,
      createdAt: true,
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return Response.json({ channel }, { status: 201 });
}

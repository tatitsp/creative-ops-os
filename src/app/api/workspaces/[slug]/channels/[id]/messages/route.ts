import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/lib/authorize";

export async function GET(
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

  const channel = await prisma.channel.findFirst({
    where: { id, workspaceId: workspace.id },
    select: { id: true },
  });
  if (!channel) return Response.json({ error: "Channel not found" }, { status: 404 });

  // Last 50 messages, oldest first
  const messages = await prisma.message.findMany({
    where: { channelId: id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: { id: true, name: true, displayName: true, image: true },
      },
    },
  });

  // Reverse to oldest-first
  return Response.json({ messages: messages.reverse() });
}

export async function POST(
  req: NextRequest,
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

  const channel = await prisma.channel.findFirst({
    where: { id, workspaceId: workspace.id },
    select: { id: true },
  });
  if (!channel) return Response.json({ error: "Channel not found" }, { status: 404 });

  const body = await req.json();
  const { body: msgBody } = body;

  if (!msgBody || !msgBody.trim()) {
    return Response.json({ error: "body is required" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      channelId: id,
      authorId: auth.ctx.userId,
      content: msgBody.trim(),
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: { id: true, name: true, displayName: true, image: true },
      },
    },
  });

  return Response.json({ message }, { status: 201 });
}

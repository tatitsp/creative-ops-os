import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess, requirePermission } from "@/lib/authorize";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  // Only admin/owner — require manage_team permission
  const auth = await requirePermission(slug, "manage_team");
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

  await prisma.channel.delete({ where: { id } });

  return Response.json({ ok: true });
}

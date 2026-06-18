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

  // Verify the asset belongs to this workspace before deleting
  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

  const asset = await prisma.asset.findFirst({
    where: { id, workspaceId: workspace.id },
    select: { id: true },
  });
  if (!asset) return Response.json({ error: "Asset not found" }, { status: 404 });

  await prisma.asset.delete({ where: { id } });

  return Response.json({ ok: true });
}

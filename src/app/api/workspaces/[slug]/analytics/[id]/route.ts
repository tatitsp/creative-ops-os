import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorize";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  const auth = await requirePermission(slug, "view_analytics");
  if (!auth.ok) return auth.response;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

  const entry = await prisma.analyticsEntry.findFirst({
    where: { id, workspaceId: workspace.id },
    select: { id: true },
  });
  if (!entry) return Response.json({ error: "Analytics entry not found" }, { status: 404 });

  await prisma.analyticsEntry.delete({ where: { id } });

  return Response.json({ ok: true });
}

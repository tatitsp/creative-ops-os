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

  const assets = await prisma.asset.findMany({
    where: { workspaceId: workspace.id, isArchived: false },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      url: true,
      fileType: true,
      mimeType: true,
      size: true,
      thumbnailUrl: true,
      tags: true,
      createdAt: true,
      uploader: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });

  return Response.json({ assets });
}

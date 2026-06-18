// Server component — fetches real assets from Prisma, passes to AssetGridClient for interactivity.

import { prisma } from "@/lib/prisma";
import { AssetGridClient } from "./AssetGridClient";

interface Props {
  workspaceSlug: string;
}

export async function AssetGrid({ workspaceSlug }: Props) {
  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
    select: {
      assets: {
        where: { isArchived: false },
        include: {
          uploader: {
            select: { name: true, image: true, email: true, status: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const assets = (workspace?.assets ?? []).map((a) => ({
    id: a.id,
    name: a.name,
    url: a.url,
    fileType: a.fileType,
    size: a.size,
    tags: a.tags,
    thumbnailUrl: a.thumbnailUrl ?? null,
    createdAt: a.createdAt.toISOString(),
    uploader: {
      name: a.uploader.name ?? null,
      email: a.uploader.email ?? "",
      image: a.uploader.image ?? null,
      status: a.uploader.status ?? "ACTIVE",
    },
  }));

  return <AssetGridClient workspaceSlug={workspaceSlug} assets={assets} />;
}

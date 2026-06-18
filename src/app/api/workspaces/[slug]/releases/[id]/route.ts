import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/lib/authorize";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  const auth = await requireWorkspaceAccess(slug);
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const {
    title,
    artist,
    type,
    status,
    releaseDate,
    announcementDate,
    coverArt,
    trackCount,
    leadSingles,
    description,
  } = body;

  const release = await prisma.release.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(artist !== undefined && { artist }),
      ...(type !== undefined && { type }),
      ...(status !== undefined && { status }),
      ...(releaseDate !== undefined && { releaseDate: new Date(releaseDate) }),
      ...(announcementDate !== undefined && {
        announcementDate: announcementDate ? new Date(announcementDate) : null,
      }),
      ...(coverArt !== undefined && { coverArt: coverArt || null }),
      ...(trackCount !== undefined && { trackCount }),
      ...(leadSingles !== undefined && { leadSingles }),
      ...(description !== undefined && { description: description || null }),
    },
    select: {
      id: true,
      title: true,
      artist: true,
      type: true,
      status: true,
      releaseDate: true,
      announcementDate: true,
      coverArt: true,
      trackCount: true,
      leadSingles: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return Response.json({ release });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  const auth = await requireWorkspaceAccess(slug);
  if (!auth.ok) return auth.response;

  await prisma.release.delete({ where: { id } });

  return Response.json({ ok: true });
}

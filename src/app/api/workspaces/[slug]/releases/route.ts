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

  const releases = await prisma.release.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { releaseDate: "desc" },
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

  return Response.json({ releases });
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

  if (!title || !releaseDate) {
    return Response.json({ error: "title and releaseDate are required" }, { status: 400 });
  }

  const release = await prisma.release.create({
    data: {
      workspaceId: workspace.id,
      title,
      artist: artist ?? "",
      type: type ?? "SINGLE",
      status: status ?? "CONCEPT",
      releaseDate: new Date(releaseDate),
      announcementDate: announcementDate ? new Date(announcementDate) : null,
      coverArt: coverArt || null,
      trackCount: trackCount ?? 1,
      leadSingles: leadSingles ?? [],
      description: description || null,
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

  return Response.json({ release }, { status: 201 });
}

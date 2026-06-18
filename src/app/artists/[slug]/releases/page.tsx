import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { prisma } from "@/lib/prisma";
import { ReleasesClient } from "./ReleasesClient";
import type { ApiRelease } from "@/store/releases-store";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Drops` : "Drops" };
}

export default async function ArtistReleasesPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  // Fetch releases from DB scoped to this workspace
  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true },
  });

  let releases: ApiRelease[] = [];

  if (workspace) {
    const rows = await prisma.release.findMany({
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

    releases = rows.map((r) => ({
      ...r,
      releaseDate: r.releaseDate.toISOString(),
      announcementDate: r.announcementDate ? r.announcementDate.toISOString() : null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  }

  return (
    <>
      <TopBar title={`${ws.artistName} | Command`} subtitle="Every release. One room." />

      <div className="p-6 space-y-6 animate-in max-w-4xl">
        <section>
          <h2 className="text-subheading mb-3">Discography</h2>
          <ReleasesClient slug={slug} initialReleases={releases} />
        </section>
      </div>
    </>
  );
}

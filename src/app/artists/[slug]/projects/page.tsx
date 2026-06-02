import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WORKSPACES } from "@/lib/workspaces";
import { CAAM1K_CAMPAIGNS, CAAM1K_TASKS } from "@/lib/mock-artist2";
import { ArtistProjectsClient } from "./ArtistProjectsClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Campaigns` : "Campaigns" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

export default async function ArtistProjectsPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  return (
    <ArtistProjectsClient
      artistName={ws.artistName}
      campaigns={CAAM1K_CAMPAIGNS}
      tasks={CAAM1K_TASKS}
    />
  );
}

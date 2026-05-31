import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WORKSPACES } from "@/lib/workspaces";
import { CAAM1K_CHANNELS, CAAM1K_MESSAGES, CAAM1K_TEAM } from "@/lib/mock-artist2";
import { ArtistChannelsClient } from "./ArtistChannelsClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Channels` : "Channels" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

export default async function ArtistChannelsPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  return (
    <ArtistChannelsClient
      artistName={ws.artistName}
      channels={CAAM1K_CHANNELS}
      initialMessages={CAAM1K_MESSAGES}
      team={CAAM1K_TEAM}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WORKSPACES } from "@/lib/workspaces";
import { ArtistSettingsClient } from "./ArtistSettingsClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Settings` : "Settings" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

export default async function ArtistSettingsPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  return (
    <ArtistSettingsClient
      artistName={ws.artistName}
      artistHandle={ws.artistHandle ?? ""}
      location={ws.location ?? ""}
      genre={ws.genre ?? ""}
    />
  );
}

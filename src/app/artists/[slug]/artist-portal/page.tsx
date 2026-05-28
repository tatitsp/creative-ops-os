import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CURRENT_USER } from "@/lib/mock-data";
import { WORKSPACES } from "@/lib/workspaces";
import { Caam1kPortalView } from "@/components/artist-portal/Caam1kPortalView";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Artist Portal` : "Artist Portal" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

export default async function ArtistPortalPage({ params }: Props) {
  if (CURRENT_USER.role !== "CREATIVE_OPS_DIRECTOR") notFound();
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  return <Caam1kPortalView />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WORKSPACES } from "@/lib/workspaces";
import { AssetsPageClient } from "@/app/(dashboard)/assets/AssetsPageClient";
import { AssetGrid } from "@/components/assets/AssetGrid";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Asset Library` : "Asset Library" };
}

export const dynamic = "force-dynamic";

export default async function ArtistAssetsPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  return (
    <AssetsPageClient workspaceSlug={slug}>
      <AssetGrid workspaceSlug={slug} />
    </AssetsPageClient>
  );
}

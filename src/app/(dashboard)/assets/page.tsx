import type { Metadata } from "next";
import { AssetsPageClient } from "./AssetsPageClient";
import { AssetGrid } from "@/components/assets/AssetGrid";

export const metadata: Metadata = { title: "Asset Library" };

export default function AssetsPage() {
  return (
    <AssetsPageClient workspaceSlug="lil-tony">
      <AssetGrid workspaceSlug="lil-tony" />
    </AssetsPageClient>
  );
}

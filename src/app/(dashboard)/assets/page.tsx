import type { Metadata } from "next";
import { AssetsPageClient } from "./AssetsPageClient";

export const metadata: Metadata = { title: "Asset Library" };

export default function AssetsPage() {
  return <AssetsPageClient workspaceSlug="lil-tony" />;
}

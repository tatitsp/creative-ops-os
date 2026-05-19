import type { Metadata } from "next";
import { ArtistPortalView } from "@/components/artist-portal/ArtistPortalView";

export const metadata: Metadata = { title: "Artist Portal" };

export default function ArtistPortalPage() {
  return <ArtistPortalView />;
}

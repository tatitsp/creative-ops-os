import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CURRENT_USER } from "@/lib/mock-data";
import { ArtistPortalView } from "@/components/artist-portal/ArtistPortalView";

export const metadata: Metadata = { title: "Artist Portal" };

export default function ArtistPortalPage() {
  if (CURRENT_USER.role !== "CREATIVE_OPS_DIRECTOR") notFound();
  return <ArtistPortalView />;
}

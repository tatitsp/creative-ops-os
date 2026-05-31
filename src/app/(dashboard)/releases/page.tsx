import type { Metadata } from "next";
import { ReleasesPageClient } from "./ReleasesPageClient";

export const metadata: Metadata = { title: "Releases" };

export default function ReleasesPage() {
  return <ReleasesPageClient />;
}

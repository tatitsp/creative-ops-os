import type { Metadata } from "next";
import { TeamPageClient } from "./TeamPageClient";

export const metadata: Metadata = { title: "Team" };

export default function TeamPage() {
  return <TeamPageClient />;
}

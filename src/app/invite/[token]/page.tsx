import type { Metadata } from "next";
import { InvitePageClient } from "./InvitePageClient";

export const metadata: Metadata = { title: "You've been invited — SCOPE" };

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  return <InvitePageClient params={params} />;
}

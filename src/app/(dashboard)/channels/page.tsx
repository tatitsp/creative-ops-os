import type { Metadata } from "next";
import { ChannelsPageClient } from "./ChannelsPageClient";

export const metadata: Metadata = { title: "Messages" };

export default function ChannelsPage() {
  return <ChannelsPageClient />;
}

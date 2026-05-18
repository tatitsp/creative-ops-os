import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getReleaseById, MOCK_RELEASES } from "@/lib/mock-releases";
import { ReleaseRoom } from "@/components/releases/ReleaseRoom";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const release = getReleaseById(id);
  if (!release) return { title: "Release not found" };
  return { title: `${release.title} — ${release.artist}` };
}

export function generateStaticParams() {
  return MOCK_RELEASES.map((r) => ({ id: r.id }));
}

export default async function ReleaseRoomPage({ params }: Props) {
  const { id } = await params;
  const release = getReleaseById(id);

  if (!release) notFound();

  return <ReleaseRoom release={release} />;
}

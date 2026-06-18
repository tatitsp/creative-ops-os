import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { prisma } from "@/lib/prisma";
import { AnalyticsPageClient } from "@/components/analytics/AnalyticsPageClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = await prisma.workspace.findUnique({
    where: { slug },
    select: { name: true },
  });
  return { title: ws ? `${ws.name} — Analytics` : "Analytics" };
}

export default async function ArtistAnalyticsPage({ params }: Props) {
  const { slug } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true, name: true },
  });
  if (!workspace) notFound();

  const entries = await prisma.analyticsEntry.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { recordedAt: "desc" },
    select: {
      id: true,
      platform: true,
      metric: true,
      value: true,
      recordedAt: true,
      notes: true,
      createdAt: true,
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  // Serialize dates for client
  const serialized = entries.map((e) => ({
    ...e,
    recordedAt: e.recordedAt.toISOString(),
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <>
      <TopBar title={`${workspace.name} | Analytics`} subtitle="Manual analytics tracking" />
      <AnalyticsPageClient slug={slug} initialEntries={serialized} />
    </>
  );
}

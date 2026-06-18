import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WORKSPACES } from "@/lib/workspaces";
import { CAAM1K_CONTENT } from "@/lib/mock-artist2";
import { prisma } from "@/lib/prisma";
import { ArtistCalendarClient } from "./ArtistCalendarClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Calendar` : "Calendar" };
}

export const dynamic = "force-dynamic";

export default async function ArtistCalendarPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  // Fetch real calendar events from DB
  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: {
      calendarEvents: {
        orderBy: { startAt: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          startAt: true,
          endAt: true,
          allDay: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  const dbEvents = (workspace?.calendarEvents ?? []).map((e) => ({
    ...e,
    startAt: e.startAt.toISOString(),
    endAt: e.endAt ? e.endAt.toISOString() : null,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));

  return (
    <ArtistCalendarClient
      artistName={ws.artistName}
      content={CAAM1K_CONTENT}
      dbEvents={dbEvents}
      workspaceSlug={slug}
    />
  );
}

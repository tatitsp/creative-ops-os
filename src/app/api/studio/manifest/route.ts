// POST /api/studio/manifest
//
// Takes a concept from the Director's Vision Studio and creates:
//   1. A Campaign record (represents the release)
//   2. A standard Content Pipeline — one ContentItem per phase/format
//
// The workspace is always "lil-tony" for now; the route upserts both
// the user and workspace so it works before the DB is fully seeded.

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Standard content pipeline seeded for every new release
const PIPELINE_TEMPLATE = [
  { title: "Cryptic Teaser",            type: "REEL"          as const, phase: "IDEA"       as const },
  { title: "Single Announcement",       type: "PHOTO"         as const, phase: "PLANNING"   as const },
  { title: "Official Music Video",      type: "VIDEO"         as const, phase: "PRODUCTION" as const },
  { title: "Vertical Edit (60s)",       type: "REEL"          as const, phase: "PRODUCTION" as const },
  { title: "Lyric / Visualizer",        type: "VIDEO"         as const, phase: "IDEA"       as const },
  { title: "Studio BTS Reel",           type: "REEL"          as const, phase: "IDEA"       as const },
  { title: "Press Kit & Bio Copy",      type: "OTHER"         as const, phase: "IDEA"       as const },
  { title: "Release Day Rollout Pack",  type: "CAROUSEL"      as const, phase: "IDEA"       as const },
] as const;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, type, concept, releaseDate } = await req.json();

    if (!title?.trim()) {
      return Response.json({ error: "Release title is required" }, { status: 400 });
    }

    // Upsert user and workspace so this works before full DB seed
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name ?? session.user.email,
        image: session.user.image ?? null,
        role: "CREATIVE_OPS_DIRECTOR",
      },
    });

    const workspace = await prisma.workspace.upsert({
      where: { slug: "lil-tony" },
      update: {},
      create: {
        slug: "lil-tony",
        name: "Lil Tony Official",
        ownerId: user.id,
      },
    });

    // Create the campaign (release)
    const campaign = await prisma.campaign.create({
      data: {
        workspaceId: workspace.id,
        name: title.trim(),
        description: concept?.trim() || null,
        status: "PLANNING",
        phase: "IDEA",
        startDate: new Date(),
        endDate: releaseDate ? new Date(releaseDate) : null,
        tags: [type ?? "RELEASE", "director-manifested"],
      },
    });

    // Seed the content pipeline for this release
    const contentItems = await prisma.$transaction(
      PIPELINE_TEMPLATE.map((item) =>
        prisma.contentItem.create({
          data: {
            campaignId: campaign.id,
            title: `${title.trim()} — ${item.title}`,
            type: item.type,
            phase: item.phase,
          },
        }),
      ),
    );

    return Response.json({ campaign, contentItems }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[studio/manifest] error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}

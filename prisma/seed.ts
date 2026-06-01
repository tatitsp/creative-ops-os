/**
 * Database seed — creates a sample workspace with team, campaigns, content, and tasks.
 * Run: npm run db:seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Creative Ops OS...");

  // Artist CEO (must exist before workspace so it can be set as owner)
  const artist = await prisma.user.upsert({
    where: { email: "jordan@studio.io" },
    update: {},
    create: {
      email: "jordan@studio.io",
      name: "Jordan Ellis",
      role: "ARTIST_CEO",
      status: "ACTIVE",
    },
  });

  // Workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: "creative-ops-demo" },
    update: {},
    create: {
      name: "Creative Ops Studio",
      slug: "creative-ops-demo",
      description: "Demo workspace for Creative Operations OS",
      owner: { connect: { id: artist.id } },
    },
  });

  // Ops Director
  const ops = await prisma.user.upsert({
    where: { email: "maya@studio.io" },
    update: {},
    create: {
      email: "maya@studio.io",
      name: "Maya Chen",
      role: "CREATIVE_OPS_DIRECTOR",
      status: "ACTIVE",
    },
  });

  // Editor
  const editor = await prisma.user.upsert({
    where: { email: "darius@studio.io" },
    update: {},
    create: {
      email: "darius@studio.io",
      name: "Darius King",
      role: "EDITOR",
      status: "BUSY",
    },
  });

  // Add members to workspace
  await prisma.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: artist.id } },
    update: {},
    create: { workspaceId: workspace.id, userId: artist.id, role: "ARTIST_CEO", joinedAt: new Date() },
  });

  await prisma.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: ops.id } },
    update: {},
    create: { workspaceId: workspace.id, userId: ops.id, role: "CREATIVE_OPS_DIRECTOR", joinedAt: new Date() },
  });

  // Campaign
  const campaign = await prisma.campaign.create({
    data: {
      workspaceId: workspace.id,
      name: "Summer Solstice EP Drop",
      description: "Full release campaign for the Summer Solstice EP",
      status: "ACTIVE",
      phase: "PRODUCTION",
      platforms: ["instagram", "tiktok", "spotify", "youtube"],
      startDate: new Date("2026-05-01"),
      endDate: new Date("2026-06-21"),
    },
  });

  // Tasks
  await prisma.task.create({
    data: {
      campaignId: campaign.id,
      creatorId: ops.id,
      assigneeId: editor.id,
      title: "Edit EP trailer video (60s cut)",
      status: "IN_PROGRESS",
      priority: "HIGH",
      type: "DELIVERABLE",
      dueDate: new Date("2026-05-20"),
    },
  });

  // Content
  await prisma.contentItem.create({
    data: {
      campaignId: campaign.id,
      title: "EP Teaser — Track 1 snippet",
      type: "REEL",
      phase: "EDITING",
      platforms: ["instagram", "tiktok"],
      scheduledAt: new Date("2026-05-25T14:00:00Z"),
    },
  });

  // Default channels
  const channelNames = ["general", "announcements", "random"];
  for (const name of channelNames) {
    await prisma.channel.create({
      data: { workspaceId: workspace.id, name, type: name === "announcements" ? "ANNOUNCEMENT" : "TEXT" },
    });
  }

  console.log("Seed complete.");
  console.log(`Workspace: ${workspace.name} (${workspace.slug})`);
  console.log(`Users: ${artist.name}, ${ops.name}, ${editor.name}`);
  console.log(`Campaign: ${campaign.name}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

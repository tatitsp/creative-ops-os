/**
 * Seed: Royal Priesthood client + link existing workspaces
 *
 * Run with: npx tsx prisma/seed-clients.ts
 *
 * This script is idempotent — safe to run multiple times.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Royal Priesthood client…");

  // Create (or find) the Royal Priesthood client
  const client = await prisma.client.upsert({
    where: { slug: "royal-priesthood" },
    update: {},
    create: {
      name: "Royal Priesthood",
      slug: "royal-priesthood",
      type: "LABEL",
      description: "Gospel hip-hop label. Home of Lil Tony Official and Caam1k.",
      brandColor: "#C8923A",
    },
  });

  console.log(`Client: ${client.name} (${client.id})`);

  // Link lil-tony workspace
  const liTony = await prisma.workspace.findUnique({ where: { slug: "lil-tony" } });
  if (liTony) {
    await prisma.workspace.update({
      where: { slug: "lil-tony" },
      data: {
        clientId: client.id,
        dashboardHref: "/dashboard",
        name: liTony.name || "Lil Tony Official",
      },
    });
    console.log("Linked: lil-tony → dashboardHref=/dashboard");
  } else {
    console.log("⚠️  Workspace 'lil-tony' not found in DB. Assign it via admin panel.");
  }

  // Link caam1k workspace
  const caam1k = await prisma.workspace.findUnique({ where: { slug: "caam1k" } });
  if (caam1k) {
    await prisma.workspace.update({
      where: { slug: "caam1k" },
      data: {
        clientId: client.id,
        dashboardHref: "/artists/caam1k/dashboard",
        name: caam1k.name || "Caam1k",
      },
    });
    console.log("Linked: caam1k → dashboardHref=/artists/caam1k/dashboard");
  } else {
    console.log("⚠️  Workspace 'caam1k' not found in DB. Assign it via admin panel.");
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

// POST /api/upload/complete
//
// Step 2 of 2. Called by the client after a successful PUT to the GCS signed
// URL. Creates an Asset record in Prisma so the file appears in the library.
// Upserts the user and workspace if they don't exist yet (no seed required).

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function deriveFileType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.includes("zip") || mimeType.includes("tar") || mimeType.includes("rar"))
    return "archive";
  if (
    mimeType.includes("psd") ||
    mimeType.includes("illustrator") ||
    mimeType.includes("figma") ||
    mimeType.includes("sketch")
  )
    return "design";
  return "document";
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      gcsPath,
      publicUrl,
      originalName,
      mimeType,
      size,
      workspaceSlug,
      tags = [],
      folder,
    } = await req.json();

    if (!gcsPath || !publicUrl || !originalName || !mimeType || !size || !workspaceSlug) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert user from session so uploads work before the DB is fully seeded
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

    // Upsert workspace by slug
    const workspace = await prisma.workspace.upsert({
      where: { slug: workspaceSlug },
      update: {},
      create: {
        slug: workspaceSlug,
        name: workspaceSlug,
        ownerId: user.id,
      },
    });

    // Optionally resolve a named folder to its DB record
    let folderId: string | undefined;
    if (folder) {
      const folderRecord = await prisma.assetFolder.findFirst({
        where: { name: folder, workspaceId: workspace.id },
      });
      folderId = folderRecord?.id;
    }

    const asset = await prisma.asset.create({
      data: {
        workspaceId: workspace.id,
        uploaderId: user.id,
        name: originalName,
        originalName,
        fileType: deriveFileType(mimeType),
        mimeType,
        size,
        url: publicUrl,
        tags,
        folderId,
        metadata: { gcsPath },
      },
    });

    return Response.json({ asset }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[upload/complete] error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}

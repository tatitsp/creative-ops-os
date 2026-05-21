// POST /api/upload/complete
//
// Step 2 of 2. Called by the client after a successful PUT to the GCS signed
// URL. Creates an Asset record in Prisma so the file appears in the library.

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

    // Look up the authenticated user and workspace
    const [user, workspace] = await Promise.all([
      prisma.user.findUnique({ where: { email: session.user.email } }),
      prisma.workspace.findUnique({ where: { slug: workspaceSlug } }),
    ]);

    if (!user) {
      return Response.json(
        { error: `User not found for ${session.user.email}. Run the DB seed first.` },
        { status: 404 },
      );
    }
    if (!workspace) {
      return Response.json(
        { error: `Workspace "${workspaceSlug}" not found. Run the DB seed first.` },
        { status: 404 },
      );
    }

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
        // gcsPath stored in metadata so we can generate signed download URLs later
        metadata: { gcsPath },
      },
    });

    return Response.json({ asset }, { status: 201 });
  } catch (err) {
    console.error("[upload/complete] error:", err);
    return Response.json({ error: "Failed to record asset" }, { status: 500 });
  }
}

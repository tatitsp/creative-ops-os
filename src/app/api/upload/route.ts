// POST /api/upload
//
// Step 1 of 2 in the upload flow. Returns a GCS signed URL so the client can
// PUT the file directly to Google Cloud Storage — no file data passes through
// this server, which keeps large uploads (music videos, masters, photo zips)
// from blowing the Next.js request memory limit.
//
// Step 2: POST /api/upload/complete  (creates the Prisma Asset record)
//
// Bucket CORS requirement:
//   gsutil cors set cors.json gs://YOUR_BUCKET
//   cors.json: [{ "origin": ["*"], "method": ["PUT"], "responseHeader": ["Content-Type"], "maxAgeSeconds": 3600 }]

import { getBucket } from "@/lib/gcs";
import { requirePermission } from "@/lib/authorize";

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { filename, contentType, size, workspaceSlug } = body;

    // Auth + permission check before touching GCS
    const authResult = await requirePermission(workspaceSlug ?? "", "upload_assets");
    if (!authResult.ok) return authResult.response;

    if (!filename || !contentType || typeof size !== "number") {
      return Response.json(
        { error: "filename, contentType, and size are required" },
        { status: 400 },
      );
    }

    if (!filename || !contentType || typeof size !== "number") {
      return Response.json(
        { error: "filename, contentType, and size are required" },
        { status: 400 },
      );
    }

    // Scope files under assets/ with a timestamp prefix to avoid collisions
    const safe = sanitizeFilename(filename);
    const gcsPath = `assets/${Date.now()}_${safe}`;

    // Signed URL is valid for 15 minutes — enough for very large files on slow
    // connections. The client must PUT with the exact Content-Type supplied here.
    const [signedUrl] = await getBucket().file(gcsPath).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    });

    const publicUrl = `https://storage.googleapis.com/${process.env.GOOGLE_STORAGE_BUCKET}/${gcsPath}`;

    return Response.json({ signedUrl, gcsPath, publicUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[upload] signed URL error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}

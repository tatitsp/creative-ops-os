import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requirePlatformAccess } from "@/lib/authorize";

// GET /api/admin/clients — list all clients (platform partners can read)
export async function GET() {
  const auth = await requirePlatformAccess();
  if (!auth.ok) return auth.response;

  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      brandColor: true,
      status: true,
      description: true,
      createdAt: true,
      _count: { select: { workspaces: true } },
    },
  });

  return Response.json({ clients });
}

// POST /api/admin/clients — create a new client
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const { name, slug, type, description, brandColor } = body;

  if (!name || !slug) {
    return Response.json({ error: "name and slug are required" }, { status: 400 });
  }

  // Check slug uniqueness
  const existing = await prisma.client.findUnique({ where: { slug } });
  if (existing) {
    return Response.json({ error: "Slug already taken" }, { status: 409 });
  }

  const client = await prisma.client.create({
    data: {
      name,
      slug,
      type: type ?? "LABEL",
      description: description || null,
      brandColor: brandColor ?? "#7C3AED",
    },
  });

  return Response.json({ client }, { status: 201 });
}

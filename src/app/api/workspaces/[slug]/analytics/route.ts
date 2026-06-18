import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorize";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const auth = await requirePermission(slug, "view_analytics");
  if (!auth.ok) return auth.response;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");
  const metric = searchParams.get("metric");

  const entries = await prisma.analyticsEntry.findMany({
    where: {
      workspaceId: workspace.id,
      ...(platform ? { platform } : {}),
      ...(metric ? { metric } : {}),
    },
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

  return Response.json({ entries });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const auth = await requirePermission(slug, "view_analytics");
  if (!auth.ok) return auth.response;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

  const body = await req.json();
  const { platform, metric, value, recordedAt, notes } = body;

  if (!platform || !metric || value === undefined) {
    return Response.json(
      { error: "platform, metric, and value are required" },
      { status: 400 }
    );
  }

  const entry = await prisma.analyticsEntry.create({
    data: {
      workspaceId: workspace.id,
      platform,
      metric,
      value: Number(value),
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
      notes: notes || null,
      createdById: auth.ctx.userId,
    },
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

  return Response.json({ entry }, { status: 201 });
}

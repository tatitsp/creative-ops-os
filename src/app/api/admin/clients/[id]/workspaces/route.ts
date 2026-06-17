import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorize";

// POST /api/admin/clients/[id]/workspaces
// Body: { existingWorkspaceId } OR { name, slug, plan?, dashboardHref? }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id: clientId } = await params;

  // Verify client exists
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) {
    return Response.json({ error: "Client not found" }, { status: 404 });
  }

  const body = await req.json();

  if (body.existingWorkspaceId) {
    // Assign existing workspace to this client
    const workspace = await prisma.workspace.update({
      where: { id: body.existingWorkspaceId },
      data: { clientId },
    });
    return Response.json({ workspace });
  }

  // Create new workspace under this client
  const { name, slug, plan, dashboardHref } = body;
  if (!name || !slug) {
    return Response.json({ error: "name and slug are required" }, { status: 400 });
  }

  const existing = await prisma.workspace.findUnique({ where: { slug } });
  if (existing) {
    return Response.json({ error: "Slug already taken" }, { status: 409 });
  }

  // Use admin as the owner
  const owner = await prisma.user.findFirst({
    where: { email: auth.ctx.email },
    select: { id: true },
  });

  if (!owner) {
    return Response.json({ error: "Owner user not found" }, { status: 400 });
  }

  const workspace = await prisma.workspace.create({
    data: {
      name,
      slug,
      plan: plan ?? "STARTER",
      dashboardHref: dashboardHref || null,
      ownerId: owner.id,
      clientId,
    },
  });

  return Response.json({ workspace }, { status: 201 });
}

// DELETE /api/admin/clients/[id]/workspaces — unlink workspace from client
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id: clientId } = await params;
  const body = await req.json();
  const { workspaceId } = body;

  if (!workspaceId) {
    return Response.json({ error: "workspaceId required" }, { status: 400 });
  }

  await prisma.workspace.update({
    where: { id: workspaceId, clientId },
    data: { clientId: null },
  });

  return Response.json({ ok: true });
}

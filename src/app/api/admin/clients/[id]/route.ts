import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorize";

// PATCH /api/admin/clients/[id] — update client
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await req.json();
  const { name, slug, type, status, description, brandColor } = body;

  // Check slug uniqueness if changed
  if (slug) {
    const conflict = await prisma.client.findFirst({
      where: { slug, NOT: { id } },
    });
    if (conflict) {
      return Response.json({ error: "Slug already taken" }, { status: 409 });
    }
  }

  const client = await prisma.client.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(type !== undefined && { type }),
      ...(status !== undefined && { status }),
      ...(description !== undefined && { description: description || null }),
      ...(brandColor !== undefined && { brandColor }),
    },
  });

  return Response.json({ client });
}

// DELETE /api/admin/clients/[id] — delete client (unlinks workspaces, doesn't delete them)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  // Unlink workspaces first
  await prisma.workspace.updateMany({
    where: { clientId: id },
    data: { clientId: null },
  });

  await prisma.client.delete({ where: { id } });

  return Response.json({ ok: true });
}

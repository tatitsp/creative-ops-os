// PATCH  /api/admin/users/[id]  — update role or status (suspend/reactivate)
// DELETE /api/admin/users/[id]  — remove all workspace access (does not delete the record)

import { requireAdmin } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const { role, status } = await req.json();
  const data: Record<string, string> = {};
  if (role) data.role = role;
  if (status) data.status = status;

  if (Object.keys(data).length === 0) {
    return Response.json({ error: "Nothing to update" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, role: true, status: true },
  });

  return Response.json({ user });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  // Remove all workspace memberships — user can no longer access any workspace
  await prisma.workspaceMember.deleteMany({ where: { userId: id } });

  return Response.json({ ok: true });
}

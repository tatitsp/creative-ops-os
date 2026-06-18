// PATCH  /api/admin/users/[id]  — update role, status, or platformRole
// DELETE /api/admin/users/[id]  — remove all workspace access

import { requireAdmin, requirePlatformAccess } from "@/lib/authorize";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // platformRole changes are admin-only; role/status changes allow platform partners
  const body = await req.json();
  const { role, status, platformRole } = body;

  const authResult = platformRole !== undefined
    ? await requireAdmin()
    : await requirePlatformAccess();
  if (!authResult.ok) return authResult.response;

  const { id } = await params;

  // Prevent anyone from changing the platformRole of the primary admin account
  if (platformRole !== undefined) {
    const target = await prisma.user.findUnique({ where: { id }, select: { email: true } });
    if (target && isAdminEmail(target.email)) {
      return Response.json({ error: "Cannot change the role of the primary admin account" }, { status: 403 });
    }
  }

  const data: Record<string, string> = {};
  if (role) data.role = role;
  if (status) data.status = status;
  if (platformRole !== undefined) data.platformRole = platformRole;

  if (Object.keys(data).length === 0) {
    return Response.json({ error: "Nothing to update" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, role: true, platformRole: true, status: true },
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

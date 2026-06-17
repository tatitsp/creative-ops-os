// DELETE /api/admin/users/[id]/workspaces/[wid]
// — removes a user from a specific workspace

import { requireAdmin } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const { wid } = await req.json();

  await prisma.workspaceMember.deleteMany({
    where: { userId: id, workspaceId: wid },
  });

  return Response.json({ ok: true });
}

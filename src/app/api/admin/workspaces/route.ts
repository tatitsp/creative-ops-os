// GET /api/admin/workspaces — list all workspaces with member counts

import { requireAdmin } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const workspaces = await prisma.workspace.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      plan: true,
      createdAt: true,
      _count: { select: { members: true } },
      members: {
        select: {
          role: true,
          user: { select: { id: true, email: true, name: true, image: true } },
        },
      },
    },
  });

  return Response.json({ workspaces });
}

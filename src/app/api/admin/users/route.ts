// GET  /api/admin/users        — list all users with workspace memberships
// POST /api/admin/users        — assign a user to a workspace with a role

import { requireAdmin, requirePlatformAccess } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requirePlatformAccess();
  if (!auth.ok) return auth.response;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      platformRole: true,
      status: true,
      createdAt: true,
      workspaceMemberships: {
        select: {
          role: true,
          workspace: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });

  return Response.json({ users });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { userId, workspaceId, role } = await req.json();
  if (!userId || !workspaceId || !role) {
    return Response.json({ error: "userId, workspaceId, and role are required" }, { status: 400 });
  }

  const membership = await prisma.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId, userId } },
    update: { role },
    create: { workspaceId, userId, role, joinedAt: new Date() },
  });

  return Response.json({ membership }, { status: 201 });
}

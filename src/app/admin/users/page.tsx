import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WORKSPACES } from "@/lib/workspaces";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";

export const metadata: Metadata = { title: "Admin — Users" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();
  const isAdmin = session?.user?.isAdmin === true;

  const [users, workspaces] = await Promise.all([
    prisma.user.findMany({
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
    }),
    prisma.workspace.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  const allWorkspaces = workspaces.length > 0
    ? workspaces
    : WORKSPACES.map((ws) => ({ id: ws.slug, name: ws.artistName, slug: ws.slug }));

  return <AdminUsersClient users={users} workspaces={allWorkspaces} isAdmin={isAdmin} />;
}

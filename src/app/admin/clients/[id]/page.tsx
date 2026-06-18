import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminClientDetailClient } from "@/components/admin/AdminClientDetailClient";

export const metadata: Metadata = { title: "Admin — Client Detail" };
export const dynamic = "force-dynamic";

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const isAdmin = session?.user?.isAdmin === true;

  const [client, allWorkspaces, allUsers] = await Promise.all([
    prisma.client.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        brandColor: true,
        status: true,
        description: true,
        workspaces: {
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
            dashboardHref: true,
            _count: { select: { members: true } },
            members: {
              select: {
                role: true,
                user: { select: { id: true, email: true, name: true, image: true } },
              },
            },
          },
          orderBy: { name: "asc" },
        },
      },
    }),
    prisma.workspace.findMany({
      where: { clientId: null },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      select: { id: true, email: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!client) notFound();

  return (
    <AdminClientDetailClient
      client={client}
      unassignedWorkspaces={allWorkspaces}
      allUsers={allUsers}
      isAdmin={isAdmin}
    />
  );
}

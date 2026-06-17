import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminClientsClient } from "@/components/admin/AdminClientsClient";

export const metadata: Metadata = { title: "Admin — Clients" };
export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      brandColor: true,
      status: true,
      description: true,
      createdAt: true,
      _count: { select: { workspaces: true } },
    },
  });

  return <AdminClientsClient clients={clients} />;
}

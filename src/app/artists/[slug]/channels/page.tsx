import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChannelsPageClient } from "@/components/channels/ChannelsPageClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = await prisma.workspace.findUnique({ where: { slug }, select: { name: true } });
  return { title: ws ? `${ws.name} — Channels` : "Channels" };
}

export default async function ArtistChannelsPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect("/sign-in");

  const { isAdmin, workspaceSlugs, role } = session.user;
  if (!isAdmin && !workspaceSlugs.includes(slug)) redirect("/command-center");
  const canManageChannels = isAdmin || role === "OWNER" || role === "CREATIVE_OPS_DIRECTOR" || role === "MANAGEMENT";

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true, name: true },
  });
  if (!workspace) notFound();

  const channels = await prisma.channel.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });

  return (
    <ChannelsPageClient
      slug={slug}
      canManageChannels={canManageChannels}
      initialChannels={channels.map((c) => ({
        ...c,
        type: "TEXT",
        isPrivate: false,
        isPinned: false,
        createdAt: c.createdAt.toISOString(),
        createdBy: c.createdBy
          ? { id: c.createdBy.id, name: c.createdBy.name, email: c.createdBy.email }
          : null,
      }))}
    />
  );
}

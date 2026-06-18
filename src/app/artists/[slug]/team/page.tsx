import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { prisma } from "@/lib/prisma";
import { TeamPageClient, type ApiMember } from "@/components/team/TeamPageClient";
import { auth } from "@/lib/auth";
import { roleHasPermission } from "@/lib/permissions";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Team` : "Team" };
}

export const dynamic = "force-dynamic";

export default async function ArtistTeamPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: {
      id: true,
      members: {
        orderBy: { invitedAt: "asc" },
        select: {
          id: true,
          role: true,
          invitedAt: true,
          joinedAt: true,
          user: {
            select: { id: true, name: true, email: true, image: true, status: true },
          },
        },
      },
    },
  });

  const members: ApiMember[] = (workspace?.members ?? []).map((m) => ({
    ...m,
    invitedAt: m.invitedAt.toISOString(),
    joinedAt: m.joinedAt ? m.joinedAt.toISOString() : null,
  }));

  // Determine if the current session user can manage team
  const session = await auth();
  const sessionRole = session?.user?.role ?? "";
  const sessionIsAdmin = session?.user?.isAdmin ?? false;
  const canManage =
    sessionIsAdmin ||
    roleHasPermission(sessionRole, "manage_team");

  return (
    <>
      <TopBar title="Team" subtitle={ws.artistName} />
      <TeamPageClient
        workspaceSlug={slug}
        initialMembers={members}
        canManage={canManage}
      />
    </>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WORKSPACES } from "@/lib/workspaces";
import { ClientFolderCard } from "@/components/workspace/ClientFolderCard";
import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";

export const metadata: Metadata = { title: "Command Center — SCOPE" };
export const dynamic = "force-dynamic";

export default async function CommandCenterPage() {
  const session = await auth();

  if (!session?.user?.email) redirect("/sign-in");

  const { email, name, workspaceSlugs, isAdmin } = session.user;

  if (!isAdmin && workspaceSlugs.length === 0) redirect("/access-pending");

  const firstName = name?.split(" ")[0] ?? email.split("@")[0];

  // ── Fetch data from DB ───────────────────────────────────────────────────
  const [dbClients, dbWorkspaces, dbAllWorkspaceSlugs] = await Promise.all([
    // Clients with workspace counts
    prisma.client.findMany({
      where: isAdmin
        ? {}
        : { workspaces: { some: { slug: { in: workspaceSlugs } } } },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        brandColor: true,
        status: true,
        _count: { select: { workspaces: true } },
      },
      orderBy: { name: "asc" },
    }),
    // Workspaces not linked to any client (unassigned)
    prisma.workspace.findMany({
      where: {
        clientId: null,
        ...(isAdmin ? {} : { slug: { in: workspaceSlugs } }),
      },
      select: { id: true, name: true, slug: true, dashboardHref: true },
      orderBy: { name: "asc" },
    }),
    // All workspace slugs in the DB (client-linked OR not) — used to detect
    // static workspaces with no DB record yet so we can always show them.
    prisma.workspace.findMany({
      where: isAdmin ? {} : { slug: { in: workspaceSlugs } },
      select: { slug: true },
    }),
  ]);

  // ── Determine what to show ───────────────────────────────────────────────

  // Set of every workspace slug that exists anywhere in the DB
  const dbSlugSet = new Set(dbAllWorkspaceSlugs.map((w) => w.slug));

  // Unassigned DB workspaces enriched with static data for richer display
  const unassignedCards = dbWorkspaces
    .map((dw) => WORKSPACES.find((sw) => sw.slug === dw.slug) ?? null)
    .filter(Boolean) as typeof WORKSPACES;

  // Static workspaces with NO DB record at all — always show in Direct Access
  // regardless of whether clients exist, so they never silently disappear.
  const staticOrphans = WORKSPACES.filter(
    (ws) =>
      (isAdmin || workspaceSlugs.includes(ws.slug)) && !dbSlugSet.has(ws.slug)
  );

  // Combined Direct Access section
  const directAccess = [...unassignedCards, ...staticOrphans];

  // Client cards
  const clientCards = dbClients.map((c) => ({
    name: c.name,
    slug: c.slug,
    type: c.type,
    brandColor: c.brandColor,
    status: c.status,
    workspaceCount: c._count.workspaces,
  }));

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#0A0A0A" }}
    >
      {/* SCOPE wordmark */}
      <p className="text-xs font-black tracking-[-0.02em] text-white mb-12 opacity-40">
        SCOPE
      </p>

      {/* Greeting */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          Welcome back, {firstName}.
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          {clientCards.length > 0 ? "Choose a client to continue." : "Choose a workspace to continue."}
        </p>
      </div>

      {/* Client folders */}
      {clientCards.length > 0 && (
        <div className="w-full max-w-xl mb-8">
          <p
            className="text-2xs tracking-[0.2em] uppercase font-semibold mb-4"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Clients
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clientCards.map((c) => (
              <ClientFolderCard key={c.slug} client={c} />
            ))}
          </div>
        </div>
      )}

      {/* Direct Access — unassigned DB workspaces + static workspaces with no DB record */}
      {directAccess.length > 0 && (
        <div className="w-full max-w-xl mb-8">
          {clientCards.length > 0 && (
            <p
              className="text-2xs tracking-[0.2em] uppercase font-semibold mb-4"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              Direct Access
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {directAccess.map((ws) => (
              <WorkspaceCard key={ws.slug} workspace={ws} />
            ))}
          </div>
        </div>
      )}

      {/* Admin link */}
      {isAdmin && (
        <Link
          href="/admin/clients"
          className="mt-10 text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Admin panel →
        </Link>
      )}

      {/* Footer */}
      <p
        className="mt-14 text-[0.6rem] tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.08)" }}
      >
        © 2026 The Sighte Project
      </p>
    </div>
  );
}

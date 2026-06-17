import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WORKSPACES } from "@/lib/workspaces";
import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = await prisma.client.findUnique({
    where: { slug },
    select: { name: true },
  });
  return { title: client ? `${client.name} — SCOPE` : "Client — SCOPE" };
}

export default async function ClientPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user?.email) redirect("/sign-in");

  const { workspaceSlugs, isAdmin } = session.user;

  if (!isAdmin && workspaceSlugs.length === 0) redirect("/access-pending");

  // Fetch client with its workspaces
  const client = await prisma.client.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      brandColor: true,
      status: true,
      workspaces: {
        where: isAdmin ? {} : { slug: { in: workspaceSlugs } },
        select: { id: true, name: true, slug: true, dashboardHref: true, photo: true },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!client) notFound();

  // If user has no access to any workspace in this client, bounce back
  if (!isAdmin && client.workspaces.length === 0) redirect("/command-center");

  // If only one workspace, skip selection and go straight in
  if (client.workspaces.length === 1) {
    const ws = client.workspaces[0];
    const staticWs = WORKSPACES.find((sw) => sw.slug === ws.slug);
    const href = ws.dashboardHref ?? staticWs?.href ?? `/w/${ws.slug}`;
    redirect(href);
  }

  // Enrich DB workspaces with static data where available
  const enriched = client.workspaces.map((ws) => {
    const staticWs = WORKSPACES.find((sw) => sw.slug === ws.slug);
    if (staticWs) return staticWs;
    // Minimal display object for DB-only workspaces
    return {
      slug: ws.slug,
      artistName: ws.name,
      artistHandle: `@${ws.slug}`,
      photo: ws.photo ?? "",
      location: "",
      activeRelease: "",
      releaseType: "",
      releaseStatus: "ACTIVE" as const,
      href: ws.dashboardHref ?? `/w/${ws.slug}`,
      monthlyListeners: "",
      genre: "",
    };
  });

  const TYPE_LABELS: Record<string, string> = {
    LABEL: "Label",
    ARTIST: "Artist",
    BUSINESS: "Business",
    AGENCY: "Agency",
    OTHER: "Other",
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#0A0A0A" }}
    >
      {/* Back link */}
      <Link
        href="/command-center"
        className="flex items-center gap-1 text-xs mb-12 transition-opacity hover:opacity-70"
        style={{ color: "rgba(255,255,255,0.25)" }}
      >
        <ChevronLeft className="w-3 h-3" />
        Command Center
      </Link>

      {/* Client header */}
      <div className="text-center mb-10">
        {/* Color dot */}
        <div
          className="w-2 h-2 rounded-full mx-auto mb-4 opacity-70"
          style={{ background: client.brandColor }}
        />
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          {client.name}
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          {TYPE_LABELS[client.type] ?? client.type} · Choose a workspace.
        </p>
      </div>

      {/* Workspace cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
        {enriched.map((ws) => (
          <WorkspaceCard key={ws.slug} workspace={ws} />
        ))}
      </div>

      {/* Admin edit link */}
      {isAdmin && (
        <Link
          href={`/admin/clients/${client.id}`}
          className="mt-10 text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          Edit client →
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

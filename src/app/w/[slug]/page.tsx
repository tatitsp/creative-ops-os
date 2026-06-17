import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ws = await prisma.workspace.findUnique({
    where: { slug },
    select: { name: true },
  });
  return { title: ws ? `${ws.name} — SCOPE` : "Workspace — SCOPE" };
}

export default async function GenericWorkspacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user?.email) redirect("/sign-in");

  const { workspaceSlugs, isAdmin } = session.user;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      plan: true,
      client: { select: { name: true, slug: true, brandColor: true } },
      _count: { select: { members: true, projects: true } },
    },
  });

  if (!workspace) notFound();

  // Access check
  if (!isAdmin && !workspaceSlugs.includes(slug)) redirect("/command-center");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#0A0A0A" }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-12" style={{ color: "rgba(255,255,255,0.25)" }}>
        <Link href="/command-center" className="hover:opacity-70 transition-opacity">Command Center</Link>
        {workspace.client && (
          <>
            <span>/</span>
            <Link href={`/clients/${workspace.client.slug}`} className="hover:opacity-70 transition-opacity">
              {workspace.client.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span style={{ color: "rgba(255,255,255,0.5)" }}>{workspace.name}</span>
      </div>

      {/* Workspace name */}
      <div className="text-center mb-10">
        {workspace.client && (
          <div
            className="w-2 h-2 rounded-full mx-auto mb-4 opacity-70"
            style={{ background: workspace.client.brandColor }}
          />
        )}
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
          {workspace.name}
        </h1>
        {workspace.description && (
          <p className="text-sm max-w-sm mx-auto" style={{ color: "rgba(255,255,255,0.35)" }}>
            {workspace.description}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8 mb-10">
        <div className="text-center">
          <p className="text-2xl font-black text-white">{workspace._count.members}</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Members</p>
        </div>
        <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="text-center">
          <p className="text-2xl font-black text-white">{workspace._count.projects}</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Projects</p>
        </div>
        <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-white">{workspace.plan}</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Plan</p>
        </div>
      </div>

      <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
        This workspace is being set up. Check back soon.
      </p>

      {/* Footer */}
      <p
        className="mt-16 text-[0.6rem] tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.08)" }}
      >
        © 2026 The Sighte Project
      </p>
    </div>
  );
}

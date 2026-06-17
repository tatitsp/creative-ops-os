import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";
import { WORKSPACES } from "@/lib/workspaces";

export const metadata: Metadata = { title: "Select Workspace — SCOPE" };

export default async function SelectWorkspacePage() {
  const session = await auth();

  if (!session?.user?.email) redirect("/sign-in");

  const { email, name, workspaceSlugs, isAdmin } = session.user;
  const firstName = name?.split(" ")[0] ?? email.split("@")[0];

  if (!isAdmin && workspaceSlugs.length === 0) redirect("/access-pending");

  const visibleWorkspaces = isAdmin
    ? WORKSPACES
    : WORKSPACES.filter((ws) => workspaceSlugs.includes(ws.slug));

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#0A0A0A" }}
    >
      {/* SCOPE wordmark */}
      <p
        className="text-xs font-black tracking-[-0.02em] text-white mb-12 opacity-40"
      >
        SCOPE
      </p>

      {/* Greeting */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          Welcome back, {firstName}.
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          Choose a workspace to continue.
        </p>
      </div>

      {/* Workspace cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
        {visibleWorkspaces.map((ws) => (
          <WorkspaceCard key={ws.slug} workspace={ws} />
        ))}
      </div>

      {/* Admin link */}
      {isAdmin && (
        <a
          href="/admin/users"
          className="mt-8 text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Admin panel →
        </a>
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

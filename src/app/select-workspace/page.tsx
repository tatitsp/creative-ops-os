import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";
import { WORKSPACES } from "@/lib/workspaces";

export const metadata: Metadata = { title: "Select Workspace" };

export default async function SelectWorkspacePage() {
  const session = await auth();

  if (!session?.user?.email) redirect("/sign-in");

  const { email, name, workspaceSlugs, isAdmin } = session.user;
  const firstName = name?.split(" ")[0] ?? email.split("@")[0];

  // Users with no workspace assignment go to the access-pending screen
  if (!isAdmin && workspaceSlugs.length === 0) {
    redirect("/access-pending");
  }

  // Filter the static workspace list down to what this user can see.
  // Admins see everything. ARTIST_CEO is handled before this page in page.tsx.
  const visibleWorkspaces = isAdmin
    ? WORKSPACES
    : WORKSPACES.filter((ws) => workspaceSlugs.includes(ws.slug));

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#000000" }}
    >
      {/* Header */}
      <div className="text-center mb-10">
        <p
          className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase mb-4"
          style={{ color: "rgba(200,146,58,0.7)" }}
        >
          Royal Priesthood
        </p>
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
          className="mt-8 text-xs tracking-widest uppercase"
          style={{ color: "rgba(200,146,58,0.6)" }}
        >
          Admin panel →
        </a>
      )}

      {/* Footer */}
      <p
        className="mt-14 text-[0.6rem] tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.1)" }}
      >
        Powered by Scope
      </p>
    </div>
  );
}

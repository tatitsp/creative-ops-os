import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { WORKSPACES } from "@/lib/workspaces";
import { SignInButton } from "@/components/auth/SignInButton";

export default async function RootPage() {
  const session = await auth();

  // ── Authenticated: route to the right place ───────────────────────────────

  if (session?.user?.email) {
    const { role, isAdmin, workspaceSlugs } = session.user;

    if (!isAdmin && workspaceSlugs.length === 0) redirect("/access-pending");

    // Admin or multi-workspace → let them choose
    if (isAdmin || workspaceSlugs.length > 1) redirect("/select-workspace");

    // Single workspace → go straight in
    if (workspaceSlugs.length === 1) {
      const ws = WORKSPACES.find((w) => w.slug === workspaceSlugs[0]);
      if (ws) redirect(ws.href);
      redirect("/select-workspace");
    }

    // Artist/CEO with a workspace
    if (role === "ARTIST_CEO" && workspaceSlugs[0]) {
      redirect(`/artists/${workspaceSlugs[0]}/dashboard`);
    }

    redirect("/select-workspace");
  }

  // ── Unauthenticated: SCOPE landing page ───────────────────────────────────

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0A0A0A" }}
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6">
        <span
          className="text-sm font-black tracking-[-0.04em] text-white"
          style={{ letterSpacing: "-0.04em" }}
        >
          SCOPE
        </span>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-lg">
          {/* Wordmark */}
          <h1
            className="font-black text-white mb-4"
            style={{
              fontSize: "clamp(3rem, 10vw, 5.5rem)",
              letterSpacing: "-0.05em",
              lineHeight: 0.92,
            }}
          >
            SCOPE
          </h1>

          {/* Tagline */}
          <p
            className="text-sm font-semibold tracking-[0.25em] uppercase mb-6"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Creative Operations OS
          </p>

          {/* Description */}
          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            The centralized creative infrastructure for artists, teams,
            and content ecosystems. Campaign management, asset delivery,
            team coordination — in one place.
          </p>

          <SignInButton />
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 flex items-center justify-between">
        <p
          className="text-[0.6rem] tracking-[0.2em] uppercase"
          style={{ color: "rgba(255,255,255,0.1)" }}
        >
          © 2026 The Sighte Project
        </p>
        <p
          className="text-[0.6rem] tracking-[0.2em] uppercase"
          style={{ color: "rgba(255,255,255,0.1)" }}
        >
          Built for creative teams
        </p>
      </footer>
    </div>
  );
}

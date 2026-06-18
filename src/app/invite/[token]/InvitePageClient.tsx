"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { use } from "react";

type InviteInfo = {
  token: string;
  email: string | null;
  role: string;
  expiresAt: string;
  workspace: { name: string; slug: string; photo: string | null };
};

const ROLE_LABELS: Record<string, string> = {
  ARTIST_CEO: "Artist / CEO",
  MANAGEMENT: "Management",
  CREATIVE_OPS_DIRECTOR: "Creative Ops Director",
  CREATIVE_ASSISTANT: "Creative Assistant",
  PHOTOGRAPHER_VIDEOGRAPHER: "Photographer / Videographer",
  EDITOR: "Editor",
  SOCIAL_MEDIA: "Social Media",
  GRAPHIC_DESIGNER: "Graphic Designer",
  CONTRACTOR: "Contractor",
};

export function InvitePageClient({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const { data: session, status } = useSession();
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    fetch(`/api/invite/${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setInvite(d.invite);
      })
      .catch(() => setError("Failed to load invite"));
  }, [token]);

  // If user just signed in and invite is loaded, auto-accept
  useEffect(() => {
    if (status === "authenticated" && invite && !accepted && !accepting) {
      handleAccept();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, invite]);

  async function handleAccept() {
    setAccepting(true);
    try {
      const res = await fetch(`/api/invite/${token}/accept`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to accept invite");
        setAccepting(false);
        return;
      }
      setAccepted(true);
      setTimeout(() => {
        window.location.href = data.redirectTo;
      }, 1500);
    } catch {
      setError("Something went wrong");
      setAccepting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ background: "#0A0A0A" }}>
      <p className="text-xs font-black tracking-[-0.02em] text-white mb-12 opacity-40">SCOPE</p>

      {error ? (
        <div className="text-center">
          <p className="text-sm font-semibold text-white mb-2">This invite is no longer valid</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{error}</p>
        </div>
      ) : !invite ? (
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Loading invite…</p>
      ) : accepted ? (
        <div className="text-center">
          <p className="text-sm font-semibold text-white mb-2">You're in.</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Redirecting to {invite.workspace.name}…</p>
        </div>
      ) : (
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            You've been invited
          </h1>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
            Join <strong className="text-white">{invite.workspace.name}</strong> as{" "}
            <strong className="text-white">{ROLE_LABELS[invite.role] ?? invite.role}</strong>
          </p>

          {invite.email && (
            <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
              This invite is for {invite.email}
            </p>
          )}

          {status === "unauthenticated" ? (
            <button
              onClick={() => signIn("google", { callbackUrl: `/invite/${token}` })}
              className="w-full py-3 rounded-xl font-semibold text-sm text-black bg-white hover:bg-white/90 transition-colors"
            >
              Sign in with Google to accept
            </button>
          ) : status === "loading" || accepting ? (
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              {accepting ? "Accepting…" : "Checking session…"}
            </p>
          ) : null}

          <p className="text-xs mt-6" style={{ color: "rgba(255,255,255,0.2)" }}>
            Expires {new Date(invite.expiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      )}

      <p className="mt-16 text-[0.6rem] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.08)" }}>
        © 2026 The Sighte Project
      </p>
    </div>
  );
}

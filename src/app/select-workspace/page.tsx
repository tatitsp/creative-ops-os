import type { Metadata } from "next";
import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";
import { WORKSPACES } from "@/lib/workspaces";
import { CURRENT_USER } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Select Workspace" };

export default function SelectWorkspacePage() {
  const firstName = CURRENT_USER.displayName ?? CURRENT_USER.name.split(" ")[0];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#050505" }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #C8923A 0%, #A07228 100%)" }}
          >
            <span className="text-[0.5rem] font-black text-white tracking-tight">SC</span>
          </div>
          <span className="text-xs font-semibold text-white/40 tracking-widest uppercase">SCOPE</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          Welcome back, {firstName}.
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          Select an artist workspace to enter.
        </p>
      </div>

      {/* Workspace cards */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
        {WORKSPACES.map((ws) => (
          <WorkspaceCard key={ws.slug} workspace={ws} />
        ))}
      </div>

      {/* Footer */}
      <p
        className="absolute bottom-8 text-[0.6rem] tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.12)" }}
      >
        Royal Priesthood · SCOPE
      </p>
    </div>
  );
}

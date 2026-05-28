import type { Metadata } from "next";
import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";
import { WORKSPACES } from "@/lib/workspaces";
import { CURRENT_USER } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Select Workspace" };

export default function SelectWorkspacePage() {
  const firstName = CURRENT_USER.displayName ?? CURRENT_USER.name.split(" ")[0];

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

      {/* Cards — equal width, side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
        {WORKSPACES.map((ws) => (
          <WorkspaceCard key={ws.slug} workspace={ws} />
        ))}
      </div>

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

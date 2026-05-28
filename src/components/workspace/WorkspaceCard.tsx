import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Radio } from "lucide-react";
import type { Workspace } from "@/lib/workspaces";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:   "bg-emerald-500",
  PLANNING: "bg-gold",
  COMPLETE: "bg-ink-tertiary",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE:   "Active",
  PLANNING: "Planning",
  COMPLETE: "Complete",
};

export function WorkspaceCard({ workspace: ws }: { workspace: Workspace }) {
  return (
    <Link
      href={ws.href}
      className="flex flex-col gap-4 p-5 rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] hover:border-[#2A2A2A] hover:bg-[#111111] transition-all group"
    >
      {/* Artist photo + name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-[#1A1A1A]">
          <Image
            src={ws.photo}
            alt={ws.artistName}
            width={40}
            height={40}
            className="w-full h-full object-cover object-top"
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white leading-tight truncate">{ws.artistName}</p>
          <p className="text-2xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
            {ws.artistHandle}
          </p>
        </div>
        <ChevronRight
          className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5"
          style={{ color: "rgba(255,255,255,0.2)" }}
        />
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

      {/* Release + stats */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_COLORS[ws.releaseStatus]}`} />
            <span className="text-2xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
              {ws.activeRelease} · {ws.releaseType}
            </span>
          </div>
          <span
            className="text-2xs font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}
          >
            {STATUS_LABELS[ws.releaseStatus]}
          </span>
        </div>

        <div className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.3)" }}>
          <Radio className="w-3 h-3" />
          <span className="text-2xs font-semibold">{ws.monthlyListeners} monthly listeners</span>
        </div>

        <p className="text-2xs" style={{ color: "rgba(255,255,255,0.25)" }}>{ws.genre}</p>
      </div>
    </Link>
  );
}

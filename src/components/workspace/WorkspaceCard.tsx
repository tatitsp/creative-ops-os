"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Music, Radio } from "lucide-react";
import type { Workspace } from "@/lib/workspaces";

const STATUS_CONFIG = {
  ACTIVE: { label: "Active rollout", color: "#22C55E" },
  PLANNING: { label: "In planning", color: "#C8923A" },
  COMPLETE: { label: "Complete", color: "#555555" },
} as const;

export function WorkspaceCard({ workspace: ws }: { workspace: Workspace }) {
  const [hovered, setHovered] = useState(false);
  const status = STATUS_CONFIG[ws.releaseStatus];

  return (
    <Link
      href={ws.href}
      className="group flex-1 rounded-2xl p-5 flex flex-col gap-5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: hovered ? "1px solid rgba(200,146,58,0.35)" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: hovered ? "0 0 40px rgba(200,146,58,0.08)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Artist photo + info */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#1A1A1A]">
            <Image
              src={ws.photo}
              alt={ws.artistName}
              width={56}
              height={56}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          {/* Status dot */}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
            style={{ background: status.color, borderColor: "#050505" }}
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white truncate">{ws.artistName}</p>
          <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
            {ws.artistHandle}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Radio className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
          <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>
            {ws.activeRelease}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Music className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            {ws.monthlyListeners} monthly listeners
          </p>
        </div>
      </div>

      {/* Status + CTA */}
      <div
        className="flex items-center justify-between mt-auto pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span
          className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1.5"
          style={{ background: "rgba(255,255,255,0.06)", color: status.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: status.color }} />
          {status.label}
        </span>
        <span
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Enter
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

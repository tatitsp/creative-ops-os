"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MapPin, Headphones, Disc3 } from "lucide-react";
import type { Workspace } from "@/lib/workspaces";

export function WorkspaceCard({ workspace: ws }: { workspace: Workspace }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={ws.href}
      className="group flex-1 rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: hovered
          ? "1px solid rgba(255,255,255,0.2)"
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: hovered ? "0 8px 40px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.3)",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Artist photo — full width, square */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#111111]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ws.photo}
          alt={ws.artistName}
          className="w-full h-full object-cover object-top"
          style={{ transition: "transform 0.4s ease", transform: hovered ? "scale(1.03)" : "scale(1)" }}
        />
        {/* Bottom gradient for readability */}
        <div
          className="absolute inset-x-0 bottom-0 h-16"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}
        />
        {/* Active indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[0.6rem] font-semibold text-white/80 uppercase tracking-wide">Active</span>
        </div>
      </div>

      {/* Info block */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Name + location */}
        <div>
          <p className="text-base font-black text-white tracking-tight leading-tight">{ws.artistName}</p>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{ws.location}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Headphones className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
              <span className="font-semibold text-white">{ws.monthlyListeners}</span> monthly listeners
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Disc3 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
              <span className="font-semibold text-white">{ws.activeRelease}</span>
              <span className="ml-1" style={{ color: "rgba(255,255,255,0.3)" }}>· {ws.releaseType}</span>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <div
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
              color: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.6)",
            }}
          >
            Enter Workspace
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

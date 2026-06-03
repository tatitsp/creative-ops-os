"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Disc3,
  FolderKanban,
  Film,
  BarChart2,
  Users,
  CheckSquare,
  LayoutDashboard,
} from "lucide-react";
import { ARTIST_PHOTO, CURRENT_USER } from "@/lib/mock-data";
import { pickGreeting } from "@/lib/greeting";
import { MOCK_RELEASES } from "@/lib/mock-releases";

// ─── Constants ────────────────────────────────────────────────────────────────

const MOCK_NOW = new Date("2026-05-18T14:00:00Z");
const RELEASE_DATE = new Date("2026-07-18");
const DAYS_TO_DROP = Math.ceil(
  (RELEASE_DATE.getTime() - MOCK_NOW.getTime()) / (1000 * 60 * 60 * 24),
);

const ACTIVE_RELEASE = MOCK_RELEASES.find((r) => r.status === "PRE_RELEASE");

// ─── Dock cards ───────────────────────────────────────────────────────────────

const PORTAL_DOCK = [
  { href: "/releases",  label: "Drops",     icon: <Disc3        className="w-6 h-6 text-gold" /> },
  { href: "/projects",  label: "Campaigns", icon: <FolderKanban className="w-6 h-6 text-sky-500" /> },
  { href: "/content",   label: "Content",   icon: <Film         className="w-6 h-6 text-emerald-500" /> },
  { href: "/analytics", label: "Analytics", icon: <BarChart2    className="w-6 h-6 text-amber-400" /> },
  { href: "/team",      label: "Team",      icon: <Users        className="w-6 h-6 text-rose-500" /> },
  { href: "/approvals", label: "Approvals", icon: <CheckSquare  className="w-6 h-6 text-gold" /> },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ArtistPortalView() {
  const [greeting, setGreeting] = useState("Welcome back, Key.");
  useEffect(() => { setGreeting(pickGreeting("Key.")); }, []);

  return (
    <div className="flex flex-col" style={{ height: "100vh" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ flex: "3 3 0%" }}>
        <Image
          src={ARTIST_PHOTO}
          alt="Lil Tony Official"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />

        {/* Bottom fade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 35%, rgba(8,8,8,0.55) 65%, rgba(8,8,8,0.95) 90%, #080808 100%)",
          }}
        />

        {/* Left fade for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(8,8,8,0.72) 0%, rgba(8,8,8,0.3) 45%, transparent 70%)",
          }}
        />

        {/* CD-only: switch back to dashboard */}
        {CURRENT_USER.role === "CREATIVE_OPS_DIRECTOR" && (
          <div className="absolute top-4 right-4 md:top-5 md:right-6 z-10">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold text-white/50 hover:text-white/80 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
            >
              <LayoutDashboard className="w-3 h-3" />
              Switch to CD View
            </Link>
          </div>
        )}

        {/* Greeting */}
        <div className="absolute top-5 left-5 md:top-10 md:left-10 max-w-[85%] md:max-w-[55%]">
          <p className="text-2xs font-bold text-gold uppercase tracking-[0.3em]">
            Lil Tony Official
          </p>
          <h1 className="text-[2rem] sm:text-[2.6rem] md:text-[3.4rem] font-black text-white mt-2 md:mt-3 tracking-tight leading-[1.06]">
            {greeting}
          </h1>
          {ACTIVE_RELEASE && (
            <p className="text-sm text-white/60 mt-3 font-medium hidden md:block">
              <span className="text-gold">{ACTIVE_RELEASE.title}</span>
              {" "}drops in {DAYS_TO_DROP} days.
            </p>
          )}
        </div>

        {/* Pre-save stat */}
        <div className="absolute bottom-8 right-6 md:right-10 text-right">
          <p className="text-2xs text-white/40 uppercase tracking-widest font-semibold">Pre-saves</p>
          <p className="text-3xl font-black text-white">12,800</p>
          <p className="text-xs text-white/50 mt-0.5">and counting</p>
        </div>
      </div>

      {/* ── Dock ─────────────────────────────────────────────────────────────── */}
      <div
        className="grid grid-cols-2 md:flex md:items-stretch gap-2 px-3 py-3"
        style={{ flex: "1 1 0%", background: "#080808" }}
      >
        {PORTAL_DOCK.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex flex-col items-center justify-center gap-3 py-3 md:py-0 md:flex-1 rounded-xl border border-[#1E1E1E] bg-[#0F0F0F] hover:bg-[#161616] hover:border-[#2E2E2E] transition-all group"
          >
            <div className="text-white/50 group-hover:text-white transition-colors">
              {card.icon}
            </div>
            <span className="text-sm font-bold text-white/50 group-hover:text-white transition-colors tracking-wide">
              {card.label}
            </span>
          </Link>
        ))}
      </div>

    </div>
  );
}

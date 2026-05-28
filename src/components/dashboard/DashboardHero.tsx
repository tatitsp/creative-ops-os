"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { CURRENT_USER } from "@/lib/mock-data";
import { getDisplayName, pickGreeting as buildGreeting } from "@/lib/greeting";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DockCard {
  href: string;
  label: string;
  status: string;
  icon: ReactNode;
}

interface DashboardHeroProps {
  cards: DockCard[];
  artistName: string;
  artistPhoto: string;
  artistPortalHref?: string;
  imagePosition?: string;
  imageTransform?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DashboardHero({ cards, artistName, artistPhoto, artistPortalHref = "/artist-portal", imagePosition, imageTransform }: DashboardHeroProps) {
  const displayName = getDisplayName(CURRENT_USER);
  const [greeting, setGreeting] = useState(`Welcome back, ${displayName}`);

  useEffect(() => {
    setGreeting(buildGreeting(displayName));
  }, [displayName]);

  return (
    <div className="flex flex-col" style={{ height: "100vh" }}>

      {/* ─── Top 3/4 — artist photo ─────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ flex: "3 3 0%" }}>
        <Image
          src={artistPhoto}
          alt={artistName}
          fill
          className="object-cover"
          style={{
            objectPosition: imagePosition ?? "center bottom",
            ...(imageTransform ? { transform: imageTransform } : {}),
          }}
          sizes="100vw"
          priority
        />

        {/* Bottom fade — blends photo into nav section below */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 35%, rgba(8,8,8,0.55) 65%, rgba(8,8,8,0.95) 90%, #080808 100%)",
          }}
        />

        {/* Left-side darkening for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(8,8,8,0.72) 0%, rgba(8,8,8,0.3) 45%, transparent 70%)",
          }}
        />

        {/* CD-only Artist Portal link */}
        {CURRENT_USER.role === "CREATIVE_OPS_DIRECTOR" && (
          <div className="absolute top-5 right-6 z-10">
            <Link
              href={artistPortalHref}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold text-white/50 hover:text-white/80 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
            >
              <Star className="w-3 h-3" />
              Preview Artist Portal
            </Link>
          </div>
        )}

        {/* Artist name + greeting */}
        <div className="absolute top-10 left-10 max-w-[55%]">
          <p className="text-2xs font-bold text-gold uppercase tracking-[0.3em]">
            {artistName}
          </p>
          <h1 className="text-[3.4rem] font-black text-white mt-3 tracking-tight leading-[1.06]">
            {greeting}
          </h1>
        </div>
      </div>

      {/* ─── Bottom 1/4 — nav tabs ──────────────────────────────────── */}
      <div
        className="flex items-stretch gap-2 px-3 py-3"
        style={{ flex: "1 1 0%", background: "#080808" }}
      >
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex-1 flex flex-col items-center justify-center gap-2 rounded-xl border border-[#1E1E1E] bg-[#0F0F0F] hover:bg-[#161616] hover:border-[#2A2A2A] transition-all group"
          >
            <div className="text-white/40 group-hover:text-white/75 transition-colors">
              {card.icon}
            </div>
            <span className="text-[0.65rem] font-semibold text-white/40 group-hover:text-white/75 transition-colors tracking-wide">
              {card.label}
            </span>
          </Link>
        ))}
      </div>

    </div>
  );
}

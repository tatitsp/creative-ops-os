"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";

// ─── Greeting pools ──────────────────────────────────────────────────────────

const POOLS = {
  morning:   ["Good morning", "Rise and grind", "New day. Let's move.", "Early bird.", "Morning, let's get it."],
  afternoon: ["Good afternoon", "Keep pushing.", "Still building.", "Midday check in.", "Don't stop now."],
  evening:   ["Good evening", "End strong.", "How'd today go?", "Almost there.", "Finish what you started."],
  night:     ["Still up?", "Burning the midnight oil.", "Late night mode.", "The night shift.", "Rest is productive too."],
};

function pickGreeting(): string {
  const h = new Date().getHours();
  const pool =
    h >= 5 && h < 12  ? POOLS.morning   :
    h >= 12 && h < 17 ? POOLS.afternoon :
    h >= 17 && h < 21 ? POOLS.evening   :
                        POOLS.night;
  const base = pool[Math.floor(Math.random() * pool.length)];
  return /[?.!]$/.test(base) ? base + " Key." : base + ", Key.";
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DockCard {
  href: string;
  label: string;
  status: string;
  icon: ReactNode;
}

interface DashboardHeroProps {
  cards: DockCard[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DashboardHero({ cards }: DashboardHeroProps) {
  const [greeting, setGreeting] = useState("Welcome back, Key.");

  useEffect(() => {
    setGreeting(pickGreeting());
  }, []);

  return (
    <div className="relative overflow-hidden" style={{ height: "75vh" }}>
      {/* Background image */}
      <Image
        src="https://i.scdn.co/image/ab6761610000e5ebac24eee9ce79217efc023fba"
        alt="Lil Tony Official"
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
      />

      {/* Gradient: dark left + dark bottom, open toward top-right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(8,8,8,0.97) 0%, rgba(8,8,8,0.82) 28%, rgba(8,8,8,0.38) 55%, rgba(8,8,8,0.08) 80%, rgba(8,8,8,0) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.72) 18%, rgba(8,8,8,0.3) 38%, transparent 58%)",
        }}
      />

      {/* Top-left: artist label + greeting */}
      <div className="absolute top-10 left-10 max-w-[55%]">
        <p className="text-2xs font-bold text-gold uppercase tracking-[0.3em]">
          Lil Tony Official
        </p>
        <h1 className="text-[3.4rem] font-black text-white mt-3 tracking-tight leading-[1.06]">
          {greeting}
        </h1>
      </div>

      {/* Bottom dock */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
        <div className="flex gap-3">
          {cards.map((card) => (
            <Link key={card.label} href={card.href} className="flex-1 min-w-0">
              <div
                className="rounded-2xl p-4 flex flex-col gap-3 border border-white/[0.13] hover:border-white/25 transition-all group cursor-pointer"
                style={{
                  background: "rgba(8,8,8,0.48)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                }}
              >
                {/* Icon row */}
                <div className="flex items-center justify-between">
                  <div>{card.icon}</div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/35 group-hover:text-white/65 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
                {/* Label + status */}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white leading-tight">{card.label}</p>
                  <p className="text-[0.7rem] text-white/45 mt-0.5 leading-snug line-clamp-2">
                    {card.status}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

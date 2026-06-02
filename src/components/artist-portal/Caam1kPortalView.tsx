"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Disc3,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  MessageCircle,
  Calendar,
  TrendingUp,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENT_USER } from "@/lib/mock-data";
import { pickGreeting } from "@/lib/greeting";
import { ROLE_LABELS } from "@/lib/constants";
import { Avatar } from "@/components/ui/Avatar";
import {
  CAAM1K_PHOTO,
  CAAM1K_COVER,
  CAAM1K_APPROVALS,
  CAAM1K_CONTENT,
  CAAM1K_TEAM,
} from "@/lib/mock-artist2";

// ─── Constants ────────────────────────────────────────────────────────────────

const MOCK_NOW   = new Date("2026-05-20T14:00:00Z");
const DROP_DATE  = new Date("2026-04-10");
const DAYS_SINCE = Math.floor(
  (MOCK_NOW.getTime() - DROP_DATE.getTime()) / (1000 * 60 * 60 * 24),
);

const CAAM_DISPLAY = "Caam.";

const MILESTONES = [
  { id: "m1", label: "Album announced",     date: "2026-03-20", status: "COMPLETED" as const },
  { id: "m2", label: "Pre-save campaign",   date: "2026-04-03", status: "COMPLETED" as const },
  { id: "m3", label: "Release day",         date: "2026-04-10", status: "COMPLETED" as const },
  { id: "m4", label: "Playlist pitching",   date: "2026-04-24", status: "COMPLETED" as const },
  { id: "m5", label: "Press push",          date: "2026-05-15", status: "CURRENT"   as const },
  { id: "m6", label: "Summer content wave", date: "2026-06-01", status: "UPCOMING"  as const },
  { id: "m7", label: "Catalog integration", date: "2026-07-01", status: "UPCOMING"  as const },
];

const COMPLETED_COUNT = MILESTONES.filter((m) => m.status === "COMPLETED").length;
const NEXT_MILESTONE  = MILESTONES.find((m) => m.status === "CURRENT");
const ROLLOUT_PCT     = Math.round((COMPLETED_COUNT / MILESTONES.length) * 100);

const PLATFORM_DOTS: Record<string, string> = {
  instagram:   "bg-rose-500",
  tiktok:      "bg-white",
  youtube:     "bg-red-600",
  twitter:     "bg-sky-400",
  spotify:     "bg-emerald-500",
  apple_music: "bg-rose-500",
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram:   "IG",
  tiktok:      "TikTok",
  youtube:     "YouTube",
  twitter:     "X",
  spotify:     "Spotify",
  apple_music: "Apple Music",
};

// ─── Approvals ────────────────────────────────────────────────────────────────

interface PortalApproval {
  id: string;
  title: string;
  campaign: string;
  type: string;
  thumbnail?: string;
  dueDate: string;
  isUrgent: boolean;
}

const ARTIST_APPROVALS: PortalApproval[] = [
  {
    id: "ca1",
    title: "Eastside Evangelist merch mockups — v1",
    campaign: "Eastside Evangelist — Album Push",
    type: "Design",
    thumbnail: CAAM1K_COVER,
    dueDate: "May 25",
    isUrgent: true,
  },
  {
    id: "ca2",
    title: "Everywhere I Go visualizer — final cut",
    campaign: "Eastside Evangelist — Album Push",
    type: "Video",
    thumbnail: undefined,
    dueDate: "May 28",
    isUrgent: false,
  },
  {
    id: "ca3",
    title: "Social copy — Everywhere I Go week 4 push",
    campaign: "Everywhere I Go — Playlist Pitching",
    type: "Copy",
    thumbnail: undefined,
    dueDate: "Jun 5",
    isUrgent: false,
  },
];

// ─── Content ──────────────────────────────────────────────────────────────────

interface PortalContent {
  id: string;
  title: string;
  platforms: string[];
  status: "POSTED" | "SCHEDULED" | "IN_REVIEW" | "IN_PIPELINE";
  date: string;
  stats?: { impressions: string; engagement: string };
}

const ARTIST_CONTENT: PortalContent[] = [
  {
    id: "cc1",
    title: "Everywhere I Go — Hook reel (Instagram/TikTok)",
    platforms: ["instagram", "tiktok"],
    status: "POSTED",
    date: "May 10",
    stats: { impressions: "48K", engagement: "7.8%" },
  },
  {
    id: "cc2",
    title: "Eastside Evangelist — Album trailer",
    platforms: ["youtube"],
    status: "POSTED",
    date: "Mar 12",
    stats: { impressions: "32K", engagement: "6.1%" },
  },
  {
    id: "cc3",
    title: "Don't Panic — Lyric video snippet",
    platforms: ["instagram", "tiktok"],
    status: "IN_PIPELINE",
    date: "May 28",
  },
  {
    id: "cc4",
    title: "Yahweh Flow — Testimony carousel",
    platforms: ["instagram"],
    status: "IN_REVIEW",
    date: "Jun 5",
  },
  {
    id: "cc5",
    title: "Fort Worth origin story — BTS doc clip",
    platforms: ["youtube", "instagram"],
    status: "IN_PIPELINE",
    date: "Jun 15",
  },
];

// ─── Team assignments ─────────────────────────────────────────────────────────

const TEAM_ASSIGNMENTS = [
  { user: CAAM1K_TEAM[0], task: "Managing Eastside Evangelist rollout & press push" },
  { user: CAAM1K_TEAM[1], task: "Editing Everywhere I Go visualizer final cut" },
  { user: CAAM1K_TEAM[2], task: "Designing merch mockups & social templates" },
];

// ─── Content status config ────────────────────────────────────────────────────

const CONTENT_STATUS_CONFIG = {
  POSTED:      { label: "Posted",       color: "bg-emerald-100 text-emerald-600" },
  SCHEDULED:   { label: "Scheduled",   color: "bg-sky-50 text-sky-500" },
  IN_REVIEW:   { label: "In Review",   color: "bg-gold-100 text-gold" },
  IN_PIPELINE: { label: "In Pipeline", color: "bg-canvas-200 text-ink-secondary" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Caam1kPortalView() {
  const [greeting, setGreeting] = useState(`Welcome back, ${CAAM_DISPLAY}`);
  useEffect(() => { setGreeting(pickGreeting(CAAM_DISPLAY)); }, []);

  const [approvals, setApprovals] = useState(
    ARTIST_APPROVALS.map((a) => ({
      ...a,
      actioned: false,
      result: null as null | "approved" | "changes",
    })),
  );

  function handleApprove(id: string) {
    setApprovals((prev) =>
      prev.map((a) => a.id === id ? { ...a, actioned: true, result: "approved" } : a),
    );
  }

  function handleChanges(id: string) {
    setApprovals((prev) =>
      prev.map((a) => a.id === id ? { ...a, actioned: true, result: "changes" } : a),
    );
  }

  const pendingApprovals = approvals.filter((a) => !a.actioned);

  return (
    <div className="min-h-screen bg-canvas-50">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: "62vh" }}>
        <Image
          src={CAAM1K_PHOTO}
          alt="Caam1k"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          unoptimized
        />
        {/* Dark left + bottom overlay */}
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
              "linear-gradient(to top, rgba(8,8,8,0.98) 0%, rgba(8,8,8,0.7) 20%, rgba(8,8,8,0.2) 42%, transparent 60%)",
          }}
        />

        {/* CD-only: switch back to workspace dashboard */}
        {CURRENT_USER.role === "CREATIVE_OPS_DIRECTOR" && (
          <div className="absolute top-5 right-6 z-10">
            <Link
              href="/artists/caam1k/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold text-white/50 hover:text-white/80 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
            >
              <LayoutDashboard className="w-3 h-3" />
              Switch to CD View
            </Link>
          </div>
        )}

        {/* Top-left content */}
        <div className="absolute top-10 left-10 max-w-[60%]">
          <p className="text-2xs font-bold text-gold uppercase tracking-[0.3em]">
            Caam1k
          </p>
          <h1 className="text-[3rem] font-black text-white mt-3 tracking-tight leading-[1.06]">
            {greeting}
          </h1>
          <p className="text-sm text-white/60 mt-3 font-medium">
            Wednesday, May 20 &nbsp;·&nbsp;{" "}
            <span className="text-gold">
              Eastside Evangelist has been out {DAYS_SINCE} days.
            </span>{" "}
            {pendingApprovals.length > 0
              ? `${pendingApprovals.length} thing${pendingApprovals.length !== 1 ? "s" : ""} need your attention.`
              : "You're all caught up."}
          </p>
        </div>

        {/* Stream stat — bottom right of hero */}
        <div className="absolute bottom-8 right-10 text-right">
          <p className="text-2xs text-white/40 uppercase tracking-widest font-semibold">Top Track Streams</p>
          <p className="text-3xl font-black text-white">1.4M+</p>
          <p className="text-xs text-white/50 mt-0.5">across top 3 tracks</p>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="px-10 py-10 space-y-12 max-w-[1100px] mx-auto">

        {/* ── 1. MY RELEASES ──────────────────────────────────────────────── */}
        <section>
          <SectionHeader label="My Drops" />
          <div className="rounded-2xl border border-gold/20 bg-[#0c0c0c] overflow-hidden">
            <div className="p-6 flex gap-6">
              {/* Left: info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xs font-bold uppercase tracking-widest text-gold bg-gold-100 px-2 py-0.5 rounded-full">
                    Album
                  </span>
                  <span className="text-2xs font-semibold text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">
                    Out Now
                  </span>
                </div>

                <h2 className="text-2xl font-black text-white tracking-tight">
                  Eastside Evangelist
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  15 tracks &nbsp;·&nbsp; April 10, 2026 &nbsp;·&nbsp; Son Of Yahweh Entertainment
                </p>

                {/* Rollout progress */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-white/50 font-medium">Rollout progress</p>
                    <p className="text-xs font-bold text-white/70">
                      {COMPLETED_COUNT} of {MILESTONES.length} milestones
                    </p>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all"
                      style={{ width: `${ROLLOUT_PCT}%` }}
                    />
                  </div>
                  {NEXT_MILESTONE && (
                    <p className="text-xs text-white/40 mt-2">
                      Current:{" "}
                      <span className="text-white/70 font-medium">{NEXT_MILESTONE.label}</span>
                      {" "}&nbsp;·&nbsp;{" "}
                      {new Date(NEXT_MILESTONE.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: days since + link */}
              <div className="flex flex-col items-end justify-between flex-shrink-0">
                <div className="text-right">
                  <p className="text-5xl font-black text-white">{DAYS_SINCE}</p>
                  <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mt-0.5">
                    days since drop
                  </p>
                </div>
                <Link
                  href="/artists/caam1k/releases"
                  className="flex items-center gap-1.5 text-xs font-bold text-gold hover:text-gold/80 transition-colors group"
                >
                  Open Releases
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Milestone strip */}
            <div className="border-t border-white/[0.06] px-6 py-3 flex gap-6 overflow-x-auto">
              {MILESTONES.map((m) => (
                <div key={m.id} className="flex-shrink-0 flex items-center gap-2">
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full flex-shrink-0",
                      m.status === "COMPLETED" ? "bg-emerald-500" :
                      m.status === "CURRENT"   ? "bg-gold animate-pulse" :
                      "bg-white/20",
                    )}
                  />
                  <span
                    className={cn(
                      "text-2xs font-medium whitespace-nowrap",
                      m.status === "COMPLETED" ? "text-white/40 line-through" :
                      m.status === "CURRENT"   ? "text-gold" :
                      "text-white/40",
                    )}
                  >
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. NEEDS YOUR APPROVAL ──────────────────────────────────────── */}
        <section>
          <SectionHeader label="Needs Your Approval" count={pendingApprovals.length} />
          <div className="space-y-3">
            {approvals.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "rounded-2xl border bg-canvas-100 p-4 transition-all",
                  item.actioned
                    ? "opacity-50 border-border"
                    : "border-border hover:border-border-strong",
                  item.isUrgent && !item.actioned && "border-gold/30 bg-gold-100/10",
                )}
              >
                {item.actioned ? (
                  <div className="flex items-center gap-3">
                    {item.result === "approved" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <p className="text-sm text-ink-secondary">
                          <span className="font-semibold text-ink">{item.title}</span>
                          {" "}— approved. Team notified.
                        </p>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <p className="text-sm text-ink-secondary">
                          <span className="font-semibold text-ink">{item.title}</span>
                          {" "}— changes requested. Team will revise.
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    {item.thumbnail ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-canvas-200 flex-shrink-0 flex items-center justify-center">
                        <Disc3 className="w-5 h-5 text-ink-tertiary" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {item.isUrgent && (
                          <span className="text-2xs font-bold text-gold uppercase tracking-widest">
                            Time-sensitive
                          </span>
                        )}
                        <span className="text-2xs text-ink-tertiary">{item.type}</span>
                      </div>
                      <p className="text-sm font-semibold text-ink truncate">{item.title}</p>
                      <p className="text-xs text-ink-tertiary mt-0.5 flex items-center gap-1.5">
                        <span>{item.campaign}</span>
                        <span>·</span>
                        <Clock className="w-3 h-3" />
                        <span className={item.isUrgent ? "text-gold font-semibold" : ""}>
                          Due {item.dueDate}
                        </span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleChanges(item.id)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-400 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-400/20 rounded-xl transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Request Changes
                      </button>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-400 bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-400/20 rounded-xl transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. MY CONTENT ───────────────────────────────────────────────── */}
        <section>
          <SectionHeader label="My Content" />
          <div className="space-y-2">
            {ARTIST_CONTENT.map((item) => {
              const statusCfg = CONTENT_STATUS_CONFIG[item.status];
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-canvas-100 border border-border hover:border-border-strong transition-all group"
                >
                  <span
                    className={cn(
                      "text-2xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 w-24 text-center",
                      statusCfg.color,
                    )}
                  >
                    {statusCfg.label}
                  </span>

                  <p className="flex-1 text-sm font-medium text-ink truncate">{item.title}</p>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {item.platforms.map((p) => (
                      <span
                        key={p}
                        className={cn("w-2 h-2 rounded-full flex-shrink-0", PLATFORM_DOTS[p] ?? "bg-ink-tertiary")}
                        title={PLATFORM_LABELS[p] ?? p}
                      />
                    ))}
                    <span className="text-2xs text-ink-tertiary ml-1">
                      {item.platforms.map((p) => PLATFORM_LABELS[p] ?? p).join(" · ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {item.stats ? (
                      <div className="flex items-center gap-3 text-2xs text-ink-tertiary">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {item.stats.impressions}
                        </span>
                        <span className="text-emerald-500 font-semibold">
                          {item.stats.engagement} eng
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xs text-ink-tertiary flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. MY TEAM ──────────────────────────────────────────────────── */}
        <section>
          <SectionHeader label="My Team" />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {TEAM_ASSIGNMENTS.map(({ user, task }) => (
              <div
                key={user.id}
                className="flex items-start gap-3 p-4 rounded-2xl bg-canvas-100 border border-border hover:border-border-strong transition-all"
              >
                <Avatar user={user} size="sm" showStatus />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-ink truncate">{user.name}</p>
                  <p className="text-2xs text-ink-tertiary truncate">{user.role}</p>
                  <p className="text-2xs text-ink-secondary mt-1.5 leading-relaxed line-clamp-2">
                    {task}
                  </p>
                </div>
                <button
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-canvas-200 transition-colors text-ink-tertiary hover:text-ink-secondary"
                  title={`Message ${user.displayName}`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ label, count }: { label: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-xs font-bold text-ink-tertiary uppercase tracking-[0.2em]">{label}</h2>
      {count !== undefined && count > 0 && (
        <span className="w-5 h-5 rounded-full bg-gold text-white text-2xs font-bold flex items-center justify-center">
          {count}
        </span>
      )}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

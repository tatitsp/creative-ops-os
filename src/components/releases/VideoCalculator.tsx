"use client";

import { useState, useMemo } from "react";
import { cn, formatNumber } from "@/lib/utils";
import { Film, AlertTriangle, CheckCircle2, ChevronDown, Info, Zap } from "lucide-react";

type ReleaseFormat = "SINGLE" | "EP" | "ALBUM";

interface VideoRow {
  type: string;
  count: number;
  priority: "CRITICAL" | "HIGH" | "IMPORTANT" | "OPTIONAL";
  platforms: string;
  notes: string;
}

function calcVideos(
  totalTracks: number,
  leadSingles: number,
  albumSingles: number,
  format: ReleaseFormat,
  platforms: string[],
): { rows: VideoRow[]; total: number; productionDays: number } {
  const deepCuts = Math.max(0, totalTracks - leadSingles - albumSingles);
  const hasTikTok = platforms.includes("tiktok");
  const hasYouTube = platforms.includes("youtube");
  const hasIG = platforms.includes("instagram");

  const rows: VideoRow[] = [];

  // Lead singles: full MV + vertical + visualizer
  if (leadSingles > 0) {
    rows.push({
      type: "Lead Single — Full Music Video",
      count: leadSingles,
      priority: "CRITICAL",
      platforms: "YouTube, Instagram",
      notes: "Cinematic production. Director + crew shoot.",
    });
    if (hasTikTok || hasIG) {
      rows.push({
        type: "Lead Single — Vertical Edit (9:16)",
        count: leadSingles,
        priority: "CRITICAL",
        platforms: "TikTok, IG Reels",
        notes: "Cut from full MV. Under 60s. Caption-friendly.",
      });
    }
    rows.push({
      type: "Lead Single — Visualizer / Lyric Video",
      count: leadSingles,
      priority: "HIGH",
      platforms: "YouTube, Spotify Canvas",
      notes: "Lightweight visual. Can be motion graphics.",
    });
  }

  // Album singles
  if (albumSingles > 0) {
    rows.push({
      type: "Album Single — Visualizer",
      count: albumSingles,
      priority: "HIGH",
      platforms: "YouTube, Spotify Canvas",
      notes: "Track-length visual or animated lyric video.",
    });
    if (hasTikTok || hasIG) {
      rows.push({
        type: "Album Single — Short-form clip",
        count: albumSingles,
        priority: "HIGH",
        platforms: "TikTok, IG Reels",
        notes: "15–30s hook cut. Drives pre-save and streams.",
      });
    }
  }

  // Deep cuts
  if (deepCuts > 0) {
    rows.push({
      type: "Deep Cut — Visualizer or Lyric Video",
      count: deepCuts,
      priority: "IMPORTANT",
      platforms: "YouTube, Spotify",
      notes: "Lightweight. Can batch with motion template.",
    });
  }

  // Album-specific additions
  if (format === "ALBUM") {
    rows.push({
      type: "Album Trailer",
      count: 1,
      priority: "CRITICAL",
      platforms: "YouTube, Instagram, TikTok",
      notes: "60–90s. Tracklist, aesthetic, release date. Ship 3 weeks out.",
    });

    const teaserCount = Math.min(4, Math.ceil(totalTracks / 3));
    rows.push({
      type: "Pre-Release Teaser Reels",
      count: teaserCount,
      priority: "HIGH",
      platforms: "Instagram, TikTok",
      notes: "Cryptic / hype content. 1 per week leading up to drop.",
    });

    rows.push({
      type: "Release Day Multi-Format Pack",
      count: 3,
      priority: "CRITICAL",
      platforms: "All platforms",
      notes: "Feed post, story, reel — all timed for drop. Coordinate across platforms.",
    });

    rows.push({
      type: "BTS / Studio Reel",
      count: 2,
      priority: "IMPORTANT",
      platforms: "TikTok, Instagram",
      notes: "Authentic content. Recording sessions, creative process.",
    });
  } else if (format === "EP") {
    rows.push({
      type: "EP Trailer / Teaser",
      count: 1,
      priority: "HIGH",
      platforms: "YouTube, Instagram, TikTok",
      notes: "45–60s overview of the project.",
    });
    rows.push({
      type: "Release Day Package",
      count: 2,
      priority: "CRITICAL",
      platforms: "All platforms",
      notes: "Coordinated drop content.",
    });
  } else {
    // Single
    rows.push({
      type: "Release Day Package",
      count: 1,
      priority: "CRITICAL",
      platforms: "All platforms",
      notes: "Feed + story drop package.",
    });
  }

  const total = rows.reduce((s, r) => s + r.count, 0);

  // Rough production days: each MV = 5d, each visualizer = 1.5d, each short = 0.5d
  const mvCount = rows
    .filter((r) => r.type.includes("Music Video"))
    .reduce((s, r) => s + r.count, 0);
  const visualizerCount = rows
    .filter((r) => r.type.includes("Visualizer") || r.type.includes("Lyric"))
    .reduce((s, r) => s + r.count, 0);
  const shortCount = total - mvCount - visualizerCount;
  const productionDays = Math.ceil(mvCount * 5 + visualizerCount * 1.5 + shortCount * 0.5);

  return { rows, total, productionDays };
}

const PRIORITY_CONFIG = {
  CRITICAL: {
    label: "Critical",
    color: "text-rose-600",
    bg: "bg-rose-50 border-rose-100",
    dot: "bg-rose-500",
    icon: "🔴",
  },
  HIGH: {
    label: "High",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-100",
    dot: "bg-amber-400",
    icon: "🟡",
  },
  IMPORTANT: {
    label: "Important",
    color: "text-violet-600",
    bg: "bg-violet-50 border-violet-100",
    dot: "bg-violet-400",
    icon: "🟣",
  },
  OPTIONAL: {
    label: "Optional",
    color: "text-ink-secondary",
    bg: "bg-canvas-100 border-border",
    dot: "bg-ink-tertiary",
    icon: "⚪",
  },
};

export function VideoCalculator({ defaultTracks = 12 }: { defaultTracks?: number }) {
  const [tracks, setTracks] = useState(defaultTracks);
  const [leadSingles, setLeadSingles] = useState(2);
  const [albumSingles, setAlbumSingles] = useState(2);
  const [format, setFormat] = useState<ReleaseFormat>("ALBUM");
  const [platforms, setPlatforms] = useState([
    "instagram",
    "tiktok",
    "youtube",
    "spotify",
    "apple_music",
    "twitter",
  ]);

  const maxLeadSingles = Math.min(tracks, 3);
  const maxAlbumSingles = Math.min(tracks - leadSingles, 4);

  const result = useMemo(
    () => calcVideos(tracks, leadSingles, Math.min(albumSingles, maxAlbumSingles), format, platforms),
    [tracks, leadSingles, albumSingles, maxAlbumSingles, format, platforms],
  );

  const criticalCount = result.rows
    .filter((r) => r.priority === "CRITICAL")
    .reduce((s, r) => s + r.count, 0);

  const togglePlatform = (p: string) =>
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-ink text-white p-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Film className="w-5 h-5 text-violet-300" />
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider font-medium">Video Quota Calculator</p>
            <p className="text-lg font-semibold mt-0.5">
              Minimum{" "}
              <span className="text-violet-300">{result.total} pieces</span> of video content
            </p>
            <p className="text-sm text-white/60 mt-0.5">
              ~{result.productionDays} production days ·{" "}
              {criticalCount} critical deliverables
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-violet-300">{result.total}</p>
          <p className="text-xs text-white/50 mt-0.5">total videos</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="card p-5 space-y-5">
        <p className="text-sm font-semibold text-ink">Configure release</p>

        {/* Format */}
        <div>
          <label className="text-label block mb-2">Release format</label>
          <div className="flex gap-2">
            {(["SINGLE", "EP", "ALBUM"] as ReleaseFormat[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold border transition-all",
                  format === f
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-ink-secondary border-border hover:border-ink-secondary",
                )}
              >
                {f === "ALBUM" ? "Album" : f === "EP" ? "EP" : "Single"}
              </button>
            ))}
          </div>
        </div>

        {/* Track count */}
        {format !== "SINGLE" && (
          <div>
            <label className="text-label block mb-2">
              Total tracks <span className="text-ink font-bold ml-1">{tracks}</span>
            </label>
            <input
              type="range"
              min={1}
              max={20}
              value={tracks}
              onChange={(e) => {
                const v = Number(e.target.value);
                setTracks(v);
                setLeadSingles((prev) => Math.min(prev, v));
                setAlbumSingles((prev) => Math.min(prev, v));
              }}
              className="w-full accent-violet-600 cursor-pointer"
            />
            <div className="flex justify-between text-2xs text-ink-tertiary mt-1">
              <span>1</span>
              <span>20</span>
            </div>
          </div>
        )}

        {/* Lead singles */}
        <div>
          <label className="text-label block mb-2">
            Lead singles (full MV) <span className="text-ink font-bold ml-1">{leadSingles}</span>
          </label>
          <input
            type="range"
            min={0}
            max={maxLeadSingles}
            value={leadSingles}
            onChange={(e) => setLeadSingles(Number(e.target.value))}
            className="w-full accent-violet-600 cursor-pointer"
          />
          <div className="flex justify-between text-2xs text-ink-tertiary mt-1">
            <span>0</span>
            <span>{maxLeadSingles}</span>
          </div>
        </div>

        {/* Album singles */}
        {format === "ALBUM" && (
          <div>
            <label className="text-label block mb-2">
              Album singles (visualizer only){" "}
              <span className="text-ink font-bold ml-1">{Math.min(albumSingles, maxAlbumSingles)}</span>
            </label>
            <input
              type="range"
              min={0}
              max={maxAlbumSingles}
              value={Math.min(albumSingles, maxAlbumSingles)}
              onChange={(e) => setAlbumSingles(Number(e.target.value))}
              className="w-full accent-violet-600 cursor-pointer"
            />
          </div>
        )}

        {/* Platforms */}
        <div>
          <label className="text-label block mb-2">Target platforms</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "instagram", label: "Instagram", color: "#E1306C" },
              { id: "tiktok", label: "TikTok", color: "#010101" },
              { id: "youtube", label: "YouTube", color: "#FF0000" },
              { id: "spotify", label: "Spotify", color: "#1DB954" },
              { id: "apple_music", label: "Apple Music", color: "#FC3C44" },
              { id: "twitter", label: "Twitter / X", color: "#1DA1F2" },
            ].map((p) => {
              const on = platforms.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                    on ? "text-white border-transparent" : "bg-white text-ink-secondary border-border",
                  )}
                  style={on ? { backgroundColor: p.color, borderColor: p.color } : {}}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-label">Content breakdown</p>
          <p className="text-xs text-ink-secondary">
            {result.total} pieces total · {result.productionDays} production days
          </p>
        </div>

        {(["CRITICAL", "HIGH", "IMPORTANT", "OPTIONAL"] as const).map((priority) => {
          const rows = result.rows.filter((r) => r.priority === priority);
          if (!rows.length) return null;
          const cfg = PRIORITY_CONFIG[priority];

          return (
            <div key={priority}>
              <div className="flex items-center gap-2 mb-1.5 mt-3">
                <span className={cn("w-2 h-2 rounded-full", cfg.dot)} />
                <span className={cn("text-2xs font-bold uppercase tracking-wide", cfg.color)}>
                  {cfg.label}
                </span>
                <span className="text-2xs text-ink-tertiary">
                  {rows.reduce((s, r) => s + r.count, 0)} pieces
                </span>
              </div>
              <div className="space-y-2">
                {rows.map((row, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border",
                      cfg.bg,
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold",
                        priority === "CRITICAL"
                          ? "bg-rose-100 text-rose-600"
                          : priority === "HIGH"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-violet-100 text-violet-600",
                      )}
                    >
                      {row.count}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink">{row.type}</p>
                      <p className="text-2xs text-ink-tertiary mt-0.5">{row.platforms}</p>
                      <p className="text-2xs text-ink-secondary mt-0.5 italic">{row.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Flag callout */}
      {leadSingles === 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-700">No lead single flagged</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Without a lead single, there&apos;s no anchor for your visual rollout. Set at least 1
              track as a lead single to unlock MV and teaser content.
            </p>
          </div>
        </div>
      )}

      {result.productionDays > 30 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100">
          <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-rose-700">
              Heavy production load — {result.productionDays} days estimated
            </p>
            <p className="text-xs text-rose-600 mt-0.5">
              Consider batching visualizers with a motion template, or reducing album single count to
              stay within production capacity.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

import { cn, formatNumber } from "@/lib/utils";
import type { Release } from "@/lib/mock-releases";
import {
  TrendingUp,
  Music,
  Users,
  Share2,
  Bookmark,
  Newspaper,
  ListMusic,
  Zap,
} from "lucide-react";

interface AnalyticsSnapshotProps {
  analytics: Release["analytics"];
  releaseDate: string;
  title: string;
  leadSingles: string[];
}

export function AnalyticsSnapshot({
  analytics,
  releaseDate,
  title,
  leadSingles,
}: AnalyticsSnapshotProps) {
  const isReleased = new Date(releaseDate) <= new Date();

  if (!isReleased) {
    return (
      <div className="space-y-6">
        {/* Pre-release: show forecasts and early indicators */}
        <div className="rounded-xl bg-canvas-100 text-white p-6">
          <p className="text-xs text-white/50 uppercase tracking-wider font-medium mb-1">
            Pre-Release Indicators
          </p>
          <h3 className="text-lg font-semibold">Early signals — "{leadSingles[0]}" single</h3>
          <p className="text-sm text-white/60 mt-1">
            Full album analytics will populate here post-release. Tracking live signals below.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SnapshotCard
            icon={<Bookmark className="w-4 h-4" />}
            label="Pre-saves"
            value={formatNumber(analytics.preSaves)}
            sub="across all DSPs"
            accent="gold"
          />
          <SnapshotCard
            icon={<Music className="w-4 h-4" />}
            label="Week 1 Streams"
            value={formatNumber(analytics.weekOneStreams)}
            sub={`"${leadSingles[0]}" — Spotify`}
            accent="emerald"
          />
          <SnapshotCard
            icon={<Share2 className="w-4 h-4" />}
            label="TikTok Sound Uses"
            value={formatNumber(analytics.weekOneTikTokSounds)}
            sub="organic creations"
            accent="amber"
          />
          <SnapshotCard
            icon={<Newspaper className="w-4 h-4" />}
            label="Press Pickups"
            value={analytics.pressPickups.toString()}
            sub="editorial features"
            accent="sky"
          />
        </div>

        {analytics.peakChartPosition && (
          <div className="card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Chart Position</p>
              <p className="text-xs text-ink-secondary mt-0.5">{analytics.peakChartPosition}</p>
            </div>
            <span className="ml-auto text-2xs font-semibold px-2 py-1 bg-gold-100 text-gold rounded-full">
              Live
            </span>
          </div>
        )}

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <ListMusic className="w-4 h-4 text-ink-secondary" />
            <p className="text-sm font-semibold text-ink">Editorial Playlist Status</p>
          </div>
          <div className="space-y-2">
            {analytics.editorialPlaylists.map((pl) => {
              const isPitched = pl.includes("Pitched");
              return (
                <div key={pl} className="flex items-center justify-between p-2.5 rounded-lg bg-canvas-100">
                  <span className="text-xs font-medium text-ink">{pl.replace(" (Pitched)", "")}</span>
                  <span
                    className={cn(
                      "text-2xs font-semibold px-2 py-0.5 rounded-full",
                      isPitched
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600",
                    )}
                  >
                    {isPitched ? "Pitched" : "Added"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">+{formatNumber(analytics.followersGained)}</p>
            <p className="text-xs text-ink-tertiary">New followers since single drop</p>
          </div>
        </div>
      </div>
    );
  }

  // Post-release full analytics (shown after release date)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SnapshotCard
          icon={<Music className="w-4 h-4" />}
          label="Week 1 Streams"
          value={formatNumber(analytics.weekOneStreams)}
          sub="Spotify"
          accent="emerald"
        />
        <SnapshotCard
          icon={<Share2 className="w-4 h-4" />}
          label="TikTok Sounds"
          value={formatNumber(analytics.weekOneTikTokSounds)}
          sub="uses"
          accent="gold"
        />
        <SnapshotCard
          icon={<TrendingUp className="w-4 h-4" />}
          label="YouTube Views"
          value={formatNumber(analytics.weekOneYouTubeViews)}
          sub="Week 1"
          accent="rose"
        />
        <SnapshotCard
          icon={<Users className="w-4 h-4" />}
          label="Followers Gained"
          value={formatNumber(analytics.followersGained)}
          sub="all platforms"
          accent="sky"
        />
      </div>
    </div>
  );
}

function SnapshotCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: "gold" | "emerald" | "amber" | "rose" | "sky";
}) {
  const ACCENT_ICON = {
    gold:    "bg-gold-100 text-gold",
    emerald: "bg-emerald-50 text-emerald-500",
    amber:   "bg-amber-50 text-amber-400",
    rose:    "bg-rose-50 text-rose-500",
    sky:     "bg-sky-50 text-sky-500",
  };

  return (
    <div className="card p-4 space-y-3">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", ACCENT_ICON[accent])}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-ink">{value}</p>
        <p className="text-xs text-ink-tertiary mt-0.5">{label}</p>
        <p className="text-2xs text-ink-tertiary">{sub}</p>
      </div>
    </div>
  );
}

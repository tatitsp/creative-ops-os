"use client";

import { useEffect } from "react";
import Image from "next/image";
import { CalendarDays, ChevronRight, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReleasesStore, type ApiRelease } from "@/store/releases-store";

const STATUS_STYLES: Record<string, string> = {
  CONCEPT:       "bg-canvas-100 text-ink-tertiary",
  PRE_RELEASE:   "bg-amber-50 text-amber-700",
  RELEASE_WEEK:  "bg-gold-100 text-gold",
  RELEASED:      "bg-emerald-50 text-emerald-600",
  ARCHIVED:      "bg-canvas-100 text-ink-tertiary",
};

const STATUS_LABELS: Record<string, string> = {
  CONCEPT:       "Concept",
  PRE_RELEASE:   "Pre-Release",
  RELEASE_WEEK:  "Release Week",
  RELEASED:      "Released",
  ARCHIVED:      "Archived",
};

const TYPE_LABELS: Record<string, string> = {
  SINGLE:     "Single",
  EP:         "EP",
  ALBUM:      "Album",
  MERCH_DROP: "Merch Drop",
  TOUR:       "Tour",
};

interface ReleasesClientProps {
  slug: string;
  initialReleases: ApiRelease[];
}

export function ReleasesClient({ slug, initialReleases }: ReleasesClientProps) {
  const { releases, init } = useReleasesStore();

  useEffect(() => {
    init(slug, initialReleases);
  }, [slug, initialReleases, init]);

  if (releases.length === 0) {
    return (
      <div className="text-center py-16">
        <Music2 className="w-10 h-10 text-ink-tertiary mx-auto mb-3" />
        <p className="text-sm text-ink-tertiary">No releases yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {releases.map((release) => (
        <div key={release.id} className="card p-5 flex items-center gap-5">
          {/* Cover */}
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-canvas-100">
            {release.coverArt ? (
              <Image
                src={release.coverArt}
                alt={release.title}
                width={56}
                height={56}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music2 className="w-5 h-5 text-ink-tertiary" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold text-ink">{release.title}</p>
              <span className="text-2xs text-ink-tertiary">
                · {TYPE_LABELS[release.type] ?? release.type}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "text-2xs font-semibold px-2 py-0.5 rounded-full",
                  STATUS_STYLES[release.status] ?? "bg-canvas-100 text-ink-tertiary"
                )}
              >
                {STATUS_LABELS[release.status] ?? release.status}
              </span>
              <span className="flex items-center gap-1 text-2xs text-ink-tertiary">
                <CalendarDays className="w-3 h-3" />
                {new Date(release.releaseDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-xs font-semibold text-ink">{release.trackCount}</p>
            <p className="text-2xs text-ink-tertiary">tracks</p>
          </div>

          <ChevronRight className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

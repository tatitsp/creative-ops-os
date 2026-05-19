import { cn } from "@/lib/utils";
import {
  DROP_TYPE_CONFIG,
  APPROVAL_STAGE_CONFIG,
  type ContentDrop,
} from "@/lib/mock-releases";
import { PLATFORM_CONFIG } from "@/lib/constants";
import { Calendar, ChevronRight } from "lucide-react";

// Group drops by phase bracket
const PHASE_BRACKETS = [
  { label: "Pre-Announcement", before: "2026-05-27" },
  { label: "Single 1 Rollout", from: "2026-05-28", before: "2026-06-16" },
  { label: "Pre-Save Wave", from: "2026-06-10", before: "2026-06-26" },
  { label: "Build-Up Phase", from: "2026-06-17", before: "2026-07-14" },
  { label: "Release Week", from: "2026-07-14", before: "2026-07-22" },
  { label: "Post-Release", from: "2026-07-19" },
];

function bracketForDate(date: string) {
  const d = new Date(date);
  if (d < new Date("2026-05-28")) return "Pre-Announcement";
  if (d < new Date("2026-06-10")) return "Single 1 Rollout";
  if (d < new Date("2026-06-17")) return "Pre-Save Wave";
  if (d < new Date("2026-07-14")) return "Build-Up Phase";
  if (d <= new Date("2026-07-18")) return "Release Week";
  return "Post-Release";
}

interface ContentScheduleProps {
  drops: ContentDrop[];
}

export function ContentSchedule({ drops }: ContentScheduleProps) {
  // Group by bracket
  const grouped: Record<string, ContentDrop[]> = {};
  for (const drop of drops) {
    const bracket = bracketForDate(drop.date);
    if (!grouped[bracket]) grouped[bracket] = [];
    grouped[bracket].push(drop);
  }

  const BRACKET_ORDER = [
    "Pre-Announcement",
    "Single 1 Rollout",
    "Pre-Save Wave",
    "Build-Up Phase",
    "Release Week",
    "Post-Release",
  ];

  return (
    <div className="space-y-6">
      {BRACKET_ORDER.map((bracket) => {
        const items = grouped[bracket];
        if (!items?.length) return null;

        const isReleaseWeek = bracket === "Release Week";

        return (
          <section key={bracket}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  isReleaseWeek ? "bg-ink text-white" : "bg-canvas-100 text-ink-secondary",
                )}
              >
                {bracket}
              </div>
              <div className="flex-1 h-px bg-border" />
              <span className="text-2xs text-ink-tertiary">{items.length} drops</span>
            </div>

            <div className="space-y-2">
              {items
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((drop) => {
                  const typeCfg = DROP_TYPE_CONFIG[drop.type];
                  const stageCfg = APPROVAL_STAGE_CONFIG[drop.stage];
                  const isPosted = drop.stage === "POSTED";
                  const isScheduled = drop.stage === "SCHEDULED";

                  return (
                    <div
                      key={drop.id}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group",
                        isPosted
                          ? "bg-canvas-50 border-border opacity-75"
                          : isReleaseWeek
                            ? "bg-canvas-100 border-border hover:border-gold/30 hover:shadow-card-hover"
                            : "bg-canvas-100 border-border hover:border-border-strong hover:shadow-card",
                      )}
                    >
                      {/* Date */}
                      <div className="w-12 flex-shrink-0 text-center">
                        <p className="text-xs font-semibold text-ink">
                          {new Date(drop.date).toLocaleDateString("en-US", { month: "short" })}
                        </p>
                        <p className="text-lg font-bold text-ink leading-none">
                          {new Date(drop.date).getDate()}
                        </p>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <p
                            className={cn(
                              "text-sm font-medium flex-1",
                              isPosted ? "text-ink-tertiary line-through" : "text-ink",
                            )}
                          >
                            {drop.title}
                          </p>
                          <span
                            className={cn(
                              "text-2xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
                              typeCfg.color,
                            )}
                          >
                            {typeCfg.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          {/* Platforms */}
                          <div className="flex items-center gap-1">
                            {drop.platforms.slice(0, 4).map((p) => {
                              const cfg = PLATFORM_CONFIG[p as keyof typeof PLATFORM_CONFIG];
                              return (
                                <span
                                  key={p}
                                  className="text-2xs px-1.5 py-0.5 rounded-full bg-canvas-100 text-ink-tertiary"
                                >
                                  {cfg?.label ?? p}
                                </span>
                              );
                            })}
                          </div>
                          {drop.assignee && (
                            <span className="text-2xs text-ink-tertiary">{drop.assignee}</span>
                          )}
                        </div>

                        {drop.notes && (
                          <p className="text-2xs text-ink-tertiary mt-1.5 italic">{drop.notes}</p>
                        )}
                      </div>

                      {/* Stage */}
                      <div className="flex-shrink-0 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 text-2xs font-semibold px-2 py-1 rounded-full",
                            stageCfg.bg,
                            stageCfg.color,
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                          {stageCfg.short}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

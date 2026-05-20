"use client";

import { cn } from "@/lib/utils";
import {
  DROP_TYPE_CONFIG,
  APPROVAL_STAGE_CONFIG,
  type ContentDrop,
} from "@/lib/mock-releases";
import { PLATFORM_CONFIG } from "@/lib/constants";
import { Calendar, ChevronRight, Layers, CheckCircle2 } from "lucide-react";
import type { GeneratedSlot } from "./VideoCalculator";

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

const SLOT_PRIORITY_STYLE = {
  CRITICAL: { dot: "bg-rose-500", label: "text-rose-400", badge: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  HIGH:     { dot: "bg-amber-400", label: "text-amber-400", badge: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  IMPORTANT:{ dot: "bg-gold",     label: "text-gold",      badge: "bg-gold/10 text-gold border-gold/20" },
  OPTIONAL: { dot: "bg-ink-tertiary", label: "text-ink-tertiary", badge: "bg-canvas-200 text-ink-tertiary border-border" },
};

interface ContentScheduleProps {
  drops: ContentDrop[];
  generatedSlots?: GeneratedSlot[];
}

export function ContentSchedule({ drops, generatedSlots = [] }: ContentScheduleProps) {
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
      {/* Generated production slots panel */}
      {generatedSlots.length > 0 && (
        <div className="rounded-xl border border-gold/30 bg-gold/5 overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gold/20">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gold" />
              <p className="text-sm font-semibold text-gold">Production Slots — Draft</p>
              <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-gold/20 text-gold">
                {generatedSlots.length} types · {generatedSlots.reduce((s, sl) => s + sl.count, 0)} pieces
              </span>
            </div>
            <span className="text-2xs text-ink-tertiary">Generated from Video Quota Calculator · Unscheduled</span>
          </div>

          {/* Slot rows */}
          <div className="divide-y divide-border">
            {generatedSlots.map((slot) => {
              const typeCfg = DROP_TYPE_CONFIG[slot.type];
              const priorityCfg = SLOT_PRIORITY_STYLE[slot.priority];
              return (
                <div
                  key={slot.id}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Priority dot */}
                  <span className={cn("w-2 h-2 rounded-full flex-shrink-0", priorityCfg.dot)} />

                  {/* Count badge */}
                  <div className="w-8 h-8 rounded-lg bg-canvas-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-ink">{slot.count}</span>
                  </div>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{slot.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-2xs text-ink-tertiary">{slot.platformsLabel}</span>
                    </div>
                  </div>

                  {/* Type badge */}
                  <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0", typeCfg.color)}>
                    {typeCfg.label}
                  </span>

                  {/* Priority badge */}
                  <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0", priorityCfg.badge)}>
                    {slot.priority}
                  </span>

                  {/* Tag */}
                  <span className="text-2xs text-ink-tertiary bg-canvas-100 px-2 py-0.5 rounded-full flex-shrink-0 hidden lg:inline">
                    {slot.tag}
                  </span>

                  {/* Draft stage pill */}
                  <span className="text-2xs font-semibold px-2 py-1 rounded-full bg-canvas-200 text-ink-tertiary flex-shrink-0">
                    Draft
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gold/20 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <p className="text-2xs text-ink-secondary">
              {generatedSlots.reduce((s, sl) => s + sl.count, 0)} production pieces pushed to pipeline · Assign dates and owners to schedule
            </p>
          </div>
        </div>
      )}

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

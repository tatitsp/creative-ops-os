"use client";

import { ContentPipeline } from "@/components/dashboard/ContentPipeline";
import { Avatar } from "@/components/ui/Avatar";
import { CONTENT_PHASES, PLATFORM_CONFIG } from "@/lib/constants";
import { usePipelineStore } from "@/store/pipeline-store";
import { Film, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentPhase } from "@/types";

const PHASE_ORDER: ContentPhase[] = [
  "IDEA", "PLANNING", "PRODUCTION", "EDITING",
  "REVIEW", "APPROVED", "SCHEDULED", "POSTED",
];

export function ContentPageClient() {
  const items = usePipelineStore((s) => s.items);

  return (
    <div className="p-6 space-y-6 animate-in">
      {/* Pipeline board */}
      <div className="card p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-subheading">Pipeline Overview</h2>
            <p className="text-xs text-ink-tertiary mt-0.5">
              Drag content between phases to update status
            </p>
          </div>
        </div>
        <ContentPipeline />
      </div>

      {/* Phase count chips — reactive to drag */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {PHASE_ORDER.map((phase) => {
          const cfg = CONTENT_PHASES.find((p) => p.phase === phase)!;
          const count = items.filter((c) => c.phase === phase).length;
          return (
            <button
              key={phase}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium flex-shrink-0 transition-colors hover:border-border-strong",
                count > 0
                  ? "border-border bg-canvas-50"
                  : "border-dashed border-border bg-canvas-50 opacity-60",
              )}
            >
              <span className={cn("px-1.5 py-0.5 rounded-full text-2xs", cfg.color)}>
                {cfg.label}
              </span>
              <span className="text-ink font-semibold">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Content list — reflects current phase after drag */}
      <section>
        <h2 className="text-subheading mb-3">All Content</h2>
        <div className="card divide-y divide-border">
          {items.map((item) => {
            const phaseCfg = CONTENT_PHASES.find((p) => p.phase === item.phase)!;
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 hover:bg-canvas-50 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-canvas-100 flex items-center justify-center flex-shrink-0">
                  <Film className="w-4 h-4 text-ink-secondary" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {item.campaignName && (
                      <span className="text-2xs text-ink-tertiary">{item.campaignName}</span>
                    )}
                    <span className="text-2xs text-ink-tertiary">·</span>
                    <div className="flex items-center gap-1">
                      {item.platforms.slice(0, 3).map((p) => {
                        const cfg = PLATFORM_CONFIG[p];
                        return (
                          <span key={p} className="text-2xs px-1.5 py-0.5 rounded-full bg-canvas-100 text-ink-tertiary">
                            {cfg?.label ?? p}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <span className={cn("text-2xs font-medium px-2 py-1 rounded-full flex-shrink-0", phaseCfg?.color)}>
                  {phaseCfg?.label}
                </span>

                {item.scheduledAt && (
                  <span className="text-xs text-ink-tertiary flex-shrink-0 hidden md:block">
                    {new Date(item.scheduledAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric",
                      hour: "numeric", minute: "2-digit",
                    })}
                  </span>
                )}

                {item.assignee && <Avatar user={item.assignee} size="sm" />}
                <ChevronRight className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

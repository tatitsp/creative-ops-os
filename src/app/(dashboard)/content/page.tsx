import type { Metadata } from "next";
import { TopBar } from "@/components/navigation/TopBar";
import { ContentPipeline } from "@/components/dashboard/ContentPipeline";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { MOCK_CONTENT } from "@/lib/mock-data";
import { CONTENT_PHASES, PLATFORM_CONFIG } from "@/lib/constants";
import { Plus, Film, Camera, Layers, Mic, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentPhase } from "@/types";

export const metadata: Metadata = { title: "Content" };

const PHASE_ORDER: ContentPhase[] = [
  "IDEA", "PLANNING", "PRODUCTION", "EDITING",
  "REVIEW", "APPROVED", "SCHEDULED", "POSTED",
];

export default function ContentPage() {
  return (
    <div className="min-h-screen">
      <TopBar
        title="Content Pipeline"
        subtitle={`${MOCK_CONTENT.length} pieces tracked`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              Organic content
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              New content
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6 animate-in">
        {/* Phase summary */}
        <div className="card p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-subheading">Pipeline Overview</h2>
              <p className="text-xs text-ink-tertiary mt-0.5">
                Drag content between phases to update status
              </p>
            </div>
          </div>
          <ContentPipeline items={MOCK_CONTENT} />
        </div>

        {/* Phase count chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {PHASE_ORDER.map((phase) => {
            const cfg = CONTENT_PHASES.find((p) => p.phase === phase)!;
            const count = MOCK_CONTENT.filter((c) => c.phase === phase).length;
            return (
              <button
                key={phase}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium flex-shrink-0 transition-colors hover:border-violet-300",
                  count > 0 ? "border-border bg-white" : "border-dashed border-border bg-canvas-50 opacity-60",
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

        {/* Content list */}
        <section>
          <h2 className="text-subheading mb-3">All Content</h2>
          <div className="card divide-y divide-border">
            {MOCK_CONTENT.map((item) => {
              const phaseCfg = CONTENT_PHASES.find((p) => p.phase === item.phase)!;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 hover:bg-canvas-50 transition-colors cursor-pointer"
                >
                  {/* Type icon */}
                  <div className="w-9 h-9 rounded-lg bg-canvas-100 flex items-center justify-center flex-shrink-0">
                    <Film className="w-4 h-4 text-ink-secondary" />
                  </div>

                  {/* Info */}
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
                            <span
                              key={p}
                              className="text-2xs px-1.5 py-0.5 rounded-full bg-canvas-100 text-ink-tertiary"
                            >
                              {cfg?.label ?? p}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Phase */}
                  <span className={cn("text-2xs font-medium px-2 py-1 rounded-full flex-shrink-0", phaseCfg.color)}>
                    {phaseCfg.label}
                  </span>

                  {/* Scheduled date */}
                  {item.scheduledAt && (
                    <span className="text-xs text-ink-tertiary flex-shrink-0 hidden md:block">
                      {new Date(item.scheduledAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  )}

                  {/* Assignee */}
                  {item.assignee && <Avatar user={item.assignee} size="sm" />}

                  <ChevronRight className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import {
  APPROVAL_STAGE_CONFIG,
  type ApprovalItem,
  type ApprovalStage,
} from "@/lib/mock-releases";
import { PRIORITY_CONFIG } from "@/lib/constants";
import { CheckCircle2, XCircle, RotateCcw, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const STAGE_ORDER: ApprovalStage[] = [
  "DRAFT",
  "INTERNAL_REVIEW",
  "ARTIST_REVIEW",
  "MANAGEMENT_APPROVAL",
  "SCHEDULED",
  "POSTED",
];

interface ApprovalChainProps {
  approvals: ApprovalItem[];
}

export function ApprovalChain({ approvals }: ApprovalChainProps) {
  return (
    <div className="space-y-6">
      {/* Stage pipeline header */}
      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {STAGE_ORDER.map((stage, i) => {
          const cfg = APPROVAL_STAGE_CONFIG[stage];
          const count = approvals.filter((a) => a.stage === stage).length;
          const isLast = i === STAGE_ORDER.length - 1;

          return (
            <div key={stage} className="flex items-center flex-shrink-0">
              <div className={cn("flex flex-col items-center px-3 py-2 rounded-xl", count > 0 ? cfg.bg : "")}>
                <p className={cn("text-xs font-semibold", count > 0 ? cfg.color : "text-ink-tertiary")}>
                  {cfg.short}
                </p>
                <p
                  className={cn(
                    "text-lg font-bold leading-none mt-0.5",
                    count > 0 ? cfg.color : "text-ink-tertiary",
                  )}
                >
                  {count}
                </p>
              </div>
              {!isLast && <ArrowRight className="w-3.5 h-3.5 text-border-strong flex-shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Board columns */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {STAGE_ORDER.map((stage) => {
          const cfg = APPROVAL_STAGE_CONFIG[stage];
          const items = approvals.filter((a) => a.stage === stage);
          const isPosted = stage === "POSTED";

          return (
            <div key={stage}>
              {/* Column header */}
              <div
                className={cn(
                  "flex items-center justify-between mb-2 px-2 py-1.5 rounded-lg",
                  cfg.bg,
                )}
              >
                <span className={cn("text-xs font-semibold", cfg.color)}>{cfg.label}</span>
                <span className={cn("text-xs font-bold", cfg.color)}>{items.length}</span>
              </div>

              {/* Cards */}
              <div className="space-y-2 min-h-16">
                {items.length === 0 && (
                  <div className="h-12 border border-dashed border-border rounded-xl flex items-center justify-center">
                    <span className="text-2xs text-ink-tertiary">–</span>
                  </div>
                )}
                {items.map((item) => (
                  <ApprovalCard key={item.id} item={item} isPosted={isPosted} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed list for active items */}
      <div>
        <p className="text-label mb-3">Active approvals</p>
        <div className="space-y-2">
          {approvals
            .filter((a) => a.stage !== "POSTED")
            .sort((a, b) => {
              const order: Record<string, number> = {
                MANAGEMENT_APPROVAL: 0,
                ARTIST_REVIEW: 1,
                INTERNAL_REVIEW: 2,
                DRAFT: 3,
                SCHEDULED: 4,
              };
              return (order[a.stage] ?? 5) - (order[b.stage] ?? 5);
            })
            .map((item) => {
              const stageCfg = APPROVAL_STAGE_CONFIG[item.stage];
              const priorityCfg = PRIORITY_CONFIG[item.priority];
              const needsAction =
                item.stage === "MANAGEMENT_APPROVAL" || item.stage === "ARTIST_REVIEW";

              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-xl border transition-all",
                    needsAction
                      ? "bg-canvas-100 border-gold-200"
                      : "bg-canvas-50 border-border",
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                      stageCfg.bg,
                    )}
                  >
                    <span className={cn("text-xs font-bold", stageCfg.color)}>
                      {item.type[0]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-ink">{item.title}</p>
                      <span className={cn("text-2xs font-semibold", priorityCfg.color)}>
                        {priorityCfg.icon} {priorityCfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-2xs text-ink-tertiary">by {item.submittedBy}</span>
                      {item.submittedAt && (
                        <span className="text-2xs text-ink-tertiary">
                          · {formatRelativeTime(item.submittedAt)}
                        </span>
                      )}
                      {item.reviewer && (
                        <span className="text-2xs text-ink-tertiary">
                          · reviewing: {item.reviewer}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={cn(
                        "text-2xs font-semibold px-2 py-1 rounded-full hidden md:inline-flex",
                        stageCfg.bg,
                        stageCfg.color,
                      )}
                    >
                      {stageCfg.label}
                    </span>
                    {needsAction && (
                      <div className="flex items-center gap-1">
                        <button className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </button>
                        <button className="w-7 h-7 rounded-lg bg-canvas-100 flex items-center justify-center hover:bg-canvas-200 transition-colors">
                          <RotateCcw className="w-3.5 h-3.5 text-ink-secondary" />
                        </button>
                        <button className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center hover:bg-rose-100 transition-colors">
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function ApprovalCard({ item, isPosted }: { item: ApprovalItem; isPosted: boolean }) {
  const stageCfg = APPROVAL_STAGE_CONFIG[item.stage];

  return (
    <div
      className={cn(
        "p-2.5 rounded-xl border cursor-pointer hover:shadow-card transition-all",
        isPosted
          ? "bg-canvas-50 border-border opacity-60"
          : "bg-canvas-100 border-border hover:border-border-strong",
      )}
    >
      <p className={cn("text-xs font-medium leading-snug", isPosted && "line-through text-ink-tertiary")}>
        {item.title}
      </p>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-2xs text-ink-tertiary">{item.type}</span>
        <span className="text-2xs text-ink-tertiary">{item.submittedBy.split(" ")[0]}</span>
      </div>
    </div>
  );
}

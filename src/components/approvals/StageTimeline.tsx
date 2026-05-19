import { Fragment } from "react";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGE_ORDER, STAGE_SHORT } from "@/lib/mock-approvals";
import type { ApprovalStage, ApprovalStatus } from "@/types";

interface StageTimelineProps {
  currentStage: ApprovalStage;
  status: ApprovalStatus;
  compact?: boolean;
}

export function StageTimeline({ currentStage, status, compact = false }: StageTimelineProps) {
  const currentIdx = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className={cn("flex items-center", compact ? "gap-0" : "gap-0 w-full")}>
      {STAGE_ORDER.map((stage, idx) => {
        const isPast = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isFuture = idx > currentIdx;

        const isRevision = isCurrent && status === "REVISION_REQUESTED";
        const isRejected = isCurrent && status === "REJECTED";

        return (
          <Fragment key={stage}>
            <div className={cn("flex flex-col items-center", compact ? "gap-0.5" : "gap-1", !compact && "flex-1")}>
              {/* Dot */}
              <div
                className={cn(
                  "rounded-full flex items-center justify-center flex-shrink-0",
                  compact ? "w-2 h-2" : "w-6 h-6",
                  isPast && "bg-gold",
                  isCurrent && !isRevision && !isRejected && "bg-gold ring-2 ring-gold/25",
                  isRevision && "bg-amber-400 ring-2 ring-amber-400/25",
                  isRejected && "bg-rose-500 ring-2 ring-rose-500/25",
                  isFuture && "bg-canvas-200",
                )}
              >
                {!compact && isPast && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                {!compact && isRevision && <AlertCircle className="w-3 h-3 text-white" strokeWidth={2.5} />}
                {!compact && isCurrent && !isRevision && !isRejected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              {/* Label */}
              {!compact && (
                <span
                  className={cn(
                    "text-2xs text-center leading-tight",
                    isPast && "text-gold",
                    isCurrent && !isRevision && !isRejected && "text-white font-semibold",
                    isRevision && "text-amber-400 font-semibold",
                    isRejected && "text-rose-500 font-semibold",
                    isFuture && "text-ink-tertiary",
                  )}
                >
                  {STAGE_SHORT[stage]}
                </span>
              )}
            </div>

            {/* Connector */}
            {idx < STAGE_ORDER.length - 1 && (
              <div
                className={cn(
                  "h-px flex-shrink-0",
                  compact ? "w-3 mx-0.5" : "flex-1 mx-1 mb-4",
                  idx < currentIdx ? "bg-gold" : "bg-canvas-200",
                )}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

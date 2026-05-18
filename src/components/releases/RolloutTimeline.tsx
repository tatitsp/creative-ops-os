"use client";

import { cn } from "@/lib/utils";
import type { RolloutMilestone } from "@/lib/mock-releases";
import { CheckCircle2, Circle, Zap, Flag } from "lucide-react";

interface RolloutTimelineProps {
  milestones: RolloutMilestone[];
  releaseDate: string;
}

export function RolloutTimeline({ milestones, releaseDate }: RolloutTimelineProps) {
  const today = new Date();
  const daysToRelease = Math.ceil(
    (new Date(releaseDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="space-y-6">
      {/* Days-to-release banner */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-ink text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Flag className="w-5 h-5 text-violet-300" />
          </div>
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wider font-medium">Release Day Countdown</p>
            <p className="text-lg font-semibold mt-0.5">
              {daysToRelease > 0
                ? `${daysToRelease} days until Elijah drops`
                : daysToRelease === 0
                  ? "Today is release day"
                  : "Released"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/50">Target date</p>
          <p className="text-sm font-semibold text-violet-300">
            {new Date(releaseDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Horizontal scroll timeline */}
      <div className="overflow-x-auto pb-4">
        <div className="relative min-w-max px-4">
          {/* Track line */}
          <div className="absolute top-[2.15rem] left-8 right-8 h-px bg-border-strong" />

          {/* Progress fill up to current milestone */}
          <div
            className="absolute top-[2.15rem] left-8 h-px bg-violet-500 transition-all duration-700"
            style={{
              width: `${
                ((milestones.filter((m) => m.status === "COMPLETED").length /
                  milestones.length) *
                  100 *
                  (milestones.length - 1)) /
                milestones.length
              }%`,
            }}
          />

          {/* Milestones */}
          <div className="flex items-start gap-0">
            {milestones.map((milestone, i) => {
              const isCompleted = milestone.status === "COMPLETED";
              const isCurrent = milestone.status === "CURRENT";
              const isKeyDate = milestone.isKeyDate;
              const showAbove = i % 2 === 0;

              return (
                <div
                  key={milestone.id}
                  className="flex flex-col items-center"
                  style={{ width: "130px", flexShrink: 0 }}
                >
                  {/* Label above */}
                  <div className={cn("h-16 flex flex-col justify-end pb-2 px-2 text-center", !showAbove && "invisible")}>
                    <p
                      className={cn(
                        "text-xs font-semibold leading-tight",
                        isCompleted ? "text-ink-tertiary" : isCurrent ? "text-ink" : "text-ink-secondary",
                        isKeyDate && !isCompleted && "text-violet-700",
                      )}
                    >
                      {milestone.label}
                    </p>
                    <p className="text-2xs text-ink-tertiary mt-0.5">
                      {new Date(milestone.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>

                  {/* Dot */}
                  <div className="relative flex items-center justify-center z-10">
                    {isCompleted ? (
                      <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center ring-4 ring-canvas">
                        <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full bg-violet-600 ring-4 ring-violet-200 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white" strokeWidth={2.5} />
                      </div>
                    ) : isKeyDate ? (
                      <div className="w-4 h-4 rounded-full bg-white border-2 border-violet-400 ring-4 ring-canvas" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-white border-2 border-border-strong ring-4 ring-canvas" />
                    )}
                  </div>

                  {/* Label below */}
                  <div className={cn("h-16 flex flex-col pt-2 px-2 text-center", showAbove && "invisible")}>
                    <p
                      className={cn(
                        "text-xs font-semibold leading-tight",
                        isCompleted ? "text-ink-tertiary" : isCurrent ? "text-ink" : "text-ink-secondary",
                        isKeyDate && !isCompleted && "text-violet-700",
                      )}
                    >
                      {milestone.label}
                    </p>
                    <p className="text-2xs text-ink-tertiary mt-0.5">
                      {new Date(milestone.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Milestone list */}
      <div className="space-y-2">
        <p className="text-label">All milestones</p>
        {milestones.map((milestone) => {
          const isCompleted = milestone.status === "COMPLETED";
          const isCurrent = milestone.status === "CURRENT";

          return (
            <div
              key={milestone.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border transition-all",
                isCompleted && "bg-canvas-50 border-border opacity-70",
                isCurrent && "bg-violet-50 border-violet-200",
                milestone.status === "UPCOMING" && "bg-white border-border",
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-violet-500" />
                ) : isCurrent ? (
                  <Zap className="w-4 h-4 text-violet-600" />
                ) : (
                  <Circle className="w-4 h-4 text-ink-tertiary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCompleted ? "line-through text-ink-tertiary" : "text-ink",
                    )}
                  >
                    {milestone.label}
                  </p>
                  {milestone.isKeyDate && (
                    <span className="text-2xs font-semibold px-1.5 py-0.5 rounded-full bg-ink text-white">
                      Key date
                    </span>
                  )}
                </div>
                {milestone.sublabel && (
                  <p className="text-xs text-ink-tertiary mt-0.5">{milestone.sublabel}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-medium text-ink-secondary">
                  {new Date(milestone.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {isCurrent && (
                  <span className="text-2xs font-semibold text-violet-600">Now</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

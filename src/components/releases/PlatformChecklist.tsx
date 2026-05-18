"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PlatformChecklist as PlatformChecklistType } from "@/lib/mock-releases";
import { CheckCircle2, Circle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Progress } from "@/components/ui/Progress";

interface PlatformChecklistProps {
  checklists: PlatformChecklistType[];
}

export function PlatformChecklist({ checklists }: PlatformChecklistProps) {
  const [expanded, setExpanded] = useState<string>(checklists[0]?.platform ?? "");
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const cl of checklists) {
      for (const task of cl.tasks) {
        init[task.id] = task.done;
      }
    }
    return init;
  });

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Overall completion
  const allTasks = checklists.flatMap((cl) => cl.tasks);
  const totalDone = allTasks.filter((t) => checked[t.id]).length;
  const totalPct = Math.round((totalDone / allTasks.length) * 100);

  return (
    <div className="space-y-4">
      {/* Overall progress */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-ink">Publishing readiness</p>
          <span className="text-sm font-bold text-ink">{totalPct}%</span>
        </div>
        <Progress
          value={totalPct}
          color={totalPct >= 80 ? "emerald" : totalPct >= 50 ? "violet" : "amber"}
          size="md"
        />
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          {checklists.map((cl) => {
            const done = cl.tasks.filter((t) => checked[t.id]).length;
            const pct = Math.round((done / cl.tasks.length) * 100);
            return (
              <div key={cl.platform} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cl.color }}
                />
                <span className="text-2xs text-ink-secondary">{cl.label}</span>
                <span
                  className={cn(
                    "text-2xs font-bold",
                    pct === 100 ? "text-emerald-600" : pct >= 50 ? "text-amber-500" : "text-rose-500",
                  )}
                >
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-platform accordion */}
      <div className="space-y-3">
        {checklists.map((cl) => {
          const isOpen = expanded === cl.platform;
          const done = cl.tasks.filter((t) => checked[t.id]).length;
          const required = cl.tasks.filter((t) => t.required);
          const requiredDone = required.filter((t) => checked[t.id]).length;
          const allRequiredDone = requiredDone === required.length;
          const pct = Math.round((done / cl.tasks.length) * 100);

          return (
            <div
              key={cl.platform}
              className={cn(
                "rounded-xl border overflow-hidden transition-all",
                isOpen ? "border-border-strong shadow-card" : "border-border",
              )}
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(isOpen ? "" : cl.platform)}
                className="w-full flex items-center gap-4 px-4 py-3.5 bg-white hover:bg-canvas-50 transition-colors"
              >
                {/* Platform dot */}
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cl.color }}
                />

                {/* Name */}
                <span className="text-sm font-semibold text-ink flex-1 text-left">{cl.label}</span>

                {/* Required warning */}
                {!allRequiredDone && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span className="text-2xs font-medium hidden sm:block">
                      {required.length - requiredDone} required
                    </span>
                  </div>
                )}

                {/* Progress */}
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-canvas-200 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        pct === 100 ? "bg-emerald-500" : pct >= 50 ? "bg-violet-500" : "bg-amber-400",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-ink-secondary w-10 text-right">
                    {done}/{cl.tasks.length}
                  </span>
                </div>

                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
                )}
              </button>

              {/* Task list */}
              {isOpen && (
                <div className="border-t border-border divide-y divide-border">
                  {cl.tasks.map((task) => {
                    const isDone = checked[task.id];

                    return (
                      <label
                        key={task.id}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-canvas-50 transition-colors",
                          isDone && "bg-canvas-50",
                        )}
                      >
                        <button
                          onClick={() => toggle(task.id)}
                          className="mt-0.5 flex-shrink-0 focus:outline-none"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-ink-tertiary" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-sm",
                                isDone ? "line-through text-ink-tertiary" : "text-ink font-medium",
                              )}
                            >
                              {task.label}
                            </span>
                            {task.required && !isDone && (
                              <span className="text-2xs font-semibold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-500">
                                Required
                              </span>
                            )}
                          </div>
                          {task.notes && (
                            <p className="text-2xs text-ink-tertiary mt-0.5">{task.notes}</p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

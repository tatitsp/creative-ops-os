"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { TASK_STATUS_CONFIG, PRIORITY_CONFIG } from "@/lib/constants";
import type { Task } from "@/types";
import { CheckCircle2, Circle } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  compact?: boolean;
}

export function TaskList({ tasks, compact = false }: TaskListProps) {
  return (
    <div className="space-y-1">
      {tasks.map((task) => {
        const statusCfg = TASK_STATUS_CONFIG[task.status];
        const priorityCfg = PRIORITY_CONFIG[task.priority];
        const isDone = task.status === "DONE";

        return (
          <div
            key={task.id}
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-lg hover:bg-canvas-100 transition-colors cursor-pointer group",
              isDone && "opacity-50",
            )}
          >
            {/* Checkbox */}
            <button className="flex-shrink-0 text-ink-tertiary hover:text-white transition-colors">
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-semibold truncate",
                    isDone ? "line-through text-ink-tertiary" : "text-ink",
                  )}
                >
                  {task.title}
                </span>
                <span className={cn("text-2xs font-bold flex-shrink-0", priorityCfg.color)}>
                  {priorityCfg.icon}
                </span>
              </div>
              {!compact && task.campaignName && (
                <p className="text-2xs text-ink-tertiary mt-0.5 truncate">{task.campaignName}</p>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {task.dueDate && !isDone && (
                <span
                  className={cn(
                    "text-2xs",
                    new Date(task.dueDate) < new Date()
                      ? "text-rose-500 font-semibold"
                      : "text-ink-tertiary",
                  )}
                >
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}

              <span
                className={cn(
                  "hidden sm:inline-flex items-center gap-1 text-2xs font-semibold px-1.5 py-0.5 rounded-full",
                  statusCfg.color,
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                {statusCfg.label}
              </span>

              {task.assignee && <Avatar user={task.assignee} size="xs" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

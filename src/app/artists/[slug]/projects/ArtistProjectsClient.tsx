"use client";

import { useState } from "react";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Plus, LayoutGrid, List, Check } from "lucide-react";
import type { CAAM1K_CAMPAIGNS, CAAM1K_TASKS } from "@/lib/mock-artist2";

type Campaign = typeof CAAM1K_CAMPAIGNS[0];
type Task = typeof CAAM1K_TASKS[0];

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:    "bg-emerald-50 text-emerald-600",
  PLANNING:  "bg-canvas-100 text-ink-tertiary",
  ANALYTICS: "bg-blue-50 text-blue-600",
  POSTED:    "bg-canvas-100 text-ink-secondary",
};

const TASK_STATUS_STYLES: Record<string, string> = {
  TODO:        "bg-canvas-100 text-ink-tertiary",
  IN_PROGRESS: "bg-gold-50 text-gold",
  IN_REVIEW:   "bg-amber-50 text-amber-600",
  DONE:        "bg-emerald-50 text-emerald-600",
};

const PRIORITY_STYLES: Record<string, string> = {
  URGENT: "text-rose-500",
  HIGH:   "text-amber-500",
  MEDIUM: "text-ink-tertiary",
  LOW:    "text-ink-tertiary",
};

const STATUS_TABS = ["All", "ACTIVE", "PLANNING", "ANALYTICS", "POSTED"] as const;

interface Props {
  artistName: string;
  campaigns: Campaign[];
  tasks: Task[];
}

export function ArtistProjectsClient({ artistName, campaigns, tasks }: Props) {
  const [activeStatus, setActiveStatus] = useState<typeof STATUS_TABS[number]>("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [toast, setToast] = useState<string | null>(null);

  const filtered = activeStatus === "All" ? campaigns : campaigns.filter((c) => c.status === activeStatus);
  const open = tasks.filter((t) => t.status !== "DONE").length;
  const done = tasks.filter((t) => t.status === "DONE").length;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="min-h-screen">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      <TopBar
        title="Projects & Campaigns"
        subtitle={`${campaigns.length} total campaigns`}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => showToast("Campaign creation coming soon")}>
            New campaign
          </Button>
        }
      />

      <div className="p-6 space-y-6 animate-in max-w-5xl">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active",   count: campaigns.filter((c) => c.status === "ACTIVE").length,   dot: "bg-emerald-400" },
            { label: "Planning", count: campaigns.filter((c) => c.status === "PLANNING").length, dot: "bg-amber-400" },
            { label: "Complete", count: 0, dot: "bg-canvas-200" },
            { label: "Paused",   count: 0, dot: "bg-canvas-200" },
          ].map((s) => (
            <div key={s.label} className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("w-2 h-2 rounded-full", s.dot)} />
                <span className="text-xs font-medium text-ink-secondary">{s.label}</span>
              </div>
              <p className="text-2xl font-semibold text-ink">{s.count}</p>
            </div>
          ))}
        </div>

        {/* Tabs + toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-canvas-100 rounded-lg p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatus(tab)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  activeStatus === tab ? "bg-canvas-200 text-ink shadow-card" : "text-ink-secondary hover:text-ink",
                )}
              >
                {tab === "All" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setView("grid")} className={cn("p-2 rounded-lg border border-border transition-colors", view === "grid" ? "bg-canvas-200 text-ink shadow-card" : "hover:bg-canvas-100 text-ink-tertiary")}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView("list")} className={cn("p-2 rounded-lg border border-border transition-colors", view === "list" ? "bg-canvas-200 text-ink shadow-card" : "hover:bg-canvas-100 text-ink-tertiary")}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <div key={c.id} className="card p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-ink">{c.name}</p>
                    <p className="text-2xs text-ink-tertiary mt-0.5">{c.startDate} → {c.endDate}</p>
                  </div>
                  <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0", STATUS_STYLES[c.status] ?? "bg-canvas-100 text-ink-tertiary")}>
                    {c.status}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xs text-ink-tertiary">{c.completedTasks} / {c.taskCount} tasks</span>
                    <span className="text-2xs font-semibold text-ink">{c.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-canvas-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {c.platforms.map((p) => (
                    <span key={p} className="text-2xs px-1.5 py-0.5 rounded bg-canvas-100 text-ink-tertiary capitalize">{p}</span>
                  ))}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 py-16 text-center text-sm text-ink-tertiary">No campaigns match this filter.</div>
            )}
          </div>
        ) : (
          <div className="card divide-y divide-border">
            {filtered.map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-4 hover:bg-canvas-50 transition-colors">
                <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0", STATUS_STYLES[c.status] ?? "bg-canvas-100 text-ink-tertiary")}>
                  {c.status}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{c.name}</p>
                </div>
                <span className="text-xs text-ink-secondary">{c.progress}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Deliverables */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-subheading">Deliverables</h2>
              <p className="text-xs text-ink-tertiary mt-0.5">{open} open · {done} completed</p>
            </div>
            <Button size="sm" variant="secondary" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => showToast("Task creation coming soon")}>
              Add task
            </Button>
          </div>
          <div className="card divide-y divide-border">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 px-4 py-3.5">
                <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0", TASK_STATUS_STYLES[task.status])}>
                  {task.status.replace("_", " ")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium truncate", task.status === "DONE" ? "line-through text-ink-tertiary" : "text-ink")}>
                    {task.title}
                  </p>
                  <p className="text-2xs text-ink-tertiary mt-0.5">{task.campaignName}</p>
                </div>
                <span className={cn("text-2xs font-medium flex-shrink-0", PRIORITY_STYLES[task.priority])}>{task.priority}</span>
                <span className="text-2xs text-ink-tertiary flex-shrink-0">{task.assignee}</span>
                <span className="text-2xs text-ink-tertiary flex-shrink-0">{task.dueDate}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

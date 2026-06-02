"use client";

import { useState } from "react";
import { TopBar } from "@/components/navigation/TopBar";
import { CampaignCard } from "@/components/dashboard/CampaignCard";
import { TaskList } from "@/components/dashboard/TaskList";
import { Button } from "@/components/ui/Button";
import { MOCK_CAMPAIGNS, MOCK_TASKS } from "@/lib/mock-data";
import { CAMPAIGN_STATUS_CONFIG } from "@/lib/constants";
import { Plus, LayoutGrid, List } from "lucide-react";
import type { CampaignStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_TABS: { label: string; value: CampaignStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Planning", value: "PLANNING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Archived", value: "ARCHIVED" },
];

export function ProjectsPageClient() {
  const [activeStatus, setActiveStatus] = useState<CampaignStatus | "ALL">("ALL");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [toast, setToast] = useState<string | null>(null);

  const filtered =
    activeStatus === "ALL"
      ? MOCK_CAMPAIGNS
      : MOCK_CAMPAIGNS.filter((c) => c.status === activeStatus);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="min-h-screen">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg animate-in">
          {toast}
        </div>
      )}

      <TopBar
        title="Campaigns"
        subtitle={`${MOCK_CAMPAIGNS.length} total campaigns`}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => showToast("Campaign creation opens after partnership launch")}
          >
            New campaign
          </Button>
        }
      />

      <div className="p-6 space-y-6 animate-in">
        {/* Summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(["ACTIVE", "PLANNING", "COMPLETED", "PAUSED"] as CampaignStatus[]).map((status) => {
            const count = MOCK_CAMPAIGNS.filter((c) => c.status === status).length;
            const cfg = CAMPAIGN_STATUS_CONFIG[status];
            return (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={cn(
                  "card p-4 text-left transition-all",
                  activeStatus === status && "ring-1 ring-gold border-gold-200",
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("w-2 h-2 rounded-full", cfg.dot)} />
                  <span className="text-xs font-medium text-ink-secondary">{cfg.label}</span>
                </div>
                <p className="text-2xl font-semibold text-ink">{count}</p>
              </button>
            );
          })}
        </div>

        {/* Filter tabs + view toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-canvas-100 rounded-lg p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveStatus(tab.value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  activeStatus === tab.value
                    ? "bg-canvas-200 text-ink shadow-card"
                    : "text-ink-secondary hover:text-ink",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "p-2 rounded-lg border border-border transition-colors",
                view === "grid"
                  ? "bg-canvas-200 text-ink shadow-card"
                  : "hover:bg-canvas-100 text-ink-tertiary",
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "p-2 rounded-lg border border-border transition-colors",
                view === "list"
                  ? "bg-canvas-200 text-ink shadow-card"
                  : "hover:bg-canvas-100 text-ink-tertiary",
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Campaign grid or list */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 py-16 text-center text-sm text-ink-tertiary">
                No campaigns match this filter.
              </div>
            )}
          </div>
        ) : (
          <div className="card divide-y divide-border">
            {filtered.map((c) => {
              const cfg = CAMPAIGN_STATUS_CONFIG[c.status];
              return (
                <div key={c.id} className="flex items-center gap-4 p-4 hover:bg-canvas-50 transition-colors">
                  <span className={cn("w-2 h-2 rounded-full flex-shrink-0", cfg.dot)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{c.name}</p>
                    <p className="text-xs text-ink-tertiary">{cfg.label}</p>
                  </div>
                  <span className="text-xs text-ink-secondary">{c.progress ?? 0}%</span>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-16 text-center text-sm text-ink-tertiary">
                No campaigns match this filter.
              </div>
            )}
          </div>
        )}

        {/* All tasks section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-subheading">All Tasks</h2>
              <p className="text-xs text-ink-tertiary mt-0.5">
                {MOCK_TASKS.filter((t) => t.status !== "DONE").length} open ·{" "}
                {MOCK_TASKS.filter((t) => t.status === "DONE").length} completed
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => showToast("Deliverable creation coming soon")}
            >
              Add deliverable
            </Button>
          </div>
          <div className="card p-2">
            <TaskList tasks={MOCK_TASKS} />
          </div>
        </section>
      </div>
    </div>
  );
}

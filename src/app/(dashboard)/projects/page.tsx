import type { Metadata } from "next";
import { TopBar } from "@/components/navigation/TopBar";
import { CampaignCard } from "@/components/dashboard/CampaignCard";
import { TaskList } from "@/components/dashboard/TaskList";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { MOCK_CAMPAIGNS, MOCK_TASKS } from "@/lib/mock-data";
import { CAMPAIGN_STATUS_CONFIG } from "@/lib/constants";
import { Plus, FolderKanban, LayoutGrid, List } from "lucide-react";
import type { CampaignStatus } from "@/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Projects" };

const STATUS_TABS: { label: string; value: CampaignStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Planning", value: "PLANNING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Archived", value: "ARCHIVED" },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <TopBar
        title="Projects & Campaigns"
        subtitle={`${MOCK_CAMPAIGNS.length} total campaigns`}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
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
              <div key={status} className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("w-2 h-2 rounded-full", cfg.dot)} />
                  <span className="text-xs font-medium text-ink-secondary">{cfg.label}</span>
                </div>
                <p className="text-2xl font-semibold text-ink">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Filter tabs + view toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-canvas-100 rounded-lg p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  tab.value === "ALL"
                    ? "bg-canvas-200 text-ink shadow-card"
                    : "text-ink-secondary hover:text-ink",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg bg-canvas-200 border border-border text-ink shadow-card">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-canvas-100 text-ink-tertiary transition-colors">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Campaign grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_CAMPAIGNS.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>

        {/* All tasks section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-subheading">All Deliverables</h2>
              <p className="text-xs text-ink-tertiary mt-0.5">
                {MOCK_TASKS.filter((t) => t.status !== "DONE").length} open ·{" "}
                {MOCK_TASKS.filter((t) => t.status === "DONE").length} completed
              </p>
            </div>
            <Button size="sm" variant="secondary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
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

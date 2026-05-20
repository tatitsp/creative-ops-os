import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { CAAM1K_CAMPAIGNS, CAAM1K_TASKS } from "@/lib/mock-artist2";
import { Plus, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Projects` : "Projects" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

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

export default async function ArtistProjectsPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  const open = CAAM1K_TASKS.filter((t) => t.status !== "DONE").length;
  const done = CAAM1K_TASKS.filter((t) => t.status === "DONE").length;

  return (
    <>
      <TopBar
        title="Projects & Campaigns"
        subtitle={`${CAAM1K_CAMPAIGNS.length} total campaigns`}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
            New campaign
          </Button>
        }
      />

      <div className="p-6 space-y-6 animate-in max-w-5xl">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active",   count: CAAM1K_CAMPAIGNS.filter(c => c.status === "ACTIVE").length,   dot: "bg-emerald-400" },
            { label: "Planning", count: CAAM1K_CAMPAIGNS.filter(c => c.status === "PLANNING").length,  dot: "bg-amber-400" },
            { label: "Complete", count: 0,                                                             dot: "bg-canvas-200" },
            { label: "Paused",   count: 0,                                                             dot: "bg-canvas-200" },
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

        {/* Campaigns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {CAAM1K_CAMPAIGNS.map((c) => (
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
        </div>

        {/* Deliverables */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-subheading">Deliverables</h2>
              <p className="text-xs text-ink-tertiary mt-0.5">{open} open · {done} completed</p>
            </div>
            <Button size="sm" variant="secondary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add task
            </Button>
          </div>
          <div className="card divide-y divide-border">
            {CAAM1K_TASKS.map((task) => (
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
                <span className={cn("text-2xs font-medium flex-shrink-0", PRIORITY_STYLES[task.priority])}>
                  {task.priority}
                </span>
                <span className="text-2xs text-ink-tertiary flex-shrink-0">{task.assignee}</span>
                <span className="text-2xs text-ink-tertiary flex-shrink-0">{task.dueDate}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

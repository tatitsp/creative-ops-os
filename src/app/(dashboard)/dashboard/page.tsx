import type { Metadata } from "next";
import { TopBar } from "@/components/navigation/TopBar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CampaignCard } from "@/components/dashboard/CampaignCard";
import { ContentPipeline } from "@/components/dashboard/ContentPipeline";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ApprovalQueue } from "@/components/dashboard/ApprovalQueue";
import { TaskList } from "@/components/dashboard/TaskList";
import {
  MOCK_CAMPAIGNS,
  MOCK_TASKS,
  MOCK_CONTENT,
  MOCK_APPROVALS,
  MOCK_ACTIVITY,
} from "@/lib/mock-data";
import {
  Layers,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Dashboard" };

const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "ACTIVE" || c.status === "PLANNING");
const pendingTasks = MOCK_TASKS.filter((t) => t.status !== "DONE" && t.status !== "ARCHIVED");
const pendingApprovals = MOCK_APPROVALS.filter(
  (a) => a.status === "PENDING" || a.status === "REVISION_REQUESTED",
);

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen">
      <TopBar
        title="Dashboard"
        subtitle={today}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              View reports
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Zap className="w-3.5 h-3.5" />}>
              Quick create
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6 animate-in">
        {/* Welcome banner */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-600 via-violet-700 to-violet-900 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent)] pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-medium text-violet-200 uppercase tracking-wider">
              High-performance peace
            </p>
            <h2 className="text-xl font-semibold mt-1">Good morning, Key.</h2>
            <p className="text-sm text-violet-200 mt-1 max-w-md">
              You have {pendingTasks.length} open deliverables and {pendingApprovals.length} approval
              {pendingApprovals.length !== 1 ? "s" : ""} waiting. Let&apos;s make it happen.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <Link href="/content">
                <Button
                  size="sm"
                  className="bg-white/15 text-white border-white/20 border hover:bg-white/25"
                >
                  Content pipeline
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button
                  size="sm"
                  className="bg-white/10 text-white border-white/15 border hover:bg-white/20"
                >
                  View campaigns
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            label="Active Campaigns"
            value={activeCampaigns.length}
            change={1}
            changeLabel="this month"
            trend="up"
            accent="violet"
            icon={<Layers className="w-4 h-4" />}
          />
          <MetricCard
            label="Open Deliverables"
            value={pendingTasks.length}
            change={3}
            changeLabel="vs last week"
            trend="down"
            accent="amber"
            icon={<Clock className="w-4 h-4" />}
          />
          <MetricCard
            label="Pending Approvals"
            value={pendingApprovals.length}
            trend="neutral"
            accent="rose"
            icon={<CheckCircle2 className="w-4 h-4" />}
          />
          <MetricCard
            label="Engagement Rate"
            value="4.8%"
            change={0.4}
            changeLabel="vs prev 30d"
            trend="up"
            accent="emerald"
            icon={<TrendingUp className="w-4 h-4" />}
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left column — 2/3 */}
          <div className="xl:col-span-2 space-y-6">
            {/* Campaigns */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-subheading">Active Campaigns</h2>
                <Link
                  href="/projects"
                  className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
                >
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeCampaigns.slice(0, 4).map((c) => (
                  <CampaignCard key={c.id} campaign={c} />
                ))}
              </div>
            </section>

            {/* Content pipeline */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-subheading">Content Pipeline</h2>
                  <p className="text-xs text-ink-tertiary mt-0.5">
                    Idea → Planning → Production → Editing → Review → Approved → Scheduled → Posted
                  </p>
                </div>
                <Link
                  href="/content"
                  className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
                >
                  Full pipeline <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="card p-4">
                <ContentPipeline items={MOCK_CONTENT} />
              </div>
            </section>

            {/* Tasks */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-subheading">Open Deliverables</h2>
                <Link
                  href="/projects"
                  className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
                >
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="card p-2">
                <TaskList tasks={pendingTasks} />
              </div>
            </section>
          </div>

          {/* Right column — 1/3 */}
          <div className="space-y-6">
            {/* Approvals */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-subheading">Approvals</h2>
                  {pendingApprovals.length > 0 && (
                    <span className="w-5 h-5 bg-violet-600 text-white text-2xs font-bold rounded-full flex items-center justify-center">
                      {pendingApprovals.length}
                    </span>
                  )}
                </div>
              </div>
              <div className="card p-4">
                <ApprovalQueue approvals={pendingApprovals} />
              </div>
            </section>

            {/* Activity feed */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-subheading">Team Activity</h2>
              </div>
              <div className="card p-4">
                <ActivityFeed items={MOCK_ACTIVITY} />
              </div>
            </section>

            {/* Wellness card */}
            <section>
              <div className="card p-4 bg-gradient-to-br from-emerald-50 to-sky-50 border-emerald-100">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🌿</div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">Workload Check</p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      Team capacity is healthy this week. No one is over-assigned.
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      {[
                        { name: "Maya", load: 80 },
                        { name: "Darius", load: 90 },
                        { name: "Sofia", load: 65 },
                      ].map((m) => (
                        <div key={m.name} className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-2xs text-emerald-700">{m.name}</span>
                            <span className="text-2xs text-emerald-600 font-medium">{m.load}%</span>
                          </div>
                          <div className="h-1 bg-emerald-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${m.load >= 90 ? "bg-amber-400" : "bg-emerald-500"}`}
                              style={{ width: `${m.load}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

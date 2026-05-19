import type { Metadata } from "next";
import { DashboardHero, type DockCard } from "@/components/dashboard/DashboardHero";
import { ApprovalQueue } from "@/components/dashboard/ApprovalQueue";
import {
  MOCK_CAMPAIGNS,
  MOCK_CONTENT,
  MOCK_APPROVALS,
  MOCK_USERS,
} from "@/lib/mock-data";
import { MOCK_RELEASES } from "@/lib/mock-releases";
import { Disc3, FolderKanban, Film, BarChart2, Users, CheckSquare } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

// ─── Derived statuses ─────────────────────────────────────────────────────────

const pendingApprovals = MOCK_APPROVALS.filter(
  (a) => a.status === "PENDING" || a.status === "REVISION_REQUESTED",
);

const activeRelease = MOCK_RELEASES.find((r) => r.status === "PRE_RELEASE");
const releaseDaysAway = activeRelease
  ? Math.ceil(
      (new Date(activeRelease.releaseDate).getTime() - new Date(2026, 4, 18).getTime()) /
        (1000 * 60 * 60 * 24),
    )
  : null;

const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "ACTIVE");
const planningCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "PLANNING");

const contentInProgress = MOCK_CONTENT.filter(
  (c) => c.phase !== "POSTED" && c.phase !== "ARCHIVED",
);
const nextScheduled = MOCK_CONTENT.filter(
  (c) => c.scheduledAt && c.phase === "APPROVED",
).sort(
  (a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime(),
)[0];

const activeTeam = MOCK_USERS.filter((u) => u.status === "ACTIVE");
const awayTeam = MOCK_USERS.filter((u) => u.status === "AWAY" || u.status === "BUSY");

// ─── Dock cards ──────────────────────────────────────────────────────────────

const DOCK_CARDS: DockCard[] = [
  {
    href: "/releases",
    label: "Releases",
    status: activeRelease
      ? `${MOCK_RELEASES.filter((r) => r.status === "PRE_RELEASE").length} active · ${releaseDaysAway}d to ${activeRelease.title}`
      : "No active releases",
    icon: <Disc3 className="w-5 h-5 text-gold" />,
  },
  {
    href: "/projects",
    label: "Projects",
    status: `${activeCampaigns.length} active campaign${activeCampaigns.length !== 1 ? "s" : ""} · ${planningCampaigns.length} in planning`,
    icon: <FolderKanban className="w-5 h-5 text-sky-500" />,
  },
  {
    href: "/content",
    label: "Content",
    status: nextScheduled
      ? `${contentInProgress.length} in pipeline · next ${new Date(nextScheduled.scheduledAt!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      : `${contentInProgress.length} pieces in pipeline`,
    icon: <Film className="w-5 h-5 text-emerald-500" />,
  },
  {
    href: "/analytics",
    label: "Analytics",
    status: "Engagement 4.8% · +0.4% vs last 30d",
    icon: <BarChart2 className="w-5 h-5 text-amber-400" />,
  },
  {
    href: "/team",
    label: "Team",
    status: `${MOCK_USERS.length} members · ${activeTeam.length} active${awayTeam.length > 0 ? `, ${awayTeam.length} unavail.` : ""}`,
    icon: <Users className="w-5 h-5 text-rose-500" />,
  },
  {
    href: "#approvals",
    label: "Approvals",
    status:
      pendingApprovals.length > 0
        ? `${pendingApprovals.length} item${pendingApprovals.length !== 1 ? "s" : ""} waiting on you`
        : "All clear",
    icon: <CheckSquare className="w-5 h-5 text-gold" />,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <DashboardHero cards={DOCK_CARDS} />

      {/* Approvals queue below hero */}
      <div className="p-6 animate-in" id="approvals">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-subheading">Approvals</h2>
          {pendingApprovals.length > 0 && (
            <span className="w-5 h-5 bg-gold text-white text-2xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
              {pendingApprovals.length}
            </span>
          )}
        </div>
        <div className="card p-4 max-w-2xl">
          <ApprovalQueue approvals={pendingApprovals} />
        </div>
      </div>
    </div>
  );
}

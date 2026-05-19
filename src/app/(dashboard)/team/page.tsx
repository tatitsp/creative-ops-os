import type { Metadata } from "next";
import { TopBar } from "@/components/navigation/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { MOCK_USERS, MOCK_TASKS } from "@/lib/mock-data";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { UserPlus, Mail, MoreHorizontal } from "lucide-react";

export const metadata: Metadata = { title: "Team" };

const STATUS_DOT: Record<string, string> = {
  ACTIVE: "bg-emerald-500",
  AWAY: "bg-amber-400",
  BUSY: "bg-rose-500",
  OFFLINE: "bg-ink-tertiary",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Active",
  AWAY: "Away",
  BUSY: "Busy",
  OFFLINE: "Offline",
};

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      <TopBar
        title="Team"
        subtitle={`${MOCK_USERS.length} members`}
        actions={
          <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-3.5 h-3.5" />}>
            Invite member
          </Button>
        }
      />

      <div className="p-6 space-y-6 animate-in">
        {/* Role summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {(["ARTIST_CEO", "MANAGEMENT", "CREATIVE_OPS_DIRECTOR", "EDITOR", "SOCIAL_MEDIA"] as const).map(
            (role) => {
              const count = MOCK_USERS.filter((u) => u.role === role).length;
              return (
                <div key={role} className="card p-3 text-center">
                  <p className="text-lg font-semibold text-ink">{count}</p>
                  <p className="text-2xs text-ink-tertiary mt-0.5 leading-tight">{ROLE_LABELS[role]}</p>
                </div>
              );
            },
          )}
        </div>

        {/* Team cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_USERS.map((user) => {
            const userTasks = MOCK_TASKS.filter(
              (t) => t.assignee?.id === user.id && t.status !== "DONE",
            );
            const completedTasks = MOCK_TASKS.filter(
              (t) => t.assignee?.id === user.id && t.status === "DONE",
            );
            const totalTasks = userTasks.length + completedTasks.length;
            const workloadPct = totalTasks > 0 ? Math.round((userTasks.length / Math.max(totalTasks, 5)) * 100) : 0;

            return (
              <div key={user.id} className="card p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar user={user} size="md" showStatus />
                    <div>
                      <p className="text-sm font-semibold text-ink">{user.name}</p>
                      <p className="text-xs text-ink-tertiary">{user.email}</p>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-ink-tertiary" />
                  </button>
                </div>

                {/* Role badge + status */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", ROLE_COLORS[user.role])}>
                    {ROLE_LABELS[user.role]}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[user.status])} />
                    <span className="text-xs text-ink-tertiary">{STATUS_LABEL[user.status]}</span>
                  </div>
                </div>

                {/* Workload */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-secondary">Workload</span>
                    <span className="text-xs text-ink-secondary">
                      {userTasks.length} open · {completedTasks.length} done
                    </span>
                  </div>
                  <Progress
                    value={workloadPct}
                    color={workloadPct >= 90 ? "amber" : workloadPct >= 70 ? "gold" : "emerald"}
                    showLabel
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <Button size="sm" variant="secondary" className="flex-1" leftIcon={<Mail className="w-3 h-3" />}>
                    Message
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1">
                    View work
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

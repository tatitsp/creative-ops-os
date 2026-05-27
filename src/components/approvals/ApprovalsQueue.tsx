"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Clock, RotateCcw, XCircle, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGE_LABELS, STAGE_ORDER } from "@/lib/mock-approvals";
import { ApprovalCard } from "@/components/approvals/ApprovalCard";
import { useApprovalsStore } from "@/store/approvals-store";
import type { ApprovalStatus } from "@/types";

// ─── Filter config ────────────────────────────────────────────────────────────

const STATUS_TABS: { key: ApprovalStatus | "ALL"; label: string; icon: React.ReactNode }[] = [
  { key: "ALL",               label: "All",             icon: <Filter className="w-3 h-3" /> },
  { key: "PENDING",           label: "Pending",         icon: <Clock className="w-3 h-3" /> },
  { key: "REVISION_REQUESTED",label: "Revision Needed", icon: <RotateCcw className="w-3 h-3" /> },
  { key: "APPROVED",          label: "Approved",        icon: <CheckCircle2 className="w-3 h-3" /> },
  { key: "REJECTED",          label: "Rejected",        icon: <XCircle className="w-3 h-3" /> },
];

const PRIORITY_OPTIONS = ["ALL", "URGENT", "HIGH", "MEDIUM", "LOW"] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function ApprovalsQueue() {
  const { approvals, approve, requestRevision, reject } = useApprovalsStore();
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | "ALL">("ALL");
  const [campaignFilter, setCampaignFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState<typeof PRIORITY_OPTIONS[number]>("ALL");

  // Unique campaigns for filter dropdown
  const campaigns = useMemo(() => {
    const names = [...new Set(approvals.map((a) => a.campaign))];
    return ["ALL", ...names];
  }, [approvals]);

  // Filtered list
  const filtered = useMemo(() => {
    return approvals.filter((a) => {
      if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
      if (campaignFilter !== "ALL" && a.campaign !== campaignFilter) return false;
      if (priorityFilter !== "ALL" && a.priority !== priorityFilter) return false;
      return true;
    });
  }, [approvals, statusFilter, campaignFilter, priorityFilter]);

  // Counts for tab badges
  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: approvals.length };
    for (const a of approvals) {
      c[a.status] = (c[a.status] ?? 0) + 1;
    }
    return c;
  }, [approvals]);

  return (
    <div className="space-y-5">
      {/* ── Status tabs ── */}
      <div className="flex items-center gap-1 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const count = counts[tab.key] ?? 0;
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all",
                isActive
                  ? "bg-gold text-white border-gold"
                  : "bg-canvas-50 text-ink-secondary border-border hover:border-border-strong hover:text-ink",
              )}
            >
              {tab.icon}
              {tab.label}
              {count > 0 && (
                <span className={cn("text-2xs font-bold px-1.5 py-0.5 rounded-full", isActive ? "bg-white/20 text-white" : "bg-canvas-200 text-ink-tertiary")}>
                  {count}
                </span>
              )}
            </button>
          );
        })}

        {/* Campaign filter */}
        <div className="ml-auto flex items-center gap-2">
          <select
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="text-xs bg-canvas-50 border border-border text-ink-secondary rounded-lg px-2.5 py-1.5 outline-none hover:border-border-strong transition-colors cursor-pointer"
          >
            {campaigns.map((c) => (
              <option key={c} value={c}>{c === "ALL" ? "All Campaigns" : c}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as typeof PRIORITY_OPTIONS[number])}
            className="text-xs bg-canvas-50 border border-border text-ink-secondary rounded-lg px-2.5 py-1.5 outline-none hover:border-border-strong transition-colors cursor-pointer"
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p === "ALL" ? "All Priorities" : p.charAt(0) + p.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Results count ── */}
      <p className="text-xs text-ink-tertiary">
        {filtered.length} {filtered.length === 1 ? "item" : "items"}
        {statusFilter !== "ALL" || campaignFilter !== "ALL" || priorityFilter !== "ALL" ? " matching filters" : " total"}
      </p>

      {/* ── Approval cards ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center card">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-3" />
          <p className="text-sm font-semibold text-ink">Nothing here</p>
          <p className="text-xs text-ink-tertiary mt-1">
            {statusFilter !== "ALL" ? "No items match these filters." : "No approvals in the queue."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((approval) => (
            <ApprovalCard
              key={approval.id}
              approval={approval}
              onApprove={approve}
              onRevision={requestRevision}
              onReject={reject}
            />
          ))}
        </div>
      )}
    </div>
  );
}

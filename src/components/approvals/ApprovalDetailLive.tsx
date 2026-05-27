"use client";

import Image from "next/image";
import { FileText, Film, ImageIcon, Calendar, AlertTriangle } from "lucide-react";
import { cn, formatRelativeTime, formatDate } from "@/lib/utils";
import { PRIORITY_CONFIG } from "@/lib/constants";
import { STAGE_LABELS, isOverdue } from "@/lib/mock-approvals";
import { StageTimeline } from "@/components/approvals/StageTimeline";
import { ApprovalDetailActions } from "@/components/approvals/ApprovalDetailActions";
import { Avatar } from "@/components/ui/Avatar";
import { useApprovalsStore } from "@/store/approvals-store";

const TYPE_ICON = {
  task:    <FileText className="w-4 h-4" />,
  content: <Film className="w-4 h-4" />,
  asset:   <ImageIcon className="w-4 h-4" />,
};

const ACTION_LABELS: Record<string, string> = {
  SUBMITTED:          "Submitted for review",
  APPROVED:           "Approved",
  REVISION_REQUESTED: "Requested revision",
  REJECTED:           "Rejected",
  RESUBMITTED:        "Resubmitted",
  ADVANCED:           "Advanced to next stage",
};

const ACTION_COLORS: Record<string, string> = {
  SUBMITTED:          "bg-sky-500",
  APPROVED:           "bg-emerald-500",
  REVISION_REQUESTED: "bg-amber-400",
  REJECTED:           "bg-rose-500",
  RESUBMITTED:        "bg-sky-500",
  ADVANCED:           "bg-gold",
};

interface ApprovalDetailLiveProps {
  id: string;
}

export function ApprovalDetailLive({ id }: ApprovalDetailLiveProps) {
  const approval = useApprovalsStore((s) => s.approvals.find((a) => a.id === id));

  if (!approval) {
    return (
      <p className="p-6 text-sm text-ink-tertiary">Approval not found.</p>
    );
  }

  const overdue = isOverdue(approval.dueDate);
  const isDone = approval.status === "APPROVED" || approval.status === "REJECTED";
  const priorityCfg = PRIORITY_CONFIG[approval.priority];

  return (
    <div className="p-6 space-y-6 animate-in">

      {/* ── Hero ── */}
      <div className="card overflow-hidden">
        {approval.thumbnail && (
          <div className="relative h-48 w-full">
            <Image src={approval.thumbnail} alt={approval.title} fill className="object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.3) 50%, transparent 100%)" }}
            />
          </div>
        )}
        <div className={cn("p-6", approval.thumbnail && "-mt-12 relative")}>
          <div className="flex items-center gap-1.5 text-ink-secondary text-xs mb-2">
            {TYPE_ICON[approval.type]}
            <span className="capitalize">{approval.type}</span>
            <span className="text-ink-tertiary">·</span>
            <span>{approval.campaign}</span>
          </div>
          <h1 className="text-xl font-black text-ink tracking-tight">{approval.title}</h1>
          <p className="text-sm text-ink-secondary mt-1.5 leading-relaxed">{approval.description}</p>

          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <span className={cn("text-xs font-semibold", priorityCfg.color)}>
              {priorityCfg.icon} {priorityCfg.label} priority
            </span>
            <div className={cn("flex items-center gap-1 text-xs", overdue && !isDone ? "text-rose-500 font-semibold" : "text-ink-tertiary")}>
              {overdue && !isDone && <AlertTriangle className="w-3.5 h-3.5" />}
              <Calendar className="w-3.5 h-3.5" />
              {overdue && !isDone ? "Overdue · was due " : "Due "}
              {formatDate(approval.dueDate, "MMMM d, yyyy")}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-ink-tertiary">
              <Avatar user={approval.submitter} size="xs" />
              Submitted by {approval.submitter.name} · {formatRelativeTime(approval.submittedAt)}
            </div>
            {approval.nextApprover && !isDone && (
              <div className="flex items-center gap-1.5 text-xs text-ink-tertiary">
                <Avatar user={approval.nextApprover} size="xs" />
                Next approver: {approval.nextApprover.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Stage timeline ── */}
      <div className="card p-5">
        <p className="text-xs font-bold text-ink-secondary uppercase tracking-widest mb-4">Approval Flow</p>
        <StageTimeline currentStage={approval.stage} status={approval.status} />
      </div>

      {/* ── Two-column: history + actions ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* History log */}
        <div className="xl:col-span-2 card p-5">
          <p className="text-xs font-bold text-ink-secondary uppercase tracking-widest mb-5">Activity Log</p>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-5">
              {approval.history.map((entry) => (
                <div key={entry.id} className="flex gap-4 relative">
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ring-2 ring-canvas-50", ACTION_COLORS[entry.action])}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Avatar user={entry.actor} size="xs" />
                      <span className="text-xs font-semibold text-ink">{entry.actor.name}</span>
                      <span className="text-xs text-ink-secondary">{ACTION_LABELS[entry.action]}</span>
                      <span className="text-xs text-ink-tertiary bg-canvas-200 px-1.5 py-0.5 rounded-full">
                        {STAGE_LABELS[entry.stage]}
                      </span>
                    </div>
                    <p className="text-2xs text-ink-tertiary mt-0.5">{formatRelativeTime(entry.timestamp)}</p>
                    {entry.note && (
                      <div className={cn(
                        "mt-2 p-3 rounded-xl text-xs leading-relaxed border",
                        entry.action === "REVISION_REQUESTED" ? "bg-amber-50/8 border-amber-400/15 text-ink-secondary" :
                        entry.action === "REJECTED" ? "bg-rose-50/8 border-rose-500/15 text-ink-secondary" :
                        "bg-canvas-100 border-border text-ink-secondary"
                      )}>
                        {entry.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <p className="text-xs font-bold text-ink-secondary uppercase tracking-widest mb-4">Actions</p>
            <ApprovalDetailActions approval={approval} />
          </div>

          <div className="card p-5 space-y-3">
            <p className="text-xs font-bold text-ink-secondary uppercase tracking-widest">Details</p>
            <div className="space-y-2.5">
              <div>
                <p className="text-2xs text-ink-tertiary">Campaign</p>
                <p className="text-xs text-ink font-medium mt-0.5">{approval.campaign}</p>
              </div>
              <div>
                <p className="text-2xs text-ink-tertiary">Current Stage</p>
                <p className="text-xs text-ink font-medium mt-0.5">{STAGE_LABELS[approval.stage]}</p>
              </div>
              <div>
                <p className="text-2xs text-ink-tertiary">Submitted</p>
                <p className="text-xs text-ink font-medium mt-0.5">{formatDate(approval.submittedAt, "MMM d, yyyy · h:mm a")}</p>
              </div>
              <div>
                <p className="text-2xs text-ink-tertiary">History entries</p>
                <p className="text-xs text-ink font-medium mt-0.5">{approval.history.length} events</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

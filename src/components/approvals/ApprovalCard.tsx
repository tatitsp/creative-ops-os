"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  Film,
  ImageIcon,
  Calendar,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import { PRIORITY_CONFIG, ROLE_LABELS } from "@/lib/constants";
import { STAGE_LABELS, isOverdue } from "@/lib/mock-approvals";
import { Avatar } from "@/components/ui/Avatar";
import type { RichApproval } from "@/types";

// ─── Stage badge config ───────────────────────────────────────────────────────

const STAGE_COLORS: Record<string, string> = {
  DRAFT:               "bg-canvas-200 text-ink-secondary",
  INTERNAL_REVIEW:     "bg-sky-100 text-sky-500",
  ARTIST_REVIEW:       "bg-gold-100 text-gold",
  MANAGEMENT_APPROVAL: "bg-amber-100 text-amber-400",
  SCHEDULED:           "bg-emerald-100 text-emerald-500",
  POSTED:              "bg-emerald-100 text-emerald-600",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:            "bg-canvas-200 text-ink-secondary",
  REVISION_REQUESTED: "bg-amber-100 text-amber-400",
  APPROVED:           "bg-emerald-100 text-emerald-500",
  REJECTED:           "bg-rose-100 text-rose-500",
};

const TYPE_ICON = {
  task:    <FileText className="w-3.5 h-3.5" />,
  content: <Film className="w-3.5 h-3.5" />,
  asset:   <ImageIcon className="w-3.5 h-3.5" />,
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ApprovalCardProps {
  approval: RichApproval;
  onApprove: (id: string) => void;
  onRevision: (id: string, note: string) => void;
  onReject: (id: string, reason: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ApprovalCard({ approval, onApprove, onRevision, onReject }: ApprovalCardProps) {
  const [actionMode, setActionMode] = useState<"idle" | "revision" | "reject">("idle");
  const [note, setNote] = useState("");
  const overdue = isOverdue(approval.dueDate);
  const isDone = approval.status === "APPROVED" || approval.status === "REJECTED";
  const priorityCfg = PRIORITY_CONFIG[approval.priority];

  function handleRevisionSubmit() {
    if (!note.trim()) return;
    onRevision(approval.id, note.trim());
    setNote("");
    setActionMode("idle");
  }

  function handleRejectSubmit() {
    if (!note.trim()) return;
    onReject(approval.id, note.trim());
    setNote("");
    setActionMode("idle");
  }

  return (
    <div
      className={cn(
        "card p-4 flex gap-4 transition-colors",
        approval.status === "REVISION_REQUESTED" && "border-amber-400/20 bg-amber-50/5",
        approval.status === "APPROVED" && "border-emerald-500/15 opacity-70",
        approval.status === "REJECTED" && "border-rose-500/15 opacity-60",
      )}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-canvas-200 flex items-center justify-center">
          {approval.thumbnail ? (
            <Image
              src={approval.thumbnail}
              alt={approval.title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-ink-tertiary">{TYPE_ICON[approval.type]}</div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top row: title + priority + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/approvals/${approval.id}`}
              className="text-sm font-bold text-ink hover:text-gold transition-colors line-clamp-1 group"
            >
              {approval.title}
              <ChevronRight className="inline w-3.5 h-3.5 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-xs text-ink-secondary mt-0.5 line-clamp-2 leading-relaxed">
              {approval.description}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={cn("text-2xs font-semibold", priorityCfg.color)}>
              {priorityCfg.icon} {priorityCfg.label}
            </span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {/* Campaign */}
          <span className="text-2xs font-medium text-ink-secondary bg-canvas-200 px-2 py-0.5 rounded-full">
            {approval.campaign}
          </span>
          {/* Stage */}
          <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full", STAGE_COLORS[approval.stage])}>
            {STAGE_LABELS[approval.stage]}
          </span>
          {/* Status (only show if not default PENDING) */}
          {approval.status !== "PENDING" && (
            <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full", STATUS_COLORS[approval.status])}>
              {approval.status === "REVISION_REQUESTED" ? "Revision Needed" : approval.status.charAt(0) + approval.status.slice(1).toLowerCase()}
            </span>
          )}
          {/* Type */}
          <span className="text-2xs text-ink-tertiary flex items-center gap-1">
            {TYPE_ICON[approval.type]}
            {approval.type}
          </span>
        </div>

        {/* Submitter + next approver + due date */}
        <div className="flex items-center gap-4 mt-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Avatar user={approval.submitter} size="xs" />
            <span className="text-2xs text-ink-tertiary">
              {approval.submitter.name} · {formatRelativeTime(approval.submittedAt)}
            </span>
          </div>
          {approval.nextApprover && !isDone && (
            <div className="flex items-center gap-1.5">
              <span className="text-2xs text-ink-tertiary">Next:</span>
              <Avatar user={approval.nextApprover} size="xs" />
              <span className="text-2xs text-ink-tertiary">{approval.nextApprover.name}</span>
            </div>
          )}
          <div className={cn("flex items-center gap-1 text-2xs", overdue && !isDone ? "text-rose-500 font-semibold" : "text-ink-tertiary")}>
            {overdue && !isDone && <AlertTriangle className="w-3 h-3" />}
            <Calendar className="w-3 h-3" />
            {overdue && !isDone ? "Overdue · " : "Due "}
            {formatDate(approval.dueDate, "MMM d")}
          </div>
        </div>

        {/* Most recent revision note */}
        {approval.status === "REVISION_REQUESTED" && (() => {
          const lastRevision = [...approval.history].reverse().find(h => h.action === "REVISION_REQUESTED");
          return lastRevision?.note ? (
            <div className="mt-2.5 p-2.5 rounded-lg bg-amber-400/8 border border-amber-400/15">
              <p className="text-2xs text-amber-400 font-semibold mb-0.5">Revision requested by {lastRevision.actor.name}</p>
              <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2">{lastRevision.note}</p>
            </div>
          ) : null;
        })()}

        {/* Action buttons */}
        {!isDone && (
          <div className="mt-3">
            {actionMode === "idle" ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onApprove(approval.id)}
                  className="flex items-center gap-1.5 text-2xs font-semibold text-emerald-500 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve
                </button>
                <button
                  onClick={() => setActionMode("revision")}
                  className="flex items-center gap-1.5 text-2xs font-semibold text-amber-400 bg-amber-100 hover:bg-amber-200 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Request Revision
                </button>
                <button
                  onClick={() => setActionMode("reject")}
                  className="flex items-center gap-1.5 text-2xs font-semibold text-rose-500 bg-rose-100 hover:bg-rose-200 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  autoFocus
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={actionMode === "revision" ? "What needs to change?" : "Reason for rejection…"}
                  rows={2}
                  className="w-full text-xs bg-canvas-100 border border-border focus:border-border-strong rounded-lg px-3 py-2 text-ink placeholder-ink-tertiary resize-none outline-none transition-colors"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={actionMode === "revision" ? handleRevisionSubmit : handleRejectSubmit}
                    disabled={!note.trim()}
                    className={cn(
                      "text-2xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                      actionMode === "revision"
                        ? "bg-amber-400 text-white hover:bg-amber-500"
                        : "bg-rose-500 text-white hover:bg-rose-600",
                    )}
                  >
                    {actionMode === "revision" ? "Send Revision Notes" : "Confirm Rejection"}
                  </button>
                  <button
                    onClick={() => { setActionMode("idle"); setNote(""); }}
                    className="text-2xs text-ink-tertiary hover:text-ink px-2 py-1.5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

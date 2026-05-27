"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, XCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGE_LABELS, getNextStage } from "@/lib/mock-approvals";
import { useApprovalsStore } from "@/store/approvals-store";
import type { RichApproval } from "@/types";

interface ApprovalDetailActionsProps {
  approval: RichApproval;
}

export function ApprovalDetailActions({ approval }: ApprovalDetailActionsProps) {
  const [actionMode, setActionMode] = useState<"idle" | "revision" | "reject">("idle");
  const [note, setNote] = useState("");
  const { approve, requestRevision, reject } = useApprovalsStore();

  const isDone = approval.status === "APPROVED" || approval.status === "REJECTED";
  const nextStage = getNextStage(approval.stage);

  function handleApprove() {
    approve(approval.id);
  }

  function handleRevisionSubmit() {
    if (!note.trim()) return;
    requestRevision(approval.id, note.trim());
    setNote("");
    setActionMode("idle");
  }

  function handleRejectSubmit() {
    if (!note.trim()) return;
    reject(approval.id, note.trim());
    setNote("");
    setActionMode("idle");
  }

  if (isDone) {
    return (
      <div className={cn(
        "p-4 rounded-xl border text-sm",
        approval.status === "APPROVED"
          ? "bg-emerald-100 border-emerald-500/20 text-emerald-600"
          : "bg-rose-100 border-rose-500/20 text-rose-500",
      )}>
        <p className="font-semibold">
          {approval.status === "APPROVED" ? "✓ Approved" : "✗ Rejected"}
        </p>
        <p className="text-xs mt-1 opacity-70">
          {approval.status === "APPROVED"
            ? `Advanced to ${STAGE_LABELS[approval.stage]}`
            : "This item has been rejected."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {actionMode === "idle" ? (
        <>
          {/* Approve */}
          <button
            onClick={handleApprove}
            className="w-full flex items-center justify-between gap-2 text-sm font-semibold text-emerald-500 bg-emerald-100 hover:bg-emerald-200 px-4 py-3 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Approve
            </div>
            {nextStage && (
              <span className="text-xs font-normal opacity-70 flex items-center gap-1">
                → {STAGE_LABELS[nextStage]} <ArrowRight className="w-3 h-3" />
              </span>
            )}
          </button>

          {/* Request Revision */}
          <button
            onClick={() => setActionMode("revision")}
            className="w-full flex items-center gap-2 text-sm font-semibold text-amber-400 bg-amber-100 hover:bg-amber-200 px-4 py-3 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Request Revision
          </button>

          {/* Reject */}
          <button
            onClick={() => setActionMode("reject")}
            className="w-full flex items-center gap-2 text-sm font-semibold text-rose-500 bg-rose-100 hover:bg-rose-200 px-4 py-3 rounded-xl transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </>
      ) : (
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-ink">
            {actionMode === "revision" ? "What needs to change?" : "Reason for rejection"}
          </p>
          <textarea
            autoFocus
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              actionMode === "revision"
                ? "Be specific so the team knows exactly what to fix..."
                : "Explain why this is being rejected..."
            }
            rows={4}
            className="w-full text-xs bg-canvas-100 border border-border focus:border-border-strong rounded-xl px-3 py-2.5 text-ink placeholder-ink-tertiary resize-none outline-none transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={actionMode === "revision" ? handleRevisionSubmit : handleRejectSubmit}
              disabled={!note.trim()}
              className={cn(
                "flex-1 text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                actionMode === "revision"
                  ? "bg-amber-400 text-white hover:bg-amber-500"
                  : "bg-rose-500 text-white hover:bg-rose-600",
              )}
            >
              {actionMode === "revision" ? "Send Notes" : "Confirm Rejection"}
            </button>
            <button
              onClick={() => { setActionMode("idle"); setNote(""); }}
              className="px-4 text-sm text-ink-tertiary hover:text-ink bg-canvas-100 hover:bg-canvas-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

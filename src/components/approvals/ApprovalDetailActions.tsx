"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, XCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGE_LABELS, getNextStage } from "@/lib/mock-approvals";
import type { RichApproval } from "@/types";

interface ApprovalDetailActionsProps {
  approval: RichApproval;
}

export function ApprovalDetailActions({ approval }: ApprovalDetailActionsProps) {
  const [actionMode, setActionMode] = useState<"idle" | "revision" | "reject">("idle");
  const [note, setNote] = useState("");
  const [actioned, setActioned] = useState(false);
  const [result, setResult] = useState<{ type: "approved" | "revision" | "rejected"; note?: string } | null>(null);

  const isDone = approval.status === "APPROVED" || approval.status === "REJECTED" || actioned;
  const nextStage = getNextStage(approval.stage);

  function handleApprove() {
    setResult({ type: "approved" });
    setActioned(true);
  }

  function handleRevisionSubmit() {
    if (!note.trim()) return;
    setResult({ type: "revision", note: note.trim() });
    setActioned(true);
  }

  function handleRejectSubmit() {
    if (!note.trim()) return;
    setResult({ type: "rejected", note: note.trim() });
    setActioned(true);
  }

  if (result) {
    return (
      <div className={cn(
        "p-4 rounded-xl border text-sm",
        result.type === "approved" ? "bg-emerald-100 border-emerald-500/20 text-emerald-500" :
        result.type === "revision" ? "bg-amber-100 border-amber-400/20 text-amber-400" :
        "bg-rose-100 border-rose-500/20 text-rose-500",
      )}>
        <p className="font-semibold">
          {result.type === "approved" && "✓ Approved"}
          {result.type === "revision" && "↩ Revision requested"}
          {result.type === "rejected" && "✗ Rejected"}
        </p>
        {result.note && <p className="text-xs mt-1 opacity-75">{result.note}</p>}
        <p className="text-xs mt-2 opacity-60">Action logged · refresh to see updated history</p>
      </div>
    );
  }

  if (isDone) {
    return (
      <p className="text-sm text-ink-tertiary">
        This item has already been {approval.status.toLowerCase().replace("_", " ")}. No further action needed.
      </p>
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
            placeholder={actionMode === "revision" ? "Be specific so the team knows exactly what to fix..." : "Explain why this is being rejected..."}
            rows={4}
            className="w-full text-xs bg-canvas-100 border border-border focus:border-border-strong rounded-xl px-3 py-2.5 text-ink placeholder-ink-tertiary resize-none outline-none transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={actionMode === "revision" ? handleRevisionSubmit : handleRejectSubmit}
              disabled={!note.trim()}
              className={cn(
                "flex-1 text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                actionMode === "revision" ? "bg-amber-400 text-white hover:bg-amber-500" : "bg-rose-500 text-white hover:bg-rose-600",
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

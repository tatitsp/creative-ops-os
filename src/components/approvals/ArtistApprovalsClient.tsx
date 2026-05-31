"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { CheckSquare, Clock, RotateCcw, Check, X } from "lucide-react";
import type { CAAM1K_APPROVALS } from "@/lib/mock-artist2";

type ApprovalStatus = "PENDING" | "APPROVED" | "REVISION_REQUESTED";
type Approval = Omit<typeof CAAM1K_APPROVALS[0], "status"> & { status: ApprovalStatus };

const STATUS_CONFIG: Record<ApprovalStatus, { label: string; icon: React.ElementType; style: string }> = {
  PENDING: { label: "Pending", icon: Clock, style: "bg-amber-50 text-amber-600" },
  APPROVED: { label: "Approved", icon: CheckSquare, style: "bg-emerald-50 text-emerald-600" },
  REVISION_REQUESTED: { label: "Revision Requested", icon: RotateCcw, style: "bg-rose-50 text-rose-500" },
};

const PRIORITY_STYLES: Record<string, string> = {
  URGENT: "bg-rose-50 text-rose-500",
  HIGH: "bg-amber-50 text-amber-600",
  MEDIUM: "bg-canvas-100 text-ink-tertiary",
};

interface Props {
  initialApprovals: Approval[];
  artistName: string;
}

export function ArtistApprovalsClient({ initialApprovals, artistName }: Props) {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [toast, setToast] = useState<string | null>(null);
  const [reviseTarget, setReviseTarget] = useState<string | null>(null);
  const [reviseNote, setReviseNote] = useState("");

  const pendingCount = approvals.filter((a) => a.status === "PENDING").length;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleApprove(id: string) {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "APPROVED" as ApprovalStatus } : a)),
    );
    showToast("Approved");
  }

  function handleRequestRevision(id: string) {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "REVISION_REQUESTED" as ApprovalStatus } : a)),
    );
    setReviseTarget(null);
    setReviseNote("");
    showToast("Revision requested");
  }

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Revision modal */}
      {reviseTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-canvas-50 border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 animate-in">
            <div className="flex items-center justify-between">
              <h2 className="text-heading">Request Revision</h2>
              <button onClick={() => { setReviseTarget(null); setReviseNote(""); }} className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                <X className="w-4 h-4 text-ink-tertiary" />
              </button>
            </div>
            <div>
              <label className="text-label block mb-1.5">Notes for the team</label>
              <textarea
                className="input-base resize-none"
                rows={4}
                placeholder="Describe what needs to change..."
                value={reviseNote}
                onChange={(e) => setReviseNote(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => { setReviseTarget(null); setReviseNote(""); }}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => handleRequestRevision(reviseTarget)}
              >
                Send feedback
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 pt-8 pb-6 border-b border-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gold-100 flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-gold" />
          </div>
          <h1 className="text-2xl font-black text-ink tracking-tight">Approvals</h1>
          {pendingCount > 0 && (
            <span className="w-6 h-6 bg-gold text-white text-2xs font-bold rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </div>
        <p className="text-sm text-ink-secondary ml-11">
          {artistName} · Review content, assets, and deliverables.
        </p>
      </div>

      <div className="p-6 animate-in max-w-3xl space-y-3">
        {approvals.map((item) => {
          const status = item.status as ApprovalStatus;
          const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
          const StatusIcon = cfg.icon;
          return (
            <div key={item.id} className="card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-canvas-100 flex items-center justify-center flex-shrink-0">
                <StatusIcon className="w-5 h-5 text-ink-tertiary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="text-xs text-ink-tertiary mt-0.5">
                  Requested by {item.requestedBy} ·{" "}
                  {new Date(item.requestedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full", cfg.style)}>
                    {cfg.label}
                  </span>
                  <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full", PRIORITY_STYLES[item.priority])}>
                    {item.priority}
                  </span>
                  <span className="text-2xs text-ink-tertiary capitalize">{item.type}</span>
                </div>
              </div>
              {status === "PENDING" && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="sm" variant="secondary" onClick={() => setReviseTarget(item.id)}>
                    Revise
                  </Button>
                  <Button size="sm" variant="primary" onClick={() => handleApprove(item.id)}>
                    Approve
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {approvals.length === 0 && (
          <div className="text-center py-16">
            <CheckSquare className="w-8 h-8 mx-auto text-ink-tertiary mb-3 opacity-30" />
            <p className="text-sm text-ink-tertiary">No items pending approval.</p>
          </div>
        )}
      </div>
    </>
  );
}

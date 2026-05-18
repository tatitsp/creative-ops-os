"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/lib/utils";
import { PRIORITY_CONFIG } from "@/lib/constants";
import type { Approval } from "@/types";
import { CheckCircle2, XCircle, RotateCcw, FileText, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApprovalQueueProps {
  approvals: Approval[];
}

const TYPE_ICON = {
  task: <FileText className="w-3.5 h-3.5" />,
  content: <Film className="w-3.5 h-3.5" />,
};

export function ApprovalQueue({ approvals }: ApprovalQueueProps) {
  if (approvals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
        <p className="text-sm font-medium text-ink">All clear</p>
        <p className="text-xs text-ink-tertiary mt-0.5">No pending approvals</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {approvals.map((approval) => {
        const priorityCfg = PRIORITY_CONFIG[approval.priority];
        const isRevision = approval.status === "REVISION_REQUESTED";

        return (
          <div
            key={approval.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl border transition-colors",
              isRevision
                ? "bg-amber-50 border-amber-100"
                : "bg-white border-border hover:border-violet-200",
            )}
          >
            {/* Type icon */}
            <div className="w-7 h-7 rounded-lg bg-canvas-100 flex items-center justify-center text-ink-secondary flex-shrink-0 mt-0.5">
              {TYPE_ICON[approval.type]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-ink line-clamp-1">{approval.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Avatar user={approval.requester} size="xs" />
                    <span className="text-2xs text-ink-tertiary">{approval.requester.name}</span>
                    <span className={cn("text-2xs font-medium", priorityCfg.color)}>
                      {priorityCfg.icon} {priorityCfg.label}
                    </span>
                  </div>
                  <p className="text-2xs text-ink-tertiary mt-0.5">
                    {formatRelativeTime(approval.requestedAt)}
                  </p>
                </div>

                {isRevision ? (
                  <Badge variant="amber" size="sm">
                    Revision
                  </Badge>
                ) : null}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 mt-2.5">
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<CheckCircle2 className="w-3 h-3" />}
                  className="text-2xs py-1 px-2.5"
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<RotateCcw className="w-3 h-3" />}
                  className="text-2xs py-1 px-2.5"
                >
                  Revise
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<XCircle className="w-3 h-3 text-rose-400" />}
                  className="text-2xs py-1 px-2.5 text-rose-500 hover:bg-rose-50"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

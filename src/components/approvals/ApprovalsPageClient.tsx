"use client";

import { useEffect } from "react";
import { ApprovalsQueue } from "./ApprovalsQueue";
import { useApprovalsStore, type ApiApproval } from "@/store/approvals-store";

type Props = {
  workspaceSlug: string;
  initialApprovals: ApiApproval[];
};

export function ApprovalsPageClient({ workspaceSlug, initialApprovals }: Props) {
  const { init } = useApprovalsStore();

  useEffect(() => {
    init(workspaceSlug, initialApprovals);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceSlug]);

  return <ApprovalsQueue />;
}

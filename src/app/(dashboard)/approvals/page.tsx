import type { Metadata } from "next";
import { TopBar } from "@/components/navigation/TopBar";
import { ApprovalsPageClient } from "@/components/approvals/ApprovalsPageClient";
import { getDashboardWorkspace } from "@/lib/workspace-context";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Approvals" };
export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const workspace = await getDashboardWorkspace();

  let approvals: any[] = [];
  if (workspace) {
    approvals = await prisma.approval.findMany({
      where: {
        OR: [
          { content: { workspaceId: workspace.id } },
          { task: { project: { workspaceId: workspace.id } } },
        ],
      },
      orderBy: { requestedAt: "desc" },
      select: {
        id: true,
        status: true,
        stage: true,
        history: true,
        notes: true,
        feedback: true,
        requestedAt: true,
        reviewedAt: true,
        requester: { select: { id: true, name: true, image: true, role: true, status: true } },
        reviewer: { select: { id: true, name: true, image: true, role: true, status: true } },
        content: {
          select: {
            id: true, title: true, type: true, phase: true,
            campaign: { select: { id: true, name: true } },
          },
        },
        task: { select: { id: true, title: true, priority: true } },
      },
    });
  }

  const pending = approvals.filter((a) => a.status === "PENDING").length;

  return (
    <div className="min-h-screen">
      <TopBar
        title="Approvals"
        subtitle={pending > 0 ? `${pending} pending review` : "All caught up"}
      />
      <div className="p-6 animate-in">
        <ApprovalsPageClient
          workspaceSlug={workspace?.slug ?? ""}
          initialApprovals={approvals}
        />
      </div>
    </div>
  );
}

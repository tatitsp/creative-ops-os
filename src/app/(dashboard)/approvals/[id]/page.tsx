import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MOCK_RICH_APPROVALS } from "@/lib/mock-approvals";
import { ApprovalDetailLive } from "@/components/approvals/ApprovalDetailLive";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const approval = MOCK_RICH_APPROVALS.find((a) => a.id === id);
  return { title: approval ? `${approval.title} — Approvals` : "Approval" };
}

export default async function ApprovalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-2 border-b border-border">
        <Link href="/approvals" className="flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Approvals
        </Link>
        <span className="text-ink-tertiary">/</span>
        <span className="text-sm text-ink font-medium">Detail</span>
      </div>

      {/* Live content — reads from Zustand store */}
      <ApprovalDetailLive id={id} />
    </div>
  );
}

import type { Metadata } from "next";
import { CheckSquare } from "lucide-react";
import { ApprovalsQueue } from "@/components/approvals/ApprovalsQueue";
import { PENDING_APPROVALS_COUNT } from "@/lib/mock-approvals";

export const metadata: Metadata = { title: "Approvals" };

export default function ApprovalsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 border-b border-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gold-100 flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-gold" />
          </div>
          <h1 className="text-2xl font-black text-ink tracking-tight">Approvals</h1>
          {PENDING_APPROVALS_COUNT > 0 && (
            <span className="w-6 h-6 bg-gold text-white text-2xs font-bold rounded-full flex items-center justify-center">
              {PENDING_APPROVALS_COUNT}
            </span>
          )}
        </div>
        <p className="text-sm text-ink-secondary ml-11">
          Review and action content, assets, and deliverables before they go live.
        </p>
      </div>

      {/* Queue */}
      <div className="p-6 animate-in">
        <ApprovalsQueue />
      </div>
    </div>
  );
}

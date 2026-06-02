import type { Metadata } from "next";
import { TopBar } from "@/components/navigation/TopBar";
import { ApprovalsQueue } from "@/components/approvals/ApprovalsQueue";
import { PENDING_APPROVALS_COUNT } from "@/lib/mock-approvals";

export const metadata: Metadata = { title: "Approvals" };

export default function ApprovalsPage() {
  return (
    <div className="min-h-screen">
      <TopBar
        title="Approvals"
        subtitle={`${PENDING_APPROVALS_COUNT} pending review`}
      />

      {/* Queue */}
      <div className="p-6 animate-in">
        <ApprovalsQueue />
      </div>
    </div>
  );
}

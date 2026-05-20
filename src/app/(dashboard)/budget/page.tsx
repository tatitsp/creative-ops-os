import type { Metadata } from "next";
import { CURRENT_USER } from "@/lib/mock-data";
import { BudgetOverview } from "@/components/budget/BudgetOverview";
import { TopBar } from "@/components/navigation/TopBar";

export const metadata: Metadata = { title: "Budget" };

const ALLOWED_ROLES = ["ARTIST_CEO", "CREATIVE_OPS_DIRECTOR"];

export default function BudgetPage() {
  if (!ALLOWED_ROLES.includes(CURRENT_USER.role)) {
    return (
      <>
        <TopBar title="Budget" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-sm text-ink-tertiary">You don't have access to budget information.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar
        title="Budget"
        subtitle="Private financial overview — Artist/CEO and Creative Director only"
      />
      <BudgetOverview />
    </>
  );
}

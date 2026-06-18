import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { roleHasPermission } from "@/lib/permissions";
import { BudgetPageClient } from "@/components/budget/BudgetPageClient";
import type { ApiBudgetItem, BudgetSummary } from "@/store/budget-store";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Budget` : "Budget" };
}

export const dynamic = "force-dynamic";

export default async function ArtistBudgetPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  // Check permission server-side
  const session = await auth();
  const sessionRole = session?.user?.role ?? "";
  const sessionIsAdmin = session?.user?.isAdmin ?? false;
  const canViewBudget =
    sessionIsAdmin || roleHasPermission(sessionRole, "view_budget");

  if (!canViewBudget) {
    return (
      <>
        <TopBar title="Budget" subtitle={ws.artistName} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-sm text-ink-tertiary">
            You don&apos;t have access to budget information.
          </p>
        </div>
      </>
    );
  }

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: {
      budgetItems: {
        orderBy: { date: "desc" },
        select: {
          id: true,
          category: true,
          description: true,
          amount: true,
          type: true,
          date: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  const rawItems = workspace?.budgetItems ?? [];

  const items: ApiBudgetItem[] = rawItems.map((item) => ({
    ...item,
    date: item.date.toISOString(),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  const totalIncome = items
    .filter((i) => i.type === "INCOME")
    .reduce((s, i) => s + i.amount, 0);
  const totalExpenses = items
    .filter((i) => i.type === "EXPENSE")
    .reduce((s, i) => s + i.amount, 0);
  const summary: BudgetSummary = {
    totalIncome,
    totalExpenses,
    net: totalIncome - totalExpenses,
  };

  return (
    <>
      <TopBar
        title="Budget"
        subtitle={`${ws.artistName} · Financial overview`}
      />
      <BudgetPageClient
        workspaceSlug={slug}
        initialItems={items}
        initialSummary={summary}
      />
    </>
  );
}

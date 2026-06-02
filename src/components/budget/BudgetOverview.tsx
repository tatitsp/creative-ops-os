"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DollarSign, TrendingUp, ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_BUDGETS,
  CATEGORY_LABELS,
  getBudgetTotals,
  formatMoney,
  type BudgetCategory,
} from "@/lib/mock-budget";

// ─── Component ────────────────────────────────────────────────────────────────

export function BudgetOverview() {
  const budgets = Object.values(MOCK_BUDGETS);

  // ── Global totals ─────────────────────────────────────────────────────────
  const globalTotal   = budgets.reduce((s, b) => s + b.totalBudget, 0);
  const globalSpent   = budgets.reduce((s, b) => s + getBudgetTotals(b).totalSpent, 0);
  const globalRemain  = globalTotal - globalSpent;
  const globalBurnPct = Math.round((globalSpent / globalTotal) * 100);

  // ── Combined transactions with campaign label ─────────────────────────────
  const allTransactions = budgets.flatMap((b) =>
    b.transactions.map((t) => ({ ...t, campaignName: b.name, campaignId: b.id })),
  );

  // ── Filters ───────────────────────────────────────────────────────────────
  const [filterCampaign, setFilterCampaign]   = useState("ALL");
  const [filterCategory, setFilterCategory]   = useState("ALL");
  const [filterDateFrom, setFilterDateFrom]   = useState("");
  const [filterDateTo,   setFilterDateTo]     = useState("");

  const filtered = useMemo(() => {
    return allTransactions
      .filter((t) => filterCampaign === "ALL" || t.campaignId === filterCampaign)
      .filter((t) => filterCategory === "ALL" || t.category === filterCategory)
      .filter((t) => !filterDateFrom || t.date >= filterDateFrom)
      .filter((t) => !filterDateTo   || t.date <= filterDateTo)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allTransactions, filterCampaign, filterCategory, filterDateFrom, filterDateTo]);

  const filteredTotal = filtered.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-4 md:p-6 max-w-5xl space-y-10">

      {/* ── Global summary ─────────────────────────────────────────────── */}
      <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
          <GlobalStat label="Total Budget"   value={formatMoney(globalTotal)}  sub="all active campaigns" />
          <GlobalStat
            label="Total Spent"
            value={formatMoney(globalSpent)}
            sub={`${globalBurnPct}% burn rate`}
            valueColor={globalBurnPct >= 90 ? "text-rose-500" : globalBurnPct >= 70 ? "text-amber-400" : "text-ink"}
          />
          <GlobalStat
            label="Remaining"
            value={formatMoney(globalRemain)}
            sub={`${100 - globalBurnPct}% of budget left`}
            valueColor={globalRemain < 0 ? "text-rose-500" : "text-emerald-500"}
          />
          <GlobalStat
            label="Campaigns"
            value={budgets.length.toString()}
            sub={`${allTransactions.length} total transactions`}
          />
        </div>

        {/* Combined burn bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-ink-tertiary mb-1.5">
            <span>Overall burn</span>
            <span>{globalBurnPct}%</span>
          </div>
          <div className="h-2 bg-canvas-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                globalBurnPct >= 90 ? "bg-rose-500" : globalBurnPct >= 70 ? "bg-amber-400" : "bg-emerald-500",
              )}
              style={{ width: `${Math.min(globalBurnPct, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Campaign budget cards ───────────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold text-ink-tertiary uppercase tracking-widest mb-4">
          By Campaign
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((budget) => {
            const { totalSpent, totalRemaining, burnPct } = getBudgetTotals(budget);
            const isHot = burnPct >= 85;
            return (
              <div
                key={budget.id}
                className={cn(
                  "rounded-2xl border p-5 transition-all",
                  isHot ? "border-amber-400/30 bg-amber-900/10" : "border-border bg-canvas-100",
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-ink">{budget.name}</p>
                    <p className="text-2xs text-ink-tertiary mt-0.5">
                      {budget.transactions.length} transactions logged
                    </p>
                  </div>
                  {budget.releaseHref ? (
                    <Link
                      href={budget.releaseHref}
                      className="flex items-center gap-1 text-2xs font-semibold text-gold hover:text-gold/80 transition-colors"
                    >
                      Open Room <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <Link
                      href="/projects"
                      className="flex items-center gap-1 text-2xs font-semibold text-ink-tertiary hover:text-ink transition-colors"
                    >
                      View Project <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <p className="text-2xs text-ink-tertiary">Budget</p>
                    <p className="text-sm font-bold text-ink tabular-nums">{formatMoney(budget.totalBudget)}</p>
                  </div>
                  <div>
                    <p className="text-2xs text-ink-tertiary">Spent</p>
                    <p className={cn("text-sm font-bold tabular-nums", isHot ? "text-amber-400" : "text-ink")}>
                      {formatMoney(totalSpent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xs text-ink-tertiary">Remaining</p>
                    <p className={cn("text-sm font-bold tabular-nums", totalRemaining < 5000 ? "text-rose-500" : "text-emerald-500")}>
                      {formatMoney(totalRemaining)}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-2xs text-ink-tertiary mb-1">
                    <span>Burn rate</span>
                    <span className={cn(burnPct >= 85 ? "text-amber-400 font-semibold" : "")}>{burnPct}%</span>
                  </div>
                  <div className="h-1.5 bg-canvas-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        burnPct >= 90 ? "bg-rose-500" : burnPct >= 70 ? "bg-amber-400" : "bg-emerald-500",
                      )}
                      style={{ width: `${Math.min(burnPct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Combined transaction log ────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-ink-tertiary uppercase tracking-widest">
            All Transactions
            <span className="ml-2 font-normal normal-case tracking-normal text-ink-tertiary">
              ({filtered.length} shown · {formatMoney(filteredTotal)} total)
            </span>
          </h2>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <FilterSelect
            value={filterCampaign}
            onChange={setFilterCampaign}
            options={[
              { value: "ALL", label: "All Campaigns" },
              ...budgets.map((b) => ({ value: b.id, label: b.name })),
            ]}
          />
          <FilterSelect
            value={filterCategory}
            onChange={setFilterCategory}
            options={[
              { value: "ALL", label: "All Categories" },
              ...Object.entries(CATEGORY_LABELS).map(([v, label]) => ({ value: v, label })),
            ]}
          />
          <div className="flex items-center gap-2 text-xs text-ink-secondary">
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="bg-canvas-100 border border-border rounded-xl px-3 py-1.5 text-xs text-ink outline-none focus:border-border-strong transition-colors"
              placeholder="From"
            />
            <span className="text-ink-tertiary">to</span>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="bg-canvas-100 border border-border rounded-xl px-3 py-1.5 text-xs text-ink outline-none focus:border-border-strong transition-colors"
              placeholder="To"
            />
          </div>
          {(filterCampaign !== "ALL" || filterCategory !== "ALL" || filterDateFrom || filterDateTo) && (
            <button
              onClick={() => { setFilterCampaign("ALL"); setFilterCategory("ALL"); setFilterDateFrom(""); setFilterDateTo(""); }}
              className="text-2xs text-gold hover:text-gold/80 font-semibold transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-canvas-100">
                <th className="text-left text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-right text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Amount</th>
                <th className="text-left text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Campaign</th>
                <th className="text-left text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Category</th>
                <th className="text-left text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Vendor</th>
                <th className="text-left text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Notes</th>
                <th className="text-left text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-ink-tertiary">
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={`${tx.campaignId}-${tx.id}`} className="hover:bg-canvas-100/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-ink-secondary tabular-nums whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-ink tabular-nums whitespace-nowrap">
                      {formatMoney(tx.amount)}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-secondary whitespace-nowrap max-w-[140px] truncate">
                      {tx.campaignName}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-2xs font-semibold text-ink-secondary bg-canvas-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {CATEGORY_LABELS[tx.category as BudgetCategory]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink whitespace-nowrap">{tx.vendor}</td>
                    <td className="px-4 py-3 text-xs text-ink-secondary max-w-[200px] truncate">{tx.notes}</td>
                    <td className="px-4 py-3 text-xs text-ink-tertiary whitespace-nowrap">
                      {tx.enteredBy.split(" ")[0]}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GlobalStat({
  label,
  value,
  sub,
  valueColor = "text-ink",
}: {
  label: string;
  value: string;
  sub: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-canvas-100 p-3 md:p-4">
      <p className="text-2xs font-bold text-ink-tertiary uppercase tracking-wider mb-2">{label}</p>
      <p className={cn("text-sm md:text-xl font-black tabular-nums truncate", valueColor)}>{value}</p>
      <p className="text-2xs text-ink-tertiary mt-0.5">{sub}</p>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-canvas-100 border border-border rounded-xl pl-3 pr-7 py-1.5 text-xs text-ink outline-none focus:border-border-strong transition-colors cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-ink-tertiary pointer-events-none" />
    </div>
  );
}

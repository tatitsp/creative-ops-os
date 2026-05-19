"use client";

import { useState } from "react";
import { Plus, Download, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENT_USER } from "@/lib/mock-data";
import {
  MOCK_BUDGETS,
  BUDGET_CATEGORIES,
  CATEGORY_LABELS,
  getBudgetTotals,
  formatMoney,
  type BudgetCategory,
  type BudgetTransaction,
} from "@/lib/mock-budget";

interface ReleaseBudgetProps {
  releaseId: string;
}

const ALLOWED_ROLES = ["ARTIST_CEO", "CREATIVE_OPS_DIRECTOR"];

// ─── CSV export ───────────────────────────────────────────────────────────────

function exportCSV(transactions: BudgetTransaction[], name: string) {
  const header = "Date,Amount,Category,Vendor,Notes,Entered By";
  const rows = transactions.map((t) =>
    [
      t.date,
      t.amount,
      CATEGORY_LABELS[t.category],
      `"${t.vendor}"`,
      `"${t.notes}"`,
      t.enteredBy,
    ].join(","),
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `budget-${name.toLowerCase().replace(/\s+/g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReleaseBudget({ releaseId }: ReleaseBudgetProps) {
  const budget = MOCK_BUDGETS[releaseId];

  if (!ALLOWED_ROLES.includes(CURRENT_USER.role)) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-ink-tertiary">You don't have access to budget information.</p>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-ink-tertiary">No budget data found for this release.</p>
      </div>
    );
  }

  return <BudgetView releaseId={releaseId} initialBudget={budget} />;
}

function BudgetView({
  releaseId,
  initialBudget,
}: {
  releaseId: string;
  initialBudget: typeof MOCK_BUDGETS[string];
}) {
  const [transactions, setTransactions] = useState(initialBudget.transactions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: "2026-05-19",
    amount: "",
    category: "VIDEO_PRODUCTION" as BudgetCategory,
    vendor: "",
    notes: "",
  });

  // Re-compute totals incorporating any local additions
  const localLineItems = initialBudget.lineItems.map((li) => {
    const extra = transactions
      .filter((t) => t.category === li.category && !initialBudget.transactions.find((ot) => ot.id === t.id))
      .reduce((s, t) => s + t.amount, 0);
    return { ...li, spent: li.spent + extra };
  });

  const totalSpent     = localLineItems.reduce((s, li) => s + li.spent, 0);
  const totalRemaining = initialBudget.totalBudget - totalSpent;
  const burnPct        = Math.round((totalSpent / initialBudget.totalBudget) * 100);

  function handleAddExpense() {
    const amt = parseFloat(form.amount);
    if (!amt || !form.vendor.trim()) return;
    const newTx: BudgetTransaction = {
      id: `new-${Date.now()}`,
      date: form.date,
      amount: amt,
      category: form.category,
      vendor: form.vendor.trim(),
      notes: form.notes.trim(),
      enteredBy: CURRENT_USER.name,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setForm({ date: "2026-05-19", amount: "", category: "VIDEO_PRODUCTION", vendor: "", notes: "" });
    setShowForm(false);
  }

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="space-y-8">

      {/* ── Summary bar ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <BudgetStat
          label="Total Budget"
          value={formatMoney(initialBudget.totalBudget)}
          sub="for this release"
          icon={<DollarSign className="w-4 h-4 text-gold" />}
        />
        <BudgetStat
          label="Spent to Date"
          value={formatMoney(totalSpent)}
          sub={`${burnPct}% of budget`}
          icon={<TrendingUp className="w-4 h-4 text-amber-400" />}
          valueColor={burnPct >= 90 ? "text-rose-500" : burnPct >= 70 ? "text-amber-400" : "text-white"}
        />
        <BudgetStat
          label="Remaining"
          value={formatMoney(totalRemaining)}
          sub={`${100 - burnPct}% left`}
          icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
          valueColor={totalRemaining < 0 ? "text-rose-500" : "text-emerald-400"}
        />
      </div>

      {/* Overall burn bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-ink-tertiary mb-1.5">
          <span>Budget utilization</span>
          <span className={cn(burnPct >= 90 ? "text-rose-500 font-semibold" : "")}>{burnPct}%</span>
        </div>
        <div className="h-2 bg-canvas-200 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              burnPct >= 90 ? "bg-rose-500" : burnPct >= 70 ? "bg-amber-400" : "bg-emerald-500",
            )}
            style={{ width: `${Math.min(burnPct, 100)}%` }}
          />
        </div>
      </div>

      {/* ── Category breakdown ───────────────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-bold text-ink-tertiary uppercase tracking-widest mb-3">
          Category Breakdown
        </h3>
        <div className="border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-canvas-100">
                <th className="text-left text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Category</th>
                <th className="text-right text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Allocated</th>
                <th className="text-right text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Spent</th>
                <th className="text-right text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Remaining</th>
                <th className="px-4 py-3 w-40"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {localLineItems.map((li) => {
                const remaining = li.allocated - li.spent;
                const pct = Math.round((li.spent / li.allocated) * 100);
                const isOver = li.spent > li.allocated;
                const isNear = !isOver && pct >= 85;
                return (
                  <tr key={li.category} className="hover:bg-canvas-100/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-ink">
                      <div className="flex items-center gap-2">
                        {isOver && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />}
                        {CATEGORY_LABELS[li.category]}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-ink-secondary tabular-nums">
                      {formatMoney(li.allocated)}
                    </td>
                    <td className={cn("px-4 py-3 text-right text-sm font-semibold tabular-nums",
                      isOver ? "text-rose-500" : isNear ? "text-amber-400" : "text-ink",
                    )}>
                      {formatMoney(li.spent)}
                    </td>
                    <td className={cn("px-4 py-3 text-right text-sm tabular-nums",
                      isOver ? "text-rose-500 font-semibold" : "text-emerald-500",
                    )}>
                      {isOver ? `-${formatMoney(Math.abs(remaining))}` : formatMoney(remaining)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-canvas-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              isOver ? "bg-rose-500" : isNear ? "bg-amber-400" : "bg-emerald-500",
                            )}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className={cn("text-2xs w-8 text-right tabular-nums",
                          isOver ? "text-rose-500" : "text-ink-tertiary",
                        )}>
                          {Math.min(pct, 999)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Action bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-ink-tertiary uppercase tracking-widest">
          Transaction Log
          <span className="ml-2 text-ink-tertiary font-normal normal-case tracking-normal">
            ({transactions.length} entries)
          </span>
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCSV(sortedTransactions, initialBudget.name)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-ink-secondary bg-canvas-100 hover:bg-canvas-200 border border-border rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-ink hover:bg-canvas-800 border border-border rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Expense
          </button>
        </div>
      </div>

      {/* ── Add expense form ─────────────────────────────────────────────── */}
      {showForm && (
        <div className="border border-gold/30 bg-gold-100/10 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-bold text-ink uppercase tracking-wider">New Expense</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-2xs text-ink-tertiary font-semibold uppercase tracking-wider block mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full text-xs bg-canvas-100 border border-border focus:border-border-strong rounded-xl px-3 py-2 text-ink outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-2xs text-ink-tertiary font-semibold uppercase tracking-wider block mb-1">Amount ($)</label>
              <input
                type="number"
                placeholder="0"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="w-full text-xs bg-canvas-100 border border-border focus:border-border-strong rounded-xl px-3 py-2 text-ink placeholder-ink-tertiary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-2xs text-ink-tertiary font-semibold uppercase tracking-wider block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as BudgetCategory }))}
                className="w-full text-xs bg-canvas-100 border border-border focus:border-border-strong rounded-xl px-3 py-2 text-ink outline-none transition-colors"
              >
                {BUDGET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-2xs text-ink-tertiary font-semibold uppercase tracking-wider block mb-1">Vendor</label>
              <input
                type="text"
                placeholder="Who was paid?"
                value={form.vendor}
                onChange={(e) => setForm((f) => ({ ...f, vendor: e.target.value }))}
                className="w-full text-xs bg-canvas-100 border border-border focus:border-border-strong rounded-xl px-3 py-2 text-ink placeholder-ink-tertiary outline-none transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-2xs text-ink-tertiary font-semibold uppercase tracking-wider block mb-1">Notes</label>
            <input
              type="text"
              placeholder="What was this for?"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="w-full text-xs bg-canvas-100 border border-border focus:border-border-strong rounded-xl px-3 py-2 text-ink placeholder-ink-tertiary outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddExpense}
              disabled={!form.amount || !form.vendor.trim()}
              className="flex-1 py-2 text-xs font-bold text-white bg-gold hover:bg-gold/90 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Log Expense
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs text-ink-tertiary hover:text-ink bg-canvas-100 hover:bg-canvas-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Transaction log ──────────────────────────────────────────────── */}
      <div className="border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-canvas-100">
              <th className="text-left text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Date</th>
              <th className="text-right text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Amount</th>
              <th className="text-left text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Category</th>
              <th className="text-left text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Vendor</th>
              <th className="text-left text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">Notes</th>
              <th className="text-left text-2xs font-bold text-ink-tertiary uppercase tracking-wider px-4 py-3">By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-canvas-100/50 transition-colors">
                <td className="px-4 py-3 text-xs text-ink-secondary tabular-nums whitespace-nowrap">
                  {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-ink tabular-nums whitespace-nowrap">
                  {formatMoney(tx.amount)}
                </td>
                <td className="px-4 py-3">
                  <span className="text-2xs font-semibold text-ink-secondary bg-canvas-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {CATEGORY_LABELS[tx.category]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-ink whitespace-nowrap">{tx.vendor}</td>
                <td className="px-4 py-3 text-xs text-ink-secondary max-w-[240px] truncate">{tx.notes}</td>
                <td className="px-4 py-3 text-xs text-ink-tertiary whitespace-nowrap">
                  {tx.enteredBy.split(" ")[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// ─── Budget stat card ─────────────────────────────────────────────────────────

function BudgetStat({
  label,
  value,
  sub,
  icon,
  valueColor = "text-ink",
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  valueColor?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-canvas-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-2xs font-bold text-ink-tertiary uppercase tracking-wider">{label}</p>
        {icon}
      </div>
      <p className={cn("text-2xl font-black tabular-nums", valueColor)}>{value}</p>
      <p className="text-2xs text-ink-tertiary mt-1">{sub}</p>
    </div>
  );
}

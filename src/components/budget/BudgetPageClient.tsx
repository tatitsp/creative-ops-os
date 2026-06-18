"use client";

import { useEffect, useState } from "react";
import { useBudgetStore, type ApiBudgetItem, type BudgetSummary } from "@/store/budget-store";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

const CATEGORIES = [
  "RECORDING",
  "MIXING_MASTERING",
  "PHOTOGRAPHY",
  "VIDEO",
  "MARKETING",
  "DISTRIBUTION",
  "OTHER",
];

const CATEGORY_LABELS: Record<string, string> = {
  RECORDING: "Recording",
  MIXING_MASTERING: "Mixing & Mastering",
  PHOTOGRAPHY: "Photography",
  VIDEO: "Video",
  MARKETING: "Marketing",
  DISTRIBUTION: "Distribution",
  OTHER: "Other",
};

function fmt(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

interface Props {
  workspaceSlug: string;
  initialItems: ApiBudgetItem[];
  initialSummary: BudgetSummary;
}

export function BudgetPageClient({ workspaceSlug, initialItems, initialSummary }: Props) {
  const { items, summary, init, addItem, removeItem } = useBudgetStore();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    category: "RECORDING",
    description: "",
    amount: "",
    type: "EXPENSE",
    notes: "",
  });

  useEffect(() => {
    init(workspaceSlug, initialItems, initialSummary);
  }, [workspaceSlug, initialItems, initialSummary, init]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceSlug}/budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: form.category,
          description: form.description,
          amount: parseFloat(form.amount),
          type: form.type,
          notes: form.notes || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        addItem(data.item as ApiBudgetItem);
        setForm({ category: "RECORDING", description: "", amount: "", type: "EXPENSE", notes: "" });
        setShowForm(false);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl space-y-6 animate-in">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Income", value: fmt(summary.totalIncome), accent: "text-emerald-500" },
          { label: "Total Expenses", value: fmt(summary.totalExpenses), accent: "text-rose-500" },
          { label: "Net", value: fmt(summary.net), accent: summary.net >= 0 ? "text-emerald-500" : "text-rose-500" },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-label mb-2">{s.label}</p>
            <p className={`text-2xl font-black ${s.accent}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Add item button */}
      <div className="flex items-center justify-between">
        <h2 className="text-subheading">Budget Items</h2>
        <Button
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setShowForm((v) => !v)}
        >
          Add Item
        </Button>
      </div>

      {/* Add item form */}
      {showForm && (
        <div className="card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-ink">New Budget Item</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-ink-tertiary mb-1 block">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong transition-colors"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-ink-tertiary mb-1 block">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong transition-colors"
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>
            </div>
            <input
              required
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Description"
              className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong transition-colors"
            />
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="Amount (USD)"
              className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong transition-colors"
            />
            <input
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Notes (optional)"
              className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong transition-colors"
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" variant="primary" disabled={submitting}>
                {submitting ? "Saving…" : "Save Item"}
              </Button>
              <Button type="button" size="sm" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Items list */}
      {items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm font-semibold text-ink">No budget items yet</p>
          <p className="text-xs text-ink-tertiary mt-1">Add your first income or expense above.</p>
        </div>
      ) : (
        <div className="card divide-y divide-border">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 text-label">
            <span>Description</span>
            <span className="w-32">Category</span>
            <span className="w-20 text-right">Type</span>
            <span className="w-24 text-right">Amount</span>
            <span className="w-8" />
          </div>
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 hover:bg-canvas-50 transition-colors">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{item.description}</p>
                {item.notes && (
                  <p className="text-xs text-ink-tertiary mt-0.5 truncate">{item.notes}</p>
                )}
              </div>
              <span className="text-xs text-ink-secondary w-32 truncate">
                {CATEGORY_LABELS[item.category] ?? item.category}
              </span>
              <span
                className={`text-xs font-semibold w-20 text-right ${
                  item.type === "INCOME" ? "text-emerald-500" : "text-rose-400"
                }`}
              >
                {item.type}
              </span>
              <span className="text-sm font-semibold text-ink w-24 text-right tabular-nums">
                {fmt(item.amount)}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-ink-tertiary hover:text-rose-400 transition-colors w-8 flex justify-end"
                aria-label="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

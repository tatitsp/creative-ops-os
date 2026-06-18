import { create } from "zustand";

export type ApiBudgetItem = {
  id: string;
  category: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; name: string | null; email: string } | null;
};

export type BudgetSummary = {
  totalIncome: number;
  totalExpenses: number;
  net: number;
};

interface BudgetStore {
  items: ApiBudgetItem[];
  summary: BudgetSummary;
  workspaceSlug: string;
  init: (slug: string, items: ApiBudgetItem[], summary: BudgetSummary) => void;
  addItem: (item: ApiBudgetItem) => void;
  removeItem: (id: string) => void;
}

function computeSummary(items: ApiBudgetItem[]): BudgetSummary {
  const totalIncome = items
    .filter((i) => i.type === "INCOME")
    .reduce((s, i) => s + i.amount, 0);
  const totalExpenses = items
    .filter((i) => i.type === "EXPENSE")
    .reduce((s, i) => s + i.amount, 0);
  return { totalIncome, totalExpenses, net: totalIncome - totalExpenses };
}

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  items: [],
  summary: { totalIncome: 0, totalExpenses: 0, net: 0 },
  workspaceSlug: "",

  init: (slug, items, summary) => {
    set({ workspaceSlug: slug, items, summary });
  },

  addItem: (item) => {
    set((state) => {
      const items = [item, ...state.items];
      return { items, summary: computeSummary(items) };
    });
  },

  removeItem: (id) => {
    const { workspaceSlug } = get();
    set((state) => {
      const items = state.items.filter((i) => i.id !== id);
      return { items, summary: computeSummary(items) };
    });
    fetch(`/api/workspaces/${workspaceSlug}/budget/${id}`, {
      method: "DELETE",
    }).catch(console.error);
  },
}));

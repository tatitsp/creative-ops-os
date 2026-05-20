import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { CURRENT_USER } from "@/lib/mock-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Budget` : "Budget" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

const ALLOWED_ROLES = ["ARTIST_CEO", "CREATIVE_OPS_DIRECTOR"];

const BUDGET_ITEMS = [
  { category: "Production",     allocated: 8000,  spent: 5200, label: "Recording, mixing, mastering" },
  { category: "Visual Content", allocated: 4500,  spent: 2800, label: "Videography, photography, editing" },
  { category: "Marketing",      allocated: 3000,  spent: 1400, label: "Playlist pitching, press, paid ads" },
  { category: "Design",         allocated: 2000,  spent: 900,  label: "Cover art, merch mockups, social templates" },
  { category: "Merch",          allocated: 5000,  spent: 0,    label: "Print run — pending artist approval" },
  { category: "Miscellaneous",  allocated: 1500,  spent: 620,  label: "Travel, gear, tools" },
];

export default async function ArtistBudgetPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  if (!ALLOWED_ROLES.includes(CURRENT_USER.role)) {
    return (
      <>
        <TopBar title="Budget" subtitle={ws.artistName} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-sm text-ink-tertiary">You don&apos;t have access to budget information.</p>
        </div>
      </>
    );
  }

  const totalAllocated = BUDGET_ITEMS.reduce((s, i) => s + i.allocated, 0);
  const totalSpent = BUDGET_ITEMS.reduce((s, i) => s + i.spent, 0);
  const remaining = totalAllocated - totalSpent;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <>
      <TopBar
        title="Budget"
        subtitle={`${ws.artistName} · Private financial overview`}
      />

      <div className="p-6 max-w-4xl space-y-6 animate-in">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Budget",  value: fmt(totalAllocated), accent: "text-ink" },
            { label: "Total Spent",   value: fmt(totalSpent),     accent: "text-rose-500" },
            { label: "Remaining",     value: fmt(remaining),      accent: "text-emerald-500" },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <p className="text-label mb-2">{s.label}</p>
              <p className={`text-2xl font-black ${s.accent}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Line items */}
        <div className="card divide-y divide-border">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 text-label">
            <span>Category</span>
            <span className="w-24 text-right">Allocated</span>
            <span className="w-24 text-right">Spent</span>
            <span className="w-24 text-right">Remaining</span>
          </div>
          {BUDGET_ITEMS.map((item) => {
            const pct = Math.round((item.spent / item.allocated) * 100);
            const left = item.allocated - item.spent;
            return (
              <div key={item.category} className="px-5 py-4">
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center mb-2">
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.category}</p>
                    <p className="text-2xs text-ink-tertiary mt-0.5">{item.label}</p>
                  </div>
                  <span className="text-sm text-ink-secondary w-24 text-right">{fmt(item.allocated)}</span>
                  <span className="text-sm text-rose-500 w-24 text-right">{fmt(item.spent)}</span>
                  <span className={`text-sm font-semibold w-24 text-right ${left > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {fmt(left)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-canvas-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct > 90 ? "bg-rose-400" : "bg-gold"}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

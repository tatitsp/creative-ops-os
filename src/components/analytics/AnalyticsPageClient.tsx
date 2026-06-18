"use client";

import { useState } from "react";
import { Trash2, Plus, X } from "lucide-react";
import { formatNumber } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AnalyticsEntryRow {
  id: string;
  platform: string;
  metric: string;
  value: number;
  recordedAt: string;
  notes: string | null;
  createdAt: string;
  createdBy: { id: string; name: string | null; email: string } | null;
}

interface Props {
  slug: string;
  initialEntries: AnalyticsEntryRow[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLatestByPlatformMetric(entries: AnalyticsEntryRow[]) {
  const map = new Map<string, AnalyticsEntryRow>();
  for (const e of entries) {
    const key = `${e.platform}::${e.metric}`;
    const existing = map.get(key);
    if (!existing || new Date(e.recordedAt) > new Date(existing.recordedAt)) {
      map.set(key, e);
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    a.platform.localeCompare(b.platform) || a.metric.localeCompare(b.metric)
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AnalyticsPageClient({ slug, initialEntries }: Props) {
  const [entries, setEntries] = useState<AnalyticsEntryRow[]>(initialEntries);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [platform, setPlatform] = useState("");
  const [metric, setMetric] = useState("");
  const [value, setValue] = useState("");
  const [recordedAt, setRecordedAt] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState("");

  const latest = getLatestByPlatformMetric(entries);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/workspaces/${slug}/analytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, metric, value: Number(value), recordedAt, notes: notes || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Failed to save");
      }
      const data = await res.json() as { entry: AnalyticsEntryRow };
      setEntries((prev) => [data.entry, ...prev]);
      setPlatform("");
      setMetric("");
      setValue("");
      setRecordedAt(new Date().toISOString().slice(0, 10));
      setNotes("");
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/workspaces/${slug}/analytics/${id}`, { method: "DELETE" });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="p-6 space-y-6 animate-in">
      {/* Summary cards */}
      {latest.length > 0 && (
        <section>
          <h2 className="text-subheading mb-3">Latest Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {latest.map((e) => (
              <div key={`${e.platform}-${e.metric}`} className="card p-4">
                <p className="text-2xs text-ink-tertiary uppercase tracking-wider mb-1">
                  {e.platform}
                </p>
                <p className="text-xl font-semibold text-ink">
                  {e.metric === "engagement_rate"
                    ? `${e.value}%`
                    : formatNumber(e.value)}
                </p>
                <p className="text-xs text-ink-secondary mt-0.5">{e.metric}</p>
                <p className="text-2xs text-ink-tertiary mt-1">{formatDate(e.recordedAt)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Header + add button */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-subheading">All Entries</h2>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gold text-white rounded-lg text-xs font-semibold hover:bg-gold/90 transition-colors"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showForm ? "Cancel" : "Add Entry"}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="card p-5 mb-4 space-y-4">
            <h3 className="text-sm font-semibold text-ink">New Analytics Entry</h3>
            {error && (
              <p className="text-xs text-rose-500 bg-rose-50 rounded-lg px-3 py-2">{error}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-label block mb-1">Platform</label>
                <input
                  required
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="instagram, tiktok, spotify…"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="text-label block mb-1">Metric</label>
                <input
                  required
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                  placeholder="followers, views, streams…"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="text-label block mb-1">Value</label>
                <input
                  required
                  type="number"
                  step="any"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="0"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="text-label block mb-1">Date</label>
                <input
                  required
                  type="date"
                  value={recordedAt}
                  onChange={(e) => setRecordedAt(e.target.value)}
                  className="input w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-label block mb-1">Notes (optional)</label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any context…"
                className="input w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-gold text-white rounded-lg text-xs font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Entry"}
              </button>
            </div>
          </form>
        )}

        {/* Entry list */}
        {entries.length === 0 ? (
          <div className="card p-8 text-center text-ink-tertiary text-sm">
            No analytics entries yet. Add the first one above.
          </div>
        ) : (
          <div className="card divide-y divide-border">
            {entries.map((e) => (
              <div key={e.id} className="flex items-center gap-4 px-4 py-3 group">
                <div className="flex-1 min-w-0 grid grid-cols-4 gap-4 items-center">
                  <span className="text-xs font-semibold text-ink capitalize">{e.platform}</span>
                  <span className="text-xs text-ink-secondary">{e.metric}</span>
                  <span className="text-xs font-semibold text-ink">
                    {e.metric === "engagement_rate" ? `${e.value}%` : formatNumber(e.value)}
                  </span>
                  <span className="text-2xs text-ink-tertiary">{formatDate(e.recordedAt)}</span>
                </div>
                {e.notes && (
                  <span className="text-2xs text-ink-tertiary truncate max-w-[140px]">{e.notes}</span>
                )}
                <button
                  onClick={() => handleDelete(e.id)}
                  disabled={deleting === e.id}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-rose-50 text-ink-tertiary hover:text-rose-500 transition-all disabled:opacity-30"
                  aria-label="Delete entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

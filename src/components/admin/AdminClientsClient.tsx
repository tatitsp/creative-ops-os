"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Layers, ChevronRight, Pencil } from "lucide-react";

type Client = {
  id: string;
  name: string;
  slug: string;
  type: string;
  brandColor: string;
  status: string;
  description: string | null;
  createdAt: Date;
  _count: { workspaces: number };
};

const TYPE_OPTIONS = ["LABEL", "ARTIST", "BUSINESS", "AGENCY", "OTHER"] as const;
const TYPE_LABELS: Record<string, string> = {
  LABEL: "Label", ARTIST: "Artist", BUSINESS: "Business", AGENCY: "Agency", OTHER: "Other",
};

export function AdminClientsClient({ clients: initial }: { clients: Client[] }) {
  const router = useRouter();
  const [clients, setClients] = useState(initial);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "LABEL",
    description: "",
    brandColor: "#7C3AED",
  });

  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: autoSlug(name) }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to create client");
        return;
      }
      setShowCreate(false);
      setForm({ name: "", slug: "", type: "LABEL", description: "", brandColor: "#7C3AED" });
      router.refresh();
      const data = await res.json();
      setClients((prev) => [...prev, { ...data.client, _count: { workspaces: 0 } }]);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-lg font-bold text-white">Clients</h1>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{
            background: showCreate ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          New Client
        </button>
      </div>
      <p className="text-xs mb-8" style={{ color: "rgba(255,255,255,0.3)" }}>
        Clients group workspaces under a single entity (label, artist, business, etc.).
      </p>

      {/* Create form */}
      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border p-6 mb-8 space-y-4"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
        >
          <p className="text-sm font-semibold text-white mb-2">New Client</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 block mb-1">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Royal Priesthood"
                className="w-full text-sm rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-white/25"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1">Slug *</label>
              <input
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="royal-priesthood"
                className="w-full text-sm rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-white/25"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 block mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full text-sm rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/25"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t} style={{ background: "#1a1a1a" }}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1">Brand Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.brandColor}
                  onChange={(e) => setForm((f) => ({ ...f, brandColor: e.target.value }))}
                  className="w-9 h-9 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                />
                <input
                  value={form.brandColor}
                  onChange={(e) => setForm((f) => ({ ...f, brandColor: e.target.value }))}
                  placeholder="#7C3AED"
                  className="flex-1 text-sm rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-white/25"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-white/50 block mb-1">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Optional description"
              className="w-full text-sm rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-white/25"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="text-xs px-4 py-2 rounded-lg font-semibold transition-opacity disabled:opacity-50"
              style={{ background: "#7C3AED", color: "white" }}
            >
              {saving ? "Creating…" : "Create Client"}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="text-xs transition-opacity hover:opacity-70"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Client list */}
      {clients.length === 0 ? (
        <div
          className="rounded-xl border p-8 text-center"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
        >
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
            No clients yet. Create one above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((c) => (
            <Link
              key={c.id}
              href={`/admin/clients/${c.id}`}
              className="flex items-center gap-4 rounded-xl border px-5 py-4 transition-colors group"
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
            >
              {/* Color swatch */}
              <div
                className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ background: `${c.brandColor}25` }}
              >
                <Layers className="w-4 h-4" style={{ color: c.brandColor }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{c.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  /{c.slug} · {TYPE_LABELS[c.type]} · {c._count.workspaces} workspace{c._count.workspaces !== 1 ? "s" : ""}
                </p>
              </div>

              {c.status !== "ACTIVE" && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}
                >
                  {c.status.toLowerCase()}
                </span>
              )}

              <div className="flex items-center gap-2">
                <Pencil className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" style={{ color: "white" }} />
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" style={{ color: "rgba(255,255,255,0.2)" }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

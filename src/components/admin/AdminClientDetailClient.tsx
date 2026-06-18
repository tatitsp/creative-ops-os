"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2, UserPlus, Link2 } from "lucide-react";

type WorkspaceMember = {
  role: string;
  user: { id: string; email: string; name: string | null; image: string | null };
};

type Workspace = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  dashboardHref: string | null;
  _count: { members: number };
  members: WorkspaceMember[];
};

type Client = {
  id: string;
  name: string;
  slug: string;
  type: string;
  brandColor: string;
  status: string;
  description: string | null;
  workspaces: Workspace[];
};

const TYPE_OPTIONS = ["LABEL", "ARTIST", "BUSINESS", "AGENCY", "OTHER"] as const;
const TYPE_LABELS: Record<string, string> = {
  LABEL: "Label", ARTIST: "Artist", BUSINESS: "Business", AGENCY: "Agency", OTHER: "Other",
};
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "ARCHIVED"] as const;
const ROLE_OPTIONS = [
  "CREATIVE_OPS_DIRECTOR", "CREATIVE_ASSISTANT", "ARTIST_CEO", "MANAGEMENT",
  "PHOTOGRAPHER_VIDEOGRAPHER", "EDITOR", "SOCIAL_MEDIA", "GRAPHIC_DESIGNER", "CONTRACTOR",
];

export function AdminClientDetailClient({
  client: initial,
  unassignedWorkspaces,
  allUsers,
  isAdmin = false,
}: {
  client: Client;
  unassignedWorkspaces: { id: string; name: string; slug: string }[];
  allUsers: { id: string; email: string; name: string | null }[];
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [client, setClient] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit client form state
  const [editForm, setEditForm] = useState({
    name: initial.name,
    slug: initial.slug,
    type: initial.type,
    brandColor: initial.brandColor,
    status: initial.status,
    description: initial.description ?? "",
  });

  // Add workspace form
  const [showAddWs, setShowAddWs] = useState(false);
  const [addWsMode, setAddWsMode] = useState<"existing" | "new">("existing");
  const [selectedWsId, setSelectedWsId] = useState("");
  const [newWsForm, setNewWsForm] = useState({
    name: "", slug: "", plan: "STARTER", dashboardHref: "",
  });

  // Add member form
  const [addMemberWsId, setAddMemberWsId] = useState<string | null>(null);
  const [memberForm, setMemberForm] = useState({ userId: "", role: "CREATIVE_ASSISTANT" });

  // Generate invite link state
  const [showInviteWsId, setShowInviteWsId] = useState<string | null>(null);
  const [inviteRole, setInviteRole] = useState<Record<string, string>>({});
  const [inviteEmail, setInviteEmail] = useState<Record<string, string>>({});
  const [inviteLinks, setInviteLinks] = useState<Record<string, string>>({});
  const [inviteEmailSent, setInviteEmailSent] = useState<Record<string, boolean>>({});
  const [generatingInvite, setGeneratingInvite] = useState(false);

  function flash(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  async function handleSaveClient(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Save failed");
        return;
      }
      const d = await res.json();
      setClient((c) => ({ ...c, ...d.client }));
      flash("Client saved.");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddWorkspace(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const body = addWsMode === "existing"
        ? { existingWorkspaceId: selectedWsId }
        : { ...newWsForm };

      const res = await fetch(`/api/admin/clients/${client.id}/workspaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed");
        return;
      }
      setShowAddWs(false);
      setSelectedWsId("");
      setNewWsForm({ name: "", slug: "", plan: "STARTER", dashboardHref: "" });
      router.refresh();
      flash("Workspace added.");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveWorkspace(wsId: string) {
    if (!confirm("Remove this workspace from the client? (It won't be deleted.)")) return;
    try {
      const res = await fetch(`/api/admin/clients/${client.id}/workspaces`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId: wsId }),
      });
      if (!res.ok) return;
      setClient((c) => ({ ...c, workspaces: c.workspaces.filter((w) => w.id !== wsId) }));
      flash("Workspace removed.");
    } catch { /* noop */ }
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!addMemberWsId) return;
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: memberForm.userId,
          workspaceId: addMemberWsId,
          role: memberForm.role,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed");
        return;
      }
      setAddMemberWsId(null);
      setMemberForm({ userId: "", role: "CREATIVE_ASSISTANT" });
      router.refresh();
      flash("Member added.");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteClient() {
    if (!confirm(`Delete client "${client.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin/clients");
    } catch { /* noop */ }
  }

  async function handleGenerateInvite(wsId: string) {
    const role = inviteRole[wsId] ?? "CREATIVE_ASSISTANT";
    const email = inviteEmail[wsId]?.trim() || undefined;
    setGeneratingInvite(true);
    try {
      const res = await fetch("/api/admin/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId: wsId, role, email }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to generate invite");
        return;
      }
      const d = await res.json();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://creative-ops-os.vercel.app";
      setInviteLinks((prev) => ({
        ...prev,
        [wsId]: `${appUrl}/invite/${d.invite.token}`,
      }));
      if (email) {
        setInviteEmailSent((prev) => ({ ...prev, [wsId]: true }));
      }
    } catch {
      setError("Network error");
    } finally {
      setGeneratingInvite(false);
    }
  }

  const inputClass = "w-full text-sm rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-white/25";
  const labelClass = "text-xs text-white/50 block mb-1";

  return (
    <div className="space-y-10">
      {/* Back */}
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        <ChevronLeft className="w-3 h-3" />
        All Clients
      </Link>

      {/* Flash messages */}
      {success && (
        <div className="text-xs px-4 py-2 rounded-lg" style={{ background: "rgba(52,211,153,0.1)", color: "#34d399" }}>
          {success}
        </div>
      )}
      {error && (
        <div className="text-xs px-4 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
          {error}
        </div>
      )}

      {/* ── Edit Client ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-white mb-4">Client Details</h2>
        <form
          onSubmit={handleSaveClient}
          className="rounded-xl border p-6 space-y-4"
          style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input className={inputClass} value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input className={inputClass} value={editForm.slug} onChange={(e) => setEditForm((f) => ({ ...f, slug: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select className={inputClass} value={editForm.type} onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value }))}>
                {TYPE_OPTIONS.map((t) => <option key={t} value={t} style={{ background: "#1a1a1a" }}>{TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select className={inputClass} value={editForm.status} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s} style={{ background: "#1a1a1a" }}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Brand Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={editForm.brandColor} onChange={(e) => setEditForm((f) => ({ ...f, brandColor: e.target.value }))} className="w-9 h-9 rounded-lg border border-white/10 bg-transparent cursor-pointer flex-shrink-0" />
                <input className="flex-1 text-sm rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/25" value={editForm.brandColor} onChange={(e) => setEditForm((f) => ({ ...f, brandColor: e.target.value }))} />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <input className={inputClass} value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} placeholder="Optional" />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              disabled={saving}
              className="text-xs px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
              style={{ background: "#7C3AED", color: "white" }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={handleDeleteClient}
                className="text-xs transition-opacity hover:opacity-70 flex items-center gap-1"
                style={{ color: "rgba(239,68,68,0.6)" }}
              >
                <Trash2 className="w-3 h-3" />
                Delete Client
              </button>
            )}
          </div>
        </form>
      </section>

      {/* ── Workspaces ──────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Workspaces</h2>
          <button
            onClick={() => setShowAddWs((v) => !v)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Workspace
          </button>
        </div>

        {/* Add workspace form */}
        {showAddWs && (
          <form
            onSubmit={handleAddWorkspace}
            className="rounded-xl border p-5 mb-6 space-y-4"
            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
          >
            {/* Mode toggle */}
            <div className="flex gap-3 mb-2">
              {(["existing", "new"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAddWsMode(mode)}
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    background: addWsMode === mode ? "rgba(255,255,255,0.12)" : "transparent",
                    color: addWsMode === mode ? "white" : "rgba(255,255,255,0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {mode === "existing" ? "Assign Existing" : "Create New"}
                </button>
              ))}
            </div>

            {addWsMode === "existing" ? (
              <div>
                <label className={labelClass}>Select Workspace</label>
                <select
                  required
                  value={selectedWsId}
                  onChange={(e) => setSelectedWsId(e.target.value)}
                  className={inputClass}
                >
                  <option value="" style={{ background: "#1a1a1a" }}>— choose —</option>
                  {unassignedWorkspaces.map((ws) => (
                    <option key={ws.id} value={ws.id} style={{ background: "#1a1a1a" }}>
                      {ws.name} (/{ws.slug})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Name *</label>
                    <input required className={inputClass} value={newWsForm.name} onChange={(e) => setNewWsForm((f) => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Slug *</label>
                    <input required className={inputClass} value={newWsForm.slug} onChange={(e) => setNewWsForm((f) => ({ ...f, slug: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Dashboard URL (optional)</label>
                  <input className={inputClass} value={newWsForm.dashboardHref} onChange={(e) => setNewWsForm((f) => ({ ...f, dashboardHref: e.target.value }))} placeholder="/artists/slug/dashboard" />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="text-xs px-4 py-2 rounded-lg font-semibold disabled:opacity-50" style={{ background: "#7C3AED", color: "white" }}>
                {saving ? "Adding…" : "Add Workspace"}
              </button>
              <button type="button" onClick={() => setShowAddWs(false)} className="text-xs hover:opacity-70" style={{ color: "rgba(255,255,255,0.35)" }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Workspace list */}
        {client.workspaces.length === 0 ? (
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>No workspaces yet.</p>
        ) : (
          <div className="space-y-4">
            {client.workspaces.map((ws) => (
              <div
                key={ws.id}
                className="rounded-xl border p-5"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{ws.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                      /{ws.slug} · {ws.plan} · {ws._count.members} member{ws._count.members !== 1 ? "s" : ""}
                    </p>
                    {ws.dashboardHref && (
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                        → {ws.dashboardHref}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAddMemberWsId(addMemberWsId === ws.id ? null : ws.id)}
                      className="text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}
                    >
                      <UserPlus className="w-3 h-3" />
                      Add Member
                    </button>
                    <button
                      onClick={() => handleRemoveWorkspace(ws.id)}
                      className="text-xs p-1.5 rounded-lg transition-colors hover:opacity-70"
                      style={{ color: "rgba(239,68,68,0.5)" }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Add member form */}
                {addMemberWsId === ws.id && (
                  <form
                    onSubmit={handleAddMember}
                    className="mt-3 p-3 rounded-lg space-y-3"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <p className="text-xs font-semibold text-white/60">Add Team Member</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>User</label>
                        <select required value={memberForm.userId} onChange={(e) => setMemberForm((f) => ({ ...f, userId: e.target.value }))} className={inputClass}>
                          <option value="" style={{ background: "#1a1a1a" }}>— choose —</option>
                          {allUsers
                            .filter((u) => !ws.members.find((m) => m.user.id === u.id))
                            .map((u) => (
                              <option key={u.id} value={u.id} style={{ background: "#1a1a1a" }}>
                                {u.name ?? u.email}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Role</label>
                        <select value={memberForm.role} onChange={(e) => setMemberForm((f) => ({ ...f, role: e.target.value }))} className={inputClass}>
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r} style={{ background: "#1a1a1a" }}>
                              {r.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="submit" disabled={saving} className="text-xs px-3 py-1.5 rounded-lg font-semibold disabled:opacity-50" style={{ background: "#7C3AED", color: "white" }}>
                        {saving ? "Adding…" : "Add"}
                      </button>
                      <button type="button" onClick={() => setAddMemberWsId(null)} className="text-xs hover:opacity-70" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Members table */}
                {ws.members.length > 0 && (
                  <table className="w-full text-xs mt-3">
                    <thead>
                      <tr style={{ color: "rgba(255,255,255,0.3)" }}>
                        <th className="text-left pb-2 font-medium">Member</th>
                        <th className="text-left pb-2 font-medium">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ws.members.map((m, i) => (
                        <tr key={i} style={{ color: "rgba(255,255,255,0.55)" }}>
                          <td className="py-1">{m.user.name ?? m.user.email}</td>
                          <td className="py-1">{m.role.replace(/_/g, " ").toLowerCase()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Generate Invite Link */}
                <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <button
                    type="button"
                    onClick={() => setShowInviteWsId(showInviteWsId === ws.id ? null : ws.id)}
                    className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    <Link2 className="w-3 h-3" />
                    {showInviteWsId === ws.id ? "Hide invite" : "Invite someone"}
                  </button>

                  {showInviteWsId === ws.id && (
                    <div className="mt-3 p-3 rounded-lg space-y-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <p className="text-xs font-semibold text-white/60">Invite Someone</p>

                      {/* Optional email */}
                      <div>
                        <label className={labelClass}>Email address <span style={{ color: "rgba(255,255,255,0.2)" }}>(optional — sends invite email)</span></label>
                        <input
                          type="email"
                          placeholder="teammate@email.com"
                          value={inviteEmail[ws.id] ?? ""}
                          onChange={(e) => setInviteEmail((prev) => ({ ...prev, [ws.id]: e.target.value }))}
                          className={inputClass}
                        />
                      </div>

                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <label className={labelClass}>Role</label>
                          <select
                            value={inviteRole[ws.id] ?? "CREATIVE_ASSISTANT"}
                            onChange={(e) => setInviteRole((prev) => ({ ...prev, [ws.id]: e.target.value }))}
                            className={inputClass}
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r} value={r} style={{ background: "#1a1a1a" }}>
                                {r.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          disabled={generatingInvite}
                          onClick={() => handleGenerateInvite(ws.id)}
                          className="text-xs px-3 py-2 rounded-lg font-semibold disabled:opacity-50 flex-shrink-0"
                          style={{ background: "#7C3AED", color: "white" }}
                        >
                          {generatingInvite ? "Sending…" : inviteEmail[ws.id]?.trim() ? "Send Invite" : "Generate Link"}
                        </button>
                      </div>

                      {inviteEmailSent[ws.id] && (
                        <p className="text-xs" style={{ color: "#4CAF7D" }}>
                          ✓ Invite email sent to {inviteEmail[ws.id]}
                        </p>
                      )}

                      {inviteLinks[ws.id] && (
                        <div className="flex items-center gap-2">
                          <input
                            readOnly
                            value={inviteLinks[ws.id]}
                            className="flex-1 text-xs rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white/70 focus:outline-none"
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                          />
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(inviteLinks[ws.id])}
                            className="text-xs px-3 py-2 rounded-lg flex-shrink-0 transition-opacity hover:opacity-70"
                            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
                          >
                            Copy
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

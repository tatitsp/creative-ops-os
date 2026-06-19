"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, X, ExternalLink } from "lucide-react";

const ALL_ROLES = [
  "CREATIVE_OPS_DIRECTOR",
  "ARTIST_CEO",
  "MANAGEMENT",
  "CREATIVE_ASSISTANT",
  "PHOTOGRAPHER_VIDEOGRAPHER",
  "EDITOR",
  "SOCIAL_MEDIA",
  "GRAPHIC_DESIGNER",
  "CONTRACTOR",
] as const;

const ROLE_DISPLAY: Record<string, string> = {
  CREATIVE_OPS_DIRECTOR:     "Creative Ops Director",
  ARTIST_CEO:                "Artist / CEO",
  MANAGEMENT:                "Management",
  CREATIVE_ASSISTANT:        "Creative Assistant",
  PHOTOGRAPHER_VIDEOGRAPHER: "Photographer / Videographer",
  EDITOR:                    "Editor",
  SOCIAL_MEDIA:              "Social Media",
  GRAPHIC_DESIGNER:          "Graphic Designer",
  CONTRACTOR:                "Contractor",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#7C3AED",
  ACTIVE:  "#4CAF7D",
  AWAY:    "#F59E0B",
  BUSY:    "#EF4444",
  OFFLINE: "rgba(255,255,255,0.2)",
};

type Workspace = { id: string; name: string; slug: string };

type User = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  platformRole: string;
  status: string;
  createdAt: string | Date;
  workspaceMemberships: { role: string; workspace: Workspace }[];
};

type Props = { users: User[]; workspaces: Workspace[]; isAdmin?: boolean };

export function AdminUsersClient({ users: initialUsers, workspaces, isAdmin = false }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [busy, setBusy] = useState<string | null>(null);

  // ── Update role or status ─────────────────────────────────────────────────

  async function updateUser(id: string, patch: { role?: string; status?: string }) {
    setBusy(id);
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...patch } : u))
    );
    setBusy(null);
  }

  // ── Toggle Platform Partner ───────────────────────────────────────────────

  async function togglePlatformPartner(id: string, current: string) {
    const next = current === "PLATFORM_PARTNER" ? "USER" : "PLATFORM_PARTNER";
    setBusy(id);
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platformRole: next }),
    });
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, platformRole: next } : u))
    );
    setBusy(null);
  }

  // ── Assign workspace ──────────────────────────────────────────────────────

  async function assignWorkspace(userId: string, workspaceId: string, role: string) {
    setBusy(userId);
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, workspaceId, role }),
    });
    router.refresh();
    setBusy(null);
  }

  // ── Remove workspace membership ───────────────────────────────────────────

  async function removeWorkspace(userId: string, workspaceId: string) {
    setBusy(userId);
    await fetch(`/api/admin/users/${userId}/workspaces`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wid: workspaceId }),
    });
    router.refresh();
    setBusy(null);
  }

  // ── Remove all access ─────────────────────────────────────────────────────

  async function removeAllAccess(userId: string) {
    if (!confirm("Remove all workspace access for this user?")) return;
    setBusy(userId);
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    router.refresh();
    setBusy(null);
  }

  // ── Invite new user ───────────────────────────────────────────────────────

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "CREATIVE_ASSISTANT",
    workspaceId: workspaces[0]?.id ?? "",
  });
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState<{
    emailSent: boolean;
    inviteUrl: string;
    existingUser: boolean;
  } | null>(null);
  const [inviteError, setInviteError] = useState("");

  async function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteForm.email || !inviteForm.workspaceId) return;
    setInviting(true);
    setInviteError("");
    setInviteResult(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setInviteError(data.error ?? "Something went wrong");
        return;
      }
      setInviteResult(data);
      setInviteForm({ name: "", email: "", role: "CREATIVE_ASSISTANT", workspaceId: workspaces[0]?.id ?? "" });
      router.refresh();
    } catch {
      setInviteError("Network error — please try again");
    } finally {
      setInviting(false);
    }
  }

  const inputCls =
    "w-full text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-white/25 transition-colors";
  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.8)",
  };
  const labelCls = "block text-[10px] uppercase tracking-wider mb-1.5";
  const labelStyle = { color: "rgba(255,255,255,0.3)" };

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-lg font-bold text-white">Users</h1>
        <button
          onClick={() => { setShowInviteForm((v) => !v); setInviteResult(null); setInviteError(""); }}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl font-semibold transition-all hover:opacity-90"
          style={{ background: "#7C3AED", color: "white" }}
        >
          <UserPlus className="w-3.5 h-3.5" />
          Invite New User
        </button>
      </div>
      <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
        {users.length} account{users.length !== 1 ? "s" : ""} in the system.
        Assign workspaces and roles here.
      </p>

      {/* ── Invite form panel ── */}
      {showInviteForm && (
        <div
          className="rounded-2xl border mb-8 overflow-hidden"
          style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.04)" }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(124,58,237,0.2)" }}>
            <div>
              <p className="text-sm font-bold text-white">Invite New User</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                Creates a pending account. Access is granted automatically when they sign in with Google.
              </p>
            </div>
            <button onClick={() => setShowInviteForm(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
            </button>
          </div>

          <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={labelStyle}>Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputCls}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Email <span style={{ color: "rgba(239,68,68,0.7)" }}>*</span></label>
                <input
                  type="email"
                  required
                  placeholder="teammate@email.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputCls}
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={labelStyle}>Role <span style={{ color: "rgba(239,68,68,0.7)" }}>*</span></label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm((f) => ({ ...f, role: e.target.value }))}
                  className={inputCls}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r} style={{ background: "#1a1a1a" }}>
                      {ROLE_DISPLAY[r]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Workspace <span style={{ color: "rgba(239,68,68,0.7)" }}>*</span></label>
                <select
                  value={inviteForm.workspaceId}
                  onChange={(e) => setInviteForm((f) => ({ ...f, workspaceId: e.target.value }))}
                  className={inputCls}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  {workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id} style={{ background: "#1a1a1a" }}>
                      {ws.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {inviteError && (
              <p className="text-xs" style={{ color: "rgba(239,68,68,0.8)" }}>{inviteError}</p>
            )}

            {inviteResult && (
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {inviteResult.existingUser ? (
                  <p className="text-xs font-semibold" style={{ color: "#4CAF7D" }}>
                    ✓ User already exists — workspace access granted.
                  </p>
                ) : (
                  <p className="text-xs font-semibold" style={{ color: "#4CAF7D" }}>
                    ✓ Pending account created. They&apos;ll get full access when they sign in with Google.
                  </p>
                )}
                {inviteResult.emailSent ? (
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Invite email sent with sign-in link.
                  </p>
                ) : (
                  <div>
                    <p className="text-xs mb-2" style={{ color: "rgba(245,158,11,0.8)" }}>
                      Email invites not configured — share this link manually:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={inviteResult.inviteUrl}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                        className="flex-1 text-xs rounded-lg px-3 py-2 focus:outline-none"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(inviteResult!.inviteUrl)}
                        className="text-xs px-3 py-2 rounded-lg flex-shrink-0 transition-opacity hover:opacity-70"
                        style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
                      >
                        Copy
                      </button>
                      <a
                        href={inviteResult.inviteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg transition-opacity hover:opacity-70"
                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={inviting || !inviteForm.email || !inviteForm.workspaceId}
                className="text-xs px-4 py-2.5 rounded-xl font-semibold disabled:opacity-40 transition-opacity hover:opacity-90"
                style={{ background: "#7C3AED", color: "white" }}
              >
                {inviting ? "Sending…" : "Send Invite"}
              </button>
              <button
                type="button"
                onClick={() => { setShowInviteForm(false); setInviteResult(null); }}
                className="text-xs transition-opacity hover:opacity-70"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-xl border p-6"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              opacity: busy === user.id ? 0.6 : 1,
            }}
          >
            {/* User header */}
            <div className="flex items-center gap-3 mb-5">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
                >
                  {(user.name ?? user.email)[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.name ?? user.email}
                </p>
                <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {user.email}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Platform Partner badge */}
                {user.platformRole === "PLATFORM_PARTNER" && (
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      color: "#C8923A",
                      border: "1px solid rgba(200,146,58,0.4)",
                      background: "rgba(200,146,58,0.08)",
                    }}
                  >
                    Platform Partner
                  </span>
                )}
                {/* Status badge */}
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    color: STATUS_COLORS[user.status] ?? "rgba(255,255,255,0.3)",
                    border: `1px solid ${STATUS_COLORS[user.status] ?? "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  {user.status}
                </span>
              </div>
            </div>

            {/* Role + status controls */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="block text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Role
                </label>
                <select
                  value={user.role}
                  onChange={(e) => updateUser(user.id, { role: e.target.value })}
                  disabled={busy === user.id}
                  className="w-full text-xs rounded-lg px-3 py-2"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>{ROLE_DISPLAY[r]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Account Status
                </label>
                <select
                  value={user.status}
                  onChange={(e) => updateUser(user.id, { status: e.target.value })}
                  disabled={busy === user.id}
                  className="w-full text-xs rounded-lg px-3 py-2"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {["ACTIVE", "AWAY", "BUSY", "OFFLINE"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Platform Partner — admin-only toggle */}
            {isAdmin && (
              <div
                className="flex items-center justify-between rounded-lg px-4 py-3 mb-5"
                style={{ background: "rgba(200,146,58,0.06)", border: "1px solid rgba(200,146,58,0.15)" }}
              >
                <div>
                  <p className="text-xs font-semibold text-white">Platform Partner</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Can access all admin views and workspaces. Cannot delete clients or change billing.
                  </p>
                </div>
                <button
                  onClick={() => togglePlatformPartner(user.id, user.platformRole)}
                  disabled={busy === user.id}
                  className="text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 flex-shrink-0 ml-4"
                  style={
                    user.platformRole === "PLATFORM_PARTNER"
                      ? { background: "rgba(200,146,58,0.2)", color: "#C8923A", border: "1px solid rgba(200,146,58,0.3)" }
                      : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }
                  }
                >
                  {user.platformRole === "PLATFORM_PARTNER" ? "Revoke" : "Grant"}
                </button>
              </div>
            )}

            {/* Workspace memberships */}
            <div className="mb-5">
              <label className="block text-[10px] uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                Workspace Access
              </label>

              {user.workspaceMemberships.length === 0 ? (
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                  No workspaces assigned — user will see the Access Pending screen.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {user.workspaceMemberships.map((m) => (
                    <div
                      key={m.workspace.id}
                      className="flex items-center justify-between rounded-lg px-3 py-2"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {m.workspace.name}
                        <span className="ml-2 text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                          {m.role}
                        </span>
                      </span>
                      <button
                        onClick={() => removeWorkspace(user.id, m.workspace.id)}
                        disabled={busy === user.id}
                        className="text-[10px] transition-opacity hover:opacity-70"
                        style={{ color: "#EF4444" }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assign to workspace */}
            <AssignWorkspaceForm
              userId={user.id}
              workspaces={workspaces}
              currentIds={user.workspaceMemberships.map((m) => m.workspace.id)}
              currentRole={user.role}
              onAssign={assignWorkspace}
              disabled={busy === user.id}
            />

            {/* Danger zone */}
            <div className="mt-4 pt-4 border-t flex justify-end" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <button
                onClick={() => removeAllAccess(user.id)}
                disabled={busy === user.id}
                className="text-xs transition-opacity hover:opacity-70"
                style={{ color: "rgba(239,68,68,0.6)" }}
              >
                Remove all access
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sub-component: assign workspace form ──────────────────────────────────────

function AssignWorkspaceForm({
  userId,
  workspaces,
  currentIds,
  currentRole,
  onAssign,
  disabled,
}: {
  userId: string;
  workspaces: Workspace[];
  currentIds: string[];
  currentRole: string;
  onAssign: (userId: string, workspaceId: string, role: string) => void;
  disabled: boolean;
}) {
  const [wsId, setWsId] = useState("");
  const [role, setRole] = useState(currentRole);
  const available = workspaces.filter((w) => !currentIds.includes(w.id));

  if (available.length === 0) return null;

  return (
    <div
      className="rounded-lg p-3 flex items-end gap-2"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.07)" }}
    >
      <div className="flex-1">
        <label className="block text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
          Assign to workspace
        </label>
        <select
          value={wsId}
          onChange={(e) => setWsId(e.target.value)}
          className="w-full text-xs rounded-lg px-3 py-2"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <option value="">Select workspace…</option>
          {available.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="text-xs rounded-lg px-3 py-2"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {Object.entries({
            CREATIVE_OPS_DIRECTOR: "Creative Ops Director",
            ARTIST_CEO: "Artist / CEO",
            MANAGEMENT: "Management",
            CREATIVE_ASSISTANT: "Creative Assistant",
            PHOTOGRAPHER_VIDEOGRAPHER: "Photographer / Videographer",
            EDITOR: "Editor",
            SOCIAL_MEDIA: "Social Media",
            GRAPHIC_DESIGNER: "Graphic Designer",
            CONTRACTOR: "Contractor",
          }).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => {
          if (!wsId) return;
          onAssign(userId, wsId, role);
          setWsId("");
        }}
        disabled={!wsId || disabled}
        className="text-xs px-4 py-2 rounded-lg font-medium transition-opacity disabled:opacity-30"
        style={{ background: "rgba(200,146,58,0.2)", color: "rgba(200,146,58,0.9)" }}
      >
        Assign
      </button>
    </div>
  );
}

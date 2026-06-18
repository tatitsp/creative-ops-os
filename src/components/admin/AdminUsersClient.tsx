"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  return (
    <div>
      <h1 className="text-lg font-bold text-white mb-1">Users</h1>
      <p className="text-xs mb-8" style={{ color: "rgba(255,255,255,0.3)" }}>
        {users.length} account{users.length !== 1 ? "s" : ""} in the system.
        Assign workspaces and roles here.
      </p>

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

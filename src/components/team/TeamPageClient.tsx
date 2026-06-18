"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Trash2, UserPlus } from "lucide-react";
import type { UserStatus } from "@/types";

export type ApiMember = {
  id: string;
  role: string;
  invitedAt: string;
  joinedAt: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    status: string;
  };
};

interface Props {
  workspaceSlug: string;
  initialMembers: ApiMember[];
  canManage: boolean;
}

export function TeamPageClient({ workspaceSlug, initialMembers, canManage }: Props) {
  const [members, setMembers] = useState<ApiMember[]>(initialMembers);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("CREATIVE_ASSISTANT");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceSlug}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to add member");
      } else {
        setMembers((prev) => [...prev, data.member as ApiMember]);
        setEmail("");
        setRole("CREATIVE_ASSISTANT");
        setShowForm(false);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(userId: string) {
    const res = await fetch(`/api/workspaces/${workspaceSlug}/members/${userId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.user.id !== userId));
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    const res = await fetch(`/api/workspaces/${workspaceSlug}/members/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      const data = await res.json();
      setMembers((prev) =>
        prev.map((m) => (m.user.id === userId ? (data.member as ApiMember) : m))
      );
    }
  }

  const ROLES = [
    "ARTIST_CEO",
    "MANAGEMENT",
    "CREATIVE_OPS_DIRECTOR",
    "CREATIVE_ASSISTANT",
    "PHOTOGRAPHER_VIDEOGRAPHER",
    "EDITOR",
    "SOCIAL_MEDIA",
    "GRAPHIC_DESIGNER",
    "CONTRACTOR",
  ];

  return (
    <div className="p-6 animate-in max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-subheading">Team Members</h2>
          <p className="text-xs text-ink-tertiary mt-0.5">{members.length} member{members.length !== 1 ? "s" : ""}</p>
        </div>
        {canManage && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            onClick={() => setShowForm((v) => !v)}
          >
            Add Member
          </Button>
        )}
      </div>

      {/* Add member form */}
      {showForm && canManage && (
        <div className="card p-4 mb-4 space-y-3">
          <h3 className="text-sm font-semibold text-ink">Add by email</h3>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <form onSubmit={handleAdd} className="space-y-3">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="team@example.com"
              className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong transition-colors"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong transition-colors"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button type="submit" size="sm" variant="primary" disabled={submitting}>
                {submitting ? "Adding…" : "Add Member"}
              </Button>
              <Button type="button" size="sm" variant="secondary" onClick={() => { setShowForm(false); setError(null); }}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Member list */}
      <div className="space-y-2">
        {members.map((member) => {
          const avatarUser = {
            name: member.user.name ?? member.user.email,
            image: member.user.image ?? undefined,
            status: (member.user.status ?? "ACTIVE") as UserStatus,
          };
          return (
            <div key={member.id} className="card p-4 flex items-center gap-4">
              <Avatar user={avatarUser} size="md" showStatus />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">
                  {member.user.name ?? member.user.email}
                </p>
                <p className="text-xs text-ink-tertiary">{member.user.email}</p>
              </div>
              {canManage ? (
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.user.id, e.target.value)}
                  className="bg-canvas-100 border border-border rounded-lg px-2 py-1 text-xs text-ink outline-none focus:border-border-strong transition-colors"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
                  ))}
                </select>
              ) : (
                <p className="text-xs text-ink-tertiary">{member.role.replace(/_/g, " ")}</p>
              )}
              {canManage && (
                <button
                  onClick={() => handleRemove(member.user.id)}
                  className="text-ink-tertiary hover:text-rose-400 transition-colors"
                  aria-label="Remove member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

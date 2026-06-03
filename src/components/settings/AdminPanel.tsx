"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { MOCK_USERS } from "@/lib/mock-data";
import { WORKSPACES } from "@/lib/workspaces";
import { ROLE_LABELS } from "@/lib/constants";
import type { User } from "@/types";
import type { Workspace } from "@/lib/workspaces";
import {
  Music2, Users, ShieldCheck, Pencil, Trash2, Plus,
  X, Check, Send, ChevronRight, Instagram, Twitter,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AdminSection = "Artists" | "Team" | "Roles";

type UserRole = User["role"];

// ─── Local state types ────────────────────────────────────────────────────────

interface ArtistEntry {
  id: string;
  name: string;
  photo: string;
  genre: string;
  instagram: string;
  twitter: string;
  spotify: string;
  slug: string;
  monthlyListeners: string;
}

interface TeamEntry {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image: string;
  status: string;
  timezone: string;
  displayName?: string;
}

// ─── Seed from existing data ──────────────────────────────────────────────────

function workspaceToArtist(ws: Workspace): ArtistEntry {
  return {
    id: ws.slug,
    name: ws.artistName,
    photo: ws.photo,
    genre: ws.genre,
    instagram: ws.artistHandle,
    twitter: ws.artistHandle,
    spotify: "",
    slug: ws.slug,
    monthlyListeners: ws.monthlyListeners,
  };
}

const INITIAL_ARTISTS: ArtistEntry[] = WORKSPACES.map(workspaceToArtist);

const INITIAL_TEAM: TeamEntry[] = MOCK_USERS.map((u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  image: u.image ?? "",
  status: u.status,
  timezone: u.timezone ?? "America/Chicago",
  displayName: u.displayName,
}));

const ADMIN_SECTIONS: { icon: React.ElementType; label: AdminSection }[] = [
  { icon: Music2, label: "Artists" },
  { icon: Users, label: "Team" },
  { icon: ShieldCheck, label: "Roles" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function AvatarImg({ src, name, size = 8 }: { src: string; name: string; size?: number }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`w-${size} h-${size} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-gold-50 flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-xs font-bold text-gold">{initials(name)}</span>
    </div>
  );
}

// ─── Empty form defaults ──────────────────────────────────────────────────────

const BLANK_ARTIST: Omit<ArtistEntry, "id"> = {
  name: "",
  photo: "",
  genre: "",
  instagram: "",
  twitter: "",
  spotify: "",
  slug: "",
  monthlyListeners: "",
};

const BLANK_MEMBER: Omit<TeamEntry, "id"> = {
  name: "",
  email: "",
  role: "CREATIVE_ASSISTANT",
  image: "",
  status: "ACTIVE",
  timezone: "America/Chicago",
  displayName: "",
};

// ─── Artists Section ──────────────────────────────────────────────────────────

function ArtistsSection({ showToast }: { showToast: (msg: string) => void }) {
  const [artists, setArtists] = useState<ArtistEntry[]>(INITIAL_ARTISTS);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ArtistEntry, "id">>(BLANK_ARTIST);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);

  function openAdd() {
    setForm(BLANK_ARTIST);
    setEditId(null);
    setAdding(true);
  }

  function openEdit(artist: ArtistEntry) {
    setForm({ ...artist });
    setEditId(artist.id);
    setAdding(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;
    if (editId) {
      setArtists((prev) =>
        prev.map((a) => (a.id === editId ? { ...form, id: editId } : a)),
      );
      showToast(`${form.name} updated`);
    } else {
      const slug = form.name.toLowerCase().replace(/\s+/g, "-");
      setArtists((prev) => [...prev, { ...form, id: slug, slug }]);
      showToast(`${form.name} workspace created`);
    }
    setAdding(false);
    setEditId(null);
  }

  function handleRemove(id: string) {
    setArtists((prev) => prev.filter((a) => a.id !== id));
    setRemoveConfirm(null);
    showToast("Artist workspace removed");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-heading">Artists</h3>
          <p className="text-xs text-ink-tertiary mt-1">
            Each artist gets their own workspace in SCOPE.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={openAdd}
        >
          Add artist
        </Button>
      </div>

      {/* Artist list */}
      <div className="space-y-3">
        {artists.map((artist) => (
          <div key={artist.id} className="card p-4 flex items-center gap-4">
            <AvatarImg src={artist.photo} name={artist.name} size={10} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{artist.name}</p>
              <p className="text-xs text-ink-tertiary">{artist.genre}</p>
              <div className="flex items-center gap-3 mt-1">
                {artist.instagram && (
                  <span className="flex items-center gap-1 text-2xs text-ink-tertiary">
                    <Instagram className="w-3 h-3" />
                    {artist.instagram}
                  </span>
                )}
                {artist.spotify && (
                  <span className="flex items-center gap-1 text-2xs text-ink-tertiary">
                    <ExternalLink className="w-3 h-3" />
                    Spotify
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => openEdit(artist)}
                className="p-1.5 rounded-lg text-ink-tertiary hover:text-ink hover:bg-canvas-100 transition-colors"
                title="Edit artist"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              {removeConfirm === artist.id ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-rose-500">Remove?</span>
                  <button
                    onClick={() => handleRemove(artist.id)}
                    className="text-xs font-medium text-rose-500 hover:text-rose-400 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setRemoveConfirm(null)}
                    className="text-xs text-ink-tertiary hover:text-ink transition-colors"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setRemoveConfirm(artist.id)}
                  className="p-1.5 rounded-lg text-ink-tertiary hover:text-rose-500 hover:bg-rose-50/10 transition-colors"
                  title="Remove artist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit modal */}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-canvas-50 border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in">
            <div className="flex items-center justify-between">
              <h2 className="text-heading">{editId ? "Edit Artist" : "Add Artist"}</h2>
              <button
                onClick={() => setAdding(false)}
                className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors"
              >
                <X className="w-4 h-4 text-ink-tertiary" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-label block mb-1.5">Artist name *</label>
                  <input
                    className="input-base"
                    placeholder="e.g. Lil Tony Official"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    autoFocus
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-label block mb-1.5">Photo URL</label>
                  <input
                    className="input-base"
                    placeholder="https://..."
                    value={form.photo}
                    onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-label block mb-1.5">Genre</label>
                  <input
                    className="input-base"
                    placeholder="e.g. Hip-Hop"
                    value={form.genre}
                    onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-label block mb-1.5">Monthly listeners</label>
                  <input
                    className="input-base"
                    placeholder="e.g. 1,273,747"
                    value={form.monthlyListeners}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, monthlyListeners: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-label block mb-1.5">Instagram handle</label>
                  <input
                    className="input-base"
                    placeholder="@handle"
                    value={form.instagram}
                    onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-label block mb-1.5">Twitter / X handle</label>
                  <input
                    className="input-base"
                    placeholder="@handle"
                    value={form.twitter}
                    onChange={(e) => setForm((f) => ({ ...f, twitter: e.target.value }))}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-label block mb-1.5">Spotify URL</label>
                  <input
                    className="input-base"
                    placeholder="https://open.spotify.com/artist/..."
                    value={form.spotify}
                    onChange={(e) => setForm((f) => ({ ...f, spotify: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setAdding(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={handleSave}
                disabled={!form.name.trim()}
              >
                {editId ? "Save changes" : "Create workspace"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Team Members Section ─────────────────────────────────────────────────────

function TeamSection({ showToast }: { showToast: (msg: string) => void }) {
  const [members, setMembers] = useState<TeamEntry[]>(INITIAL_TEAM);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [form, setForm] = useState<Omit<TeamEntry, "id">>(BLANK_MEMBER);
  const [inviteSent, setInviteSent] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);

  function handleSendInvite() {
    if (!form.name.trim() || !form.email.trim()) return;
    setInviteSent(true);
    setTimeout(() => {
      const newMember: TeamEntry = {
        ...form,
        id: `u${Date.now()}`,
      };
      setMembers((prev) => [...prev, newMember]);
      setInviteOpen(false);
      setInviteSent(false);
      setForm(BLANK_MEMBER);
      showToast(`Invite sent to ${form.email}`);
    }, 1400);
  }

  function handleRemove(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setRemoveConfirm(null);
    showToast("Team member removed");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-heading">Team Members</h3>
          <p className="text-xs text-ink-tertiary mt-1">
            Members log in with Google and are assigned to the workspace.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setInviteOpen(true)}
        >
          Invite member
        </Button>
      </div>

      {/* Team list */}
      <div className="space-y-2">
        {members.map((member) => {
          const mockUser = {
            id: member.id,
            name: member.name,
            email: member.email,
            image: member.image || undefined,
            role: member.role,
            status: member.status as "ACTIVE" | "AWAY" | "BUSY" | "OFFLINE",
            timezone: member.timezone,
          };
          return (
            <div key={member.id} className="card p-3.5 flex items-center gap-3">
              <Avatar user={mockUser} size="sm" showStatus />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{member.name}</p>
                <p className="text-xs text-ink-tertiary truncate">{member.email}</p>
              </div>
              <span className="text-2xs font-medium px-2 py-0.5 rounded-full bg-canvas-100 text-ink-secondary flex-shrink-0">
                {ROLE_LABELS[member.role]}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                {removeConfirm === member.id ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-rose-500">Remove?</span>
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="text-xs font-medium text-rose-500 hover:text-rose-400"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setRemoveConfirm(null)}
                      className="text-xs text-ink-tertiary hover:text-ink"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setRemoveConfirm(member.id)}
                    className="p-1.5 rounded-lg text-ink-tertiary hover:text-rose-500 hover:bg-rose-50/10 transition-colors"
                    title="Remove member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-canvas-50 border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 animate-in">
            <div className="flex items-center justify-between">
              <h2 className="text-heading">Invite Team Member</h2>
              <button
                onClick={() => { setInviteOpen(false); setInviteSent(false); }}
                className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors"
              >
                <X className="w-4 h-4 text-ink-tertiary" />
              </button>
            </div>

            {inviteSent ? (
              <div className="py-8 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Check className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-ink">Invite sent!</p>
                <p className="text-xs text-ink-tertiary">{form.email}</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="text-label block mb-1.5">Full name</label>
                    <input
                      className="input-base"
                      placeholder="e.g. Jordan Williams"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-label block mb-1.5">Email address</label>
                    <input
                      className="input-base"
                      type="email"
                      placeholder="team@studio.io"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-label block mb-1.5">Role</label>
                    <select
                      className="input-base"
                      value={form.role}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, role: e.target.value as UserRole }))
                      }
                    >
                      {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(
                        ([role, label]) => (
                          <option key={role} value={role}>
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => setInviteOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    leftIcon={<Send className="w-3 h-3" />}
                    onClick={handleSendInvite}
                    disabled={!form.name.trim() || !form.email.trim()}
                  >
                    Send invite
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Roles Section ────────────────────────────────────────────────────────────

function RolesSection({ showToast }: { showToast: (msg: string) => void }) {
  const [members, setMembers] = useState<TeamEntry[]>(INITIAL_TEAM);

  function changeRole(id: string, role: UserRole) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    const member = members.find((m) => m.id === id);
    if (member) showToast(`${member.name} → ${ROLE_LABELS[role]}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-heading">Manage Roles</h3>
        <p className="text-xs text-ink-tertiary mt-1">
          Change team members&apos; roles and access levels.
        </p>
      </div>

      <div className="space-y-2">
        {members.map((member) => {
          const mockUser = {
            id: member.id,
            name: member.name,
            email: member.email,
            image: member.image || undefined,
            role: member.role,
            status: member.status as "ACTIVE" | "AWAY" | "BUSY" | "OFFLINE",
            timezone: member.timezone,
          };
          return (
            <div key={member.id} className="card p-3.5 flex items-center gap-3">
              <Avatar user={mockUser} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{member.name}</p>
                <p className="text-xs text-ink-tertiary truncate">{member.email}</p>
              </div>
              <div className="flex-shrink-0">
                <select
                  className="input-base py-1 text-xs"
                  value={member.role}
                  onChange={(e) => changeRole(member.id, e.target.value as UserRole)}
                >
                  {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(
                    ([role, label]) => (
                      <option key={role} value={role}>
                        {label}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-4 border-border bg-canvas-100/30">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-ink">Role access levels</p>
            <ul className="mt-2 space-y-1">
              {[
                ["Creative Ops Director", "Full access to all workspaces and settings"],
                ["Artist / CEO", "Own workspace, content approval, analytics"],
                ["Management", "Budget, approvals, releases, analytics"],
                ["Creative Assistant", "Content, assets, calendar"],
                ["Editor / Photo / Social", "Content pipeline and assigned tasks"],
              ].map(([role, desc]) => (
                <li key={role} className="flex items-start gap-2">
                  <ChevronRight className="w-3 h-3 text-ink-tertiary flex-shrink-0 mt-0.5" />
                  <span className="text-2xs text-ink-tertiary">
                    <span className="font-medium text-ink-secondary">{role}:</span> {desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main AdminPanel export ───────────────────────────────────────────────────

export function AdminPanel() {
  const [section, setSection] = useState<AdminSection>("Artists");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="text-heading">Admin</h2>
          <p className="text-xs text-ink-tertiary mt-1">
            Manage artists, team members, and access. Visible only to you.
          </p>
        </div>

        {/* Sub-nav tabs */}
        <div className="flex gap-1 bg-canvas-100 p-1 rounded-xl w-fit">
          {ADMIN_SECTIONS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setSection(label)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                section === label
                  ? "bg-canvas-50 text-gold shadow-sm"
                  : "text-ink-tertiary hover:text-ink",
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Section content */}
        {section === "Artists" && <ArtistsSection showToast={showToast} />}
        {section === "Team" && <TeamSection showToast={showToast} />}
        {section === "Roles" && <RolesSection showToast={showToast} />}
      </div>
    </>
  );
}

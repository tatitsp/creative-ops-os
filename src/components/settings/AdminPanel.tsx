"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { MOCK_USERS, MOCK_CONTENT } from "@/lib/mock-data";
import { WORKSPACES } from "@/lib/workspaces";
import { ROLE_LABELS, CONTENT_PHASES } from "@/lib/constants";
import type { User, ContentItem, ContentPhase, ContentType } from "@/types";
import type { Workspace } from "@/lib/workspaces";
import {
  Music2, Users, ShieldCheck, Pencil, Trash2, Plus,
  X, Check, Send, ChevronRight, Instagram,
  ExternalLink, Settings2, Film, ImageIcon,
  Folder, FolderOpen, FileText, Archive,
  MoveRight, MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Section types ────────────────────────────────────────────────────────────

type AdminSection = "Artists" | "Team" | "Roles" | "Workspaces" | "Content" | "Media";

type UserRole = User["role"];

// ─── Artist entry ─────────────────────────────────────────────────────────────

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
  location: string;
  bio: string;
}

function workspaceToArtist(ws: Workspace): ArtistEntry {
  return {
    id: ws.slug,
    slug: ws.slug,
    name: ws.artistName,
    photo: ws.photo,
    genre: ws.genre,
    instagram: ws.artistHandle,
    twitter: ws.artistHandle,
    spotify: "",
    monthlyListeners: ws.monthlyListeners,
    location: ws.location,
    bio: "",
  };
}

// ─── Team entry ───────────────────────────────────────────────────────────────

interface TeamEntry {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image: string;
  status: string;
  timezone: string;
  displayName?: string;
  access: "active" | "revoked";
}

// ─── Workspace config ─────────────────────────────────────────────────────────

interface WorkspaceConfig {
  id: string;
  artistName: string;
  slug: string;
  brandColor: string;
  coverImage: string;
  location: string;
  genre: string;
  activeRelease: string;
  releaseType: string;
}

// ─── Media file ───────────────────────────────────────────────────────────────

type MediaFileType = "image" | "video" | "audio" | "document";

interface MediaFile {
  id: string;
  name: string;
  folder: string;
  type: MediaFileType;
  size: string;
  url: string;
  artist: string;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

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
  access: "active" as const,
}));

const INITIAL_WORKSPACES: WorkspaceConfig[] = WORKSPACES.map((ws) => ({
  id: ws.slug,
  artistName: ws.artistName,
  slug: ws.slug,
  brandColor: "#C9A84C",
  coverImage: ws.photo,
  location: ws.location,
  genre: ws.genre,
  activeRelease: ws.activeRelease,
  releaseType: ws.releaseType,
}));

const INITIAL_CONTENT: ContentItem[] = MOCK_CONTENT.map((c) => ({ ...c }));

const INITIAL_MEDIA: MediaFile[] = [
  { id: "m1", name: "elijah-cover-art.jpg", folder: "Album Artwork", type: "image", size: "2.4 MB", url: "", artist: "Lil Tony Official" },
  { id: "m2", name: "gravity-mv-thumbnail.jpg", folder: "Video Assets", type: "image", size: "1.1 MB", url: "", artist: "Lil Tony Official" },
  { id: "m3", name: "gravity-official-mv.mp4", folder: "Video Assets", type: "video", size: "847 MB", url: "", artist: "Lil Tony Official" },
  { id: "m4", name: "lil-tony-press-photo-01.jpg", folder: "Press", type: "image", size: "3.8 MB", url: "", artist: "Lil Tony Official" },
  { id: "m5", name: "lil-tony-press-photo-02.jpg", folder: "Press", type: "image", size: "4.1 MB", url: "", artist: "Lil Tony Official" },
  { id: "m6", name: "elijah-stems-final.zip", folder: "Audio", type: "audio", size: "512 MB", url: "", artist: "Lil Tony Official" },
  { id: "m7", name: "social-template-story.psd", folder: "Templates", type: "document", size: "28 MB", url: "", artist: "Lil Tony Official" },
  { id: "m8", name: "caam1k-eoe-cover.jpg", folder: "Album Artwork", type: "image", size: "2.2 MB", url: "", artist: "Caam1k" },
  { id: "m9", name: "caam1k-bts-shoot.jpg", folder: "Photos", type: "image", size: "5.3 MB", url: "", artist: "Caam1k" },
];

const FOLDERS = ["Album Artwork", "Video Assets", "Photos", "Press", "Audio", "Templates"];

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-[60] bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in">
      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      {msg}
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }
  return { toast, showToast };
}

function AvatarImg({ src, name, size = 8 }: { src: string; name: string; size?: number }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  if (src) {
    return <img src={src} alt={name} className={`w-${size} h-${size} rounded-full object-cover flex-shrink-0`} />;
  }
  return (
    <div className={`w-${size} h-${size} rounded-full bg-gold-50 flex items-center justify-center flex-shrink-0`}>
      <span className="text-xs font-bold text-gold">{initials}</span>
    </div>
  );
}

function SectionHeader({
  title, desc, action,
}: { title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-heading">{title}</h3>
        <p className="text-xs text-ink-tertiary mt-1">{desc}</p>
      </div>
      {action}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-canvas-50 border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-heading">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
            <X className="w-4 h-4 text-ink-tertiary" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── 1. Artists Section ───────────────────────────────────────────────────────

const BLANK_ARTIST: Omit<ArtistEntry, "id"> = {
  name: "", photo: "", genre: "", instagram: "", twitter: "",
  spotify: "", slug: "", monthlyListeners: "", location: "", bio: "",
};

function ArtistsSection() {
  const { toast, showToast } = useToast();
  const [artists, setArtists] = useState<ArtistEntry[]>(INITIAL_ARTISTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ArtistEntry, "id">>(BLANK_ARTIST);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);

  function f(k: keyof typeof BLANK_ARTIST) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));
  }

  function openAdd() { setForm(BLANK_ARTIST); setEditId(null); setModalOpen(true); }
  function openEdit(a: ArtistEntry) { setForm({ ...a }); setEditId(a.id); setModalOpen(true); }

  function handleSave() {
    if (!form.name.trim()) return;
    if (editId) {
      setArtists((prev) => prev.map((a) => (a.id === editId ? { ...form, id: editId } : a)));
      showToast(`${form.name} updated`);
    } else {
      const slug = form.name.toLowerCase().replace(/\s+/g, "-");
      setArtists((prev) => [...prev, { ...form, id: slug, slug }]);
      showToast(`${form.name} workspace created`);
    }
    setModalOpen(false);
  }

  function handleRemove(id: string) {
    const name = artists.find((a) => a.id === id)?.name ?? "Artist";
    setArtists((prev) => prev.filter((a) => a.id !== id));
    setRemoveConfirm(null);
    showToast(`${name} removed`);
  }

  return (
    <>
      {toast && <Toast msg={toast} />}
      <div className="space-y-5">
        <SectionHeader
          title="Artists"
          desc="Each artist gets their own workspace in SCOPE."
          action={
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={openAdd}>
              Add artist
            </Button>
          }
        />

        <div className="space-y-3">
          {artists.map((artist) => (
            <div key={artist.id} className="card p-4 flex items-center gap-4">
              <AvatarImg src={artist.photo} name={artist.name} size={10} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{artist.name}</p>
                <p className="text-xs text-ink-tertiary">{artist.genre} · {artist.location}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {artist.instagram && (
                    <span className="flex items-center gap-1 text-2xs text-ink-tertiary">
                      <Instagram className="w-3 h-3" />{artist.instagram}
                    </span>
                  )}
                  {artist.spotify && (
                    <span className="flex items-center gap-1 text-2xs text-ink-tertiary">
                      <ExternalLink className="w-3 h-3" />Spotify
                    </span>
                  )}
                  {artist.monthlyListeners && (
                    <span className="text-2xs text-ink-tertiary">{artist.monthlyListeners} monthly listeners</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(artist)} className="p-1.5 rounded-lg text-ink-tertiary hover:text-ink hover:bg-canvas-100 transition-colors" title="Edit">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                {removeConfirm === artist.id ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-rose-500">Remove?</span>
                    <button onClick={() => handleRemove(artist.id)} className="text-xs font-medium text-rose-500 hover:text-rose-400">Yes</button>
                    <button onClick={() => setRemoveConfirm(null)} className="text-xs text-ink-tertiary hover:text-ink">No</button>
                  </div>
                ) : (
                  <button onClick={() => setRemoveConfirm(artist.id)} className="p-1.5 rounded-lg text-ink-tertiary hover:text-rose-500 hover:bg-rose-50/10 transition-colors" title="Remove">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <Modal title={editId ? "Edit Artist" : "Add Artist"} onClose={() => setModalOpen(false)}>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-label block mb-1.5">Artist name *</label>
                <input className="input-base" placeholder="e.g. Lil Tony Official" value={form.name} onChange={f("name")} autoFocus />
              </div>
              <div className="sm:col-span-2">
                <label className="text-label block mb-1.5">Photo URL</label>
                <input className="input-base" placeholder="https://..." value={form.photo} onChange={f("photo")} />
              </div>
              <div>
                <label className="text-label block mb-1.5">Genre</label>
                <input className="input-base" placeholder="e.g. Hip-Hop" value={form.genre} onChange={f("genre")} />
              </div>
              <div>
                <label className="text-label block mb-1.5">Location</label>
                <input className="input-base" placeholder="e.g. Atlanta, GA" value={form.location} onChange={f("location")} />
              </div>
              <div>
                <label className="text-label block mb-1.5">Monthly listeners</label>
                <input className="input-base" placeholder="e.g. 1,273,747" value={form.monthlyListeners} onChange={f("monthlyListeners")} />
              </div>
              <div>
                <label className="text-label block mb-1.5">Instagram</label>
                <input className="input-base" placeholder="@handle" value={form.instagram} onChange={f("instagram")} />
              </div>
              <div>
                <label className="text-label block mb-1.5">Twitter / X</label>
                <input className="input-base" placeholder="@handle" value={form.twitter} onChange={f("twitter")} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-label block mb-1.5">Spotify URL</label>
                <input className="input-base" placeholder="https://open.spotify.com/artist/..." value={form.spotify} onChange={f("spotify")} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-label block mb-1.5">Bio</label>
                <textarea className="input-base resize-none" rows={3} placeholder="Short artist bio..." value={form.bio} onChange={f("bio")} />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" className="flex-1" onClick={handleSave} disabled={!form.name.trim()}>
              {editId ? "Save changes" : "Create workspace"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── 2. Team Section ──────────────────────────────────────────────────────────

const BLANK_MEMBER: Omit<TeamEntry, "id"> = {
  name: "", email: "", role: "CREATIVE_ASSISTANT", image: "",
  status: "ACTIVE", timezone: "America/Chicago", displayName: "", access: "active",
};

function TeamSection() {
  const { toast, showToast } = useToast();
  const [members, setMembers] = useState<TeamEntry[]>(INITIAL_TEAM);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [form, setForm] = useState<Omit<TeamEntry, "id">>(BLANK_MEMBER);
  const [inviteSent, setInviteSent] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);

  function handleSendInvite() {
    if (!form.name.trim() || !form.email.trim()) return;
    setInviteSent(true);
    setTimeout(() => {
      setMembers((prev) => [...prev, { ...form, id: `u${Date.now()}` }]);
      setInviteOpen(false);
      setInviteSent(false);
      setForm(BLANK_MEMBER);
      showToast(`Invite sent to ${form.email}`);
    }, 1400);
  }

  function toggleAccess(id: string) {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const next = m.access === "active" ? "revoked" : "active";
        showToast(`${m.name} access ${next}`);
        return { ...m, access: next };
      }),
    );
  }

  function handleRemove(id: string) {
    const name = members.find((m) => m.id === id)?.name ?? "Member";
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setRemoveConfirm(null);
    showToast(`${name} removed`);
  }

  return (
    <>
      {toast && <Toast msg={toast} />}
      <div className="space-y-5">
        <SectionHeader
          title="Team Members"
          desc="Invite members and control their access."
          action={
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setInviteOpen(true)}>
              Invite member
            </Button>
          }
        />

        <div className="space-y-2">
          {members.map((member) => {
            const mockUser = {
              id: member.id, name: member.name, email: member.email,
              image: member.image || undefined, role: member.role,
              status: member.status as "ACTIVE" | "AWAY" | "BUSY" | "OFFLINE",
              timezone: member.timezone,
            };
            return (
              <div key={member.id} className={cn("card p-3.5 flex items-center gap-3", member.access === "revoked" && "opacity-50")}>
                <Avatar user={mockUser} size="sm" showStatus />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{member.name}</p>
                  <p className="text-xs text-ink-tertiary truncate">{member.email}</p>
                </div>
                <span className="text-2xs font-medium px-2 py-0.5 rounded-full bg-canvas-100 text-ink-secondary flex-shrink-0 hidden sm:inline">
                  {ROLE_LABELS[member.role]}
                </span>
                {member.access === "revoked" && (
                  <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-rose-50/20 text-rose-500 flex-shrink-0">
                    Revoked
                  </span>
                )}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleAccess(member.id)}
                    className={cn(
                      "text-2xs font-medium px-2 py-1 rounded-lg transition-colors",
                      member.access === "active"
                        ? "text-ink-tertiary hover:text-rose-500 hover:bg-rose-50/10"
                        : "text-emerald-500 hover:bg-emerald-50/10",
                    )}
                    title={member.access === "active" ? "Revoke access" : "Restore access"}
                  >
                    {member.access === "active" ? "Revoke" : "Restore"}
                  </button>
                  {removeConfirm === member.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-rose-500">Remove?</span>
                      <button onClick={() => handleRemove(member.id)} className="text-xs font-medium text-rose-500">Yes</button>
                      <button onClick={() => setRemoveConfirm(null)} className="text-xs text-ink-tertiary">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setRemoveConfirm(member.id)} className="p-1.5 rounded-lg text-ink-tertiary hover:text-rose-500 hover:bg-rose-50/10 transition-colors" title="Remove">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {inviteOpen && (
        <Modal title="Invite Team Member" onClose={() => { setInviteOpen(false); setInviteSent(false); }}>
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
                  <input className="input-base" placeholder="e.g. Jordan Williams" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} autoFocus />
                </div>
                <div>
                  <label className="text-label block mb-1.5">Email address</label>
                  <input className="input-base" type="email" placeholder="team@studio.io" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="text-label block mb-1.5">Role</label>
                  <select className="input-base" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}>
                    {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([role, label]) => (
                      <option key={role} value={role}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setInviteOpen(false)}>Cancel</Button>
                <Button variant="primary" size="sm" className="flex-1" leftIcon={<Send className="w-3 h-3" />} onClick={handleSendInvite} disabled={!form.name.trim() || !form.email.trim()}>
                  Send invite
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}

// ─── 3. Roles Section ─────────────────────────────────────────────────────────

function RolesSection() {
  const { toast, showToast } = useToast();
  const [members, setMembers] = useState<TeamEntry[]>(INITIAL_TEAM);

  function changeRole(id: string, role: UserRole) {
    const name = members.find((m) => m.id === id)?.name ?? "Member";
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    showToast(`${name} → ${ROLE_LABELS[role]}`);
  }

  return (
    <>
      {toast && <Toast msg={toast} />}
      <div className="space-y-5">
        <SectionHeader title="Manage Roles" desc="Change team members' roles and access levels." />
        <div className="space-y-2">
          {members.map((member) => {
            const mockUser = {
              id: member.id, name: member.name, email: member.email,
              image: member.image || undefined, role: member.role,
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
                <select
                  className="input-base py-1 text-xs flex-shrink-0 w-32 sm:w-44"
                  value={member.role}
                  onChange={(e) => changeRole(member.id, e.target.value as UserRole)}
                >
                  {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([role, label]) => (
                    <option key={role} value={role}>{label}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
        <div className="card p-4 bg-canvas-100/30">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-ink mb-2">Role access levels</p>
              <ul className="space-y-1">
                {[
                  ["Creative Ops Director", "Full access — all workspaces, settings, admin"],
                  ["Artist / CEO", "Own workspace, content approval, analytics"],
                  ["Management", "Budget, approvals, releases, analytics"],
                  ["Creative Assistant", "Content, assets, calendar"],
                  ["Editor / Photo / Social", "Content pipeline and assigned tasks only"],
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
    </>
  );
}

// ─── 4. Workspace Config Section ──────────────────────────────────────────────

function WorkspacesSection() {
  const { toast, showToast } = useToast();
  const [workspaces, setWorkspaces] = useState<WorkspaceConfig[]>(INITIAL_WORKSPACES);
  const [editId, setEditId] = useState<string | null>(null);

  const editing = workspaces.find((w) => w.id === editId) ?? null;

  function update(id: string, key: keyof WorkspaceConfig, value: string) {
    setWorkspaces((prev) => prev.map((w) => (w.id === id ? { ...w, [key]: value } : w)));
  }

  function handleSave() {
    showToast(`${editing?.artistName ?? "Workspace"} saved`);
    setEditId(null);
  }

  if (editId && editing) {
    return (
      <>
        {toast && <Toast msg={toast} />}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <button onClick={() => setEditId(null)} className="text-xs text-ink-tertiary hover:text-ink transition-colors flex items-center gap-1">
              ← Back
            </button>
            <h3 className="text-heading">{editing.artistName}</h3>
          </div>
          <div className="card p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-label block mb-1.5">Artist / Workspace name</label>
                <input className="input-base" value={editing.artistName} onChange={(e) => update(editId, "artistName", e.target.value)} />
              </div>
              <div>
                <label className="text-label block mb-1.5">Genre</label>
                <input className="input-base" value={editing.genre} onChange={(e) => update(editId, "genre", e.target.value)} />
              </div>
              <div>
                <label className="text-label block mb-1.5">Location</label>
                <input className="input-base" value={editing.location} onChange={(e) => update(editId, "location", e.target.value)} />
              </div>
              <div>
                <label className="text-label block mb-1.5">Active release</label>
                <input className="input-base" value={editing.activeRelease} onChange={(e) => update(editId, "activeRelease", e.target.value)} />
              </div>
              <div>
                <label className="text-label block mb-1.5">Release type</label>
                <select className="input-base" value={editing.releaseType} onChange={(e) => update(editId, "releaseType", e.target.value)}>
                  {["Album", "EP", "Single", "Mixtape", "Deluxe"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-label block mb-1.5">Cover image URL</label>
                <input className="input-base" value={editing.coverImage} onChange={(e) => update(editId, "coverImage", e.target.value)} />
              </div>
              <div>
                <label className="text-label block mb-1.5">Brand color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editing.brandColor}
                    onChange={(e) => update(editId, "brandColor", e.target.value)}
                    className="w-10 h-9 rounded-lg border border-border bg-canvas-100 cursor-pointer p-0.5"
                  />
                  <input className="input-base flex-1" value={editing.brandColor} onChange={(e) => update(editId, "brandColor", e.target.value)} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setEditId(null)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSave}>Save workspace</Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {toast && <Toast msg={toast} />}
      <div className="space-y-5">
        <SectionHeader title="Workspace Configuration" desc="Branding and settings per artist workspace." />
        <div className="space-y-3">
          {workspaces.map((ws) => (
            <div key={ws.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-canvas-100 flex-shrink-0">
                {ws.coverImage ? (
                  <img src={ws.coverImage} alt={ws.artistName} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music2 className="w-5 h-5 text-ink-tertiary" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">{ws.artistName}</p>
                <p className="text-xs text-ink-tertiary">{ws.genre} · {ws.location}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="w-3 h-3 rounded-full border border-white/10 flex-shrink-0"
                    style={{ backgroundColor: ws.brandColor }}
                  />
                  <span className="text-2xs text-ink-tertiary">{ws.brandColor}</span>
                  <span className="text-2xs text-ink-tertiary">·</span>
                  <span className="text-2xs text-ink-tertiary">{ws.activeRelease} ({ws.releaseType})</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" leftIcon={<Settings2 className="w-3.5 h-3.5" />} onClick={() => setEditId(ws.id)}>
                Configure
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── 5. Content Management Section ───────────────────────────────────────────

const CONTENT_TYPE_ICON: Record<string, React.ElementType> = {
  VIDEO: Film,
  REEL: Film,
  PHOTO: ImageIcon,
  STORY: ImageIcon,
  CAROUSEL: ImageIcon,
  SHORT: Film,
  OTHER: FileText,
};

const PHASE_COLORS: Record<string, string> = {
  IDEA: "text-ink-tertiary bg-canvas-100",
  PLANNING: "text-sky-400 bg-sky-50/20",
  PRODUCTION: "text-amber-400 bg-amber-50/20",
  EDITING: "text-violet-400 bg-violet-50/20",
  REVIEW: "text-gold bg-gold-50",
  APPROVED: "text-emerald-400 bg-emerald-50/20",
  SCHEDULED: "text-blue-400 bg-blue-50/20",
  POSTED: "text-emerald-500 bg-emerald-50/30",
  ANALYTICS: "text-ink-secondary bg-canvas-100",
  ARCHIVED: "text-ink-tertiary bg-canvas-100",
};

function ContentSection() {
  const { toast, showToast } = useToast();
  const [items, setItems] = useState<ContentItem[]>(INITIAL_CONTENT);
  const [editItem, setEditItem] = useState<ContentItem | null>(null);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);
  const [filterPhase, setFilterPhase] = useState<"ALL" | ContentPhase>("ALL");

  const visible = filterPhase === "ALL" ? items : items.filter((c) => c.phase === filterPhase);
  const activePhases = Array.from(new Set(items.map((c) => c.phase)));

  function handleArchive(id: string) {
    setItems((prev) => prev.map((c) => c.id === id ? { ...c, phase: "ARCHIVED" } : c));
    showToast("Content archived");
  }

  function handleSaveEdit() {
    if (!editItem) return;
    setItems((prev) => prev.map((c) => c.id === editItem.id ? editItem : c));
    showToast(`"${editItem.title}" updated`);
    setEditItem(null);
  }

  function handleRemove(id: string) {
    setItems((prev) => prev.filter((c) => c.id !== id));
    setRemoveConfirm(null);
    showToast("Content item deleted");
  }

  return (
    <>
      {toast && <Toast msg={toast} />}
      <div className="space-y-5">
        <SectionHeader title="Content Management" desc="Edit, archive, or delete any content item across all workspaces." />

        {/* Phase filter */}
        <div className="flex flex-wrap gap-1.5">
          {(["ALL", ...activePhases] as ("ALL" | ContentPhase)[]).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPhase(p)}
              className={cn(
                "text-2xs font-semibold px-2.5 py-1 rounded-full transition-colors",
                filterPhase === p ? "bg-gold text-[#0a0a0a]" : "bg-canvas-100 text-ink-tertiary hover:text-ink",
              )}
            >
              {p === "ALL" ? "All" : p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {visible.map((item) => {
            const Icon = CONTENT_TYPE_ICON[item.type] ?? FileText;
            return (
              <div key={item.id} className={cn("card p-3.5 flex items-center gap-3", item.phase === "ARCHIVED" && "opacity-50")}>
                <div className="w-8 h-8 rounded-lg bg-canvas-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-ink-tertiary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                  <p className="text-xs text-ink-tertiary">{item.campaignName}</p>
                </div>
                <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:inline", PHASE_COLORS[item.phase] ?? "bg-canvas-100 text-ink-tertiary")}>
                  {item.phase.charAt(0) + item.phase.slice(1).toLowerCase()}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setEditItem({ ...item })}
                    className="p-1.5 rounded-lg text-ink-tertiary hover:text-ink hover:bg-canvas-100 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  {item.phase !== "ARCHIVED" && (
                    <button
                      onClick={() => handleArchive(item.id)}
                      className="p-1.5 rounded-lg text-ink-tertiary hover:text-amber-400 hover:bg-amber-50/10 transition-colors"
                      title="Archive"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {removeConfirm === item.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-rose-500">Delete?</span>
                      <button onClick={() => handleRemove(item.id)} className="text-xs font-medium text-rose-500">Yes</button>
                      <button onClick={() => setRemoveConfirm(null)} className="text-xs text-ink-tertiary">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setRemoveConfirm(item.id)} className="p-1.5 rounded-lg text-ink-tertiary hover:text-rose-500 hover:bg-rose-50/10 transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {visible.length === 0 && (
            <p className="text-sm text-ink-tertiary text-center py-8">No content items in this phase.</p>
          )}
        </div>
      </div>

      {/* Edit content modal */}
      {editItem && (
        <Modal title="Edit Content Item" onClose={() => setEditItem(null)}>
          <div className="space-y-3">
            <div>
              <label className="text-label block mb-1.5">Title</label>
              <input
                className="input-base"
                value={editItem.title}
                onChange={(e) => setEditItem((c) => c ? { ...c, title: e.target.value } : c)}
              />
            </div>
            <div>
              <label className="text-label block mb-1.5">Campaign</label>
              <input
                className="input-base"
                value={editItem.campaignName ?? ""}
                onChange={(e) => setEditItem((c) => c ? { ...c, campaignName: e.target.value } : c)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-label block mb-1.5">Type</label>
                <select
                  className="input-base"
                  value={editItem.type}
                  onChange={(e) => setEditItem((c) => c ? { ...c, type: e.target.value as ContentType } : c)}
                >
                  {["PHOTO", "VIDEO", "REEL", "STORY", "CAROUSEL", "SHORT", "PODCAST", "BLOG", "TWEET", "OTHER"].map((t) => (
                    <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-label block mb-1.5">Phase</label>
                <select
                  className="input-base"
                  value={editItem.phase}
                  onChange={(e) => setEditItem((c) => c ? { ...c, phase: e.target.value as ContentPhase } : c)}
                >
                  {CONTENT_PHASES.map(({ phase, label }) => (
                    <option key={phase} value={phase}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-label block mb-1.5">Scheduled date</label>
              <input
                className="input-base"
                type="datetime-local"
                value={String(editItem.scheduledAt ?? "").slice(0, 16)}
                onChange={(e) => setEditItem((c) => c ? { ...c, scheduledAt: e.target.value + ":00Z" } : c)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" className="flex-1" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button variant="primary" size="sm" className="flex-1" onClick={handleSaveEdit}>Save changes</Button>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── 6. Media Management Section ──────────────────────────────────────────────

const FILE_TYPE_ICON: Record<MediaFileType, React.ElementType> = {
  image: ImageIcon,
  video: Film,
  audio: MoreHorizontal,
  document: FileText,
};

function MediaSection() {
  const { toast, showToast } = useToast();
  const [files, setFiles] = useState<MediaFile[]>(INITIAL_MEDIA);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState("");
  const [moveId, setMoveId] = useState<string | null>(null);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);
  const [filterFolder, setFilterFolder] = useState<"All" | string>("All");
  const [filterArtist, setFilterArtist] = useState<"All" | string>("All");

  const artists = Array.from(new Set(files.map((f) => f.artist)));
  const visible = files
    .filter((f) => filterFolder === "All" || f.folder === filterFolder)
    .filter((f) => filterArtist === "All" || f.artist === filterArtist);

  function startRename(file: MediaFile) {
    setRenameId(file.id);
    setRenameName(file.name);
  }

  function confirmRename() {
    if (!renameName.trim() || !renameId) return;
    setFiles((prev) => prev.map((f) => f.id === renameId ? { ...f, name: renameName } : f));
    showToast(`Renamed to "${renameName}"`);
    setRenameId(null);
  }

  function moveFile(id: string, folder: string) {
    const file = files.find((f) => f.id === id);
    setFiles((prev) => prev.map((f) => f.id === id ? { ...f, folder } : f));
    setMoveId(null);
    showToast(`${file?.name ?? "File"} moved to ${folder}`);
  }

  function handleDelete(id: string) {
    const file = files.find((f) => f.id === id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setRemoveConfirm(null);
    showToast(`${file?.name ?? "File"} deleted`);
  }

  return (
    <>
      {toast && <Toast msg={toast} />}
      <div className="space-y-5">
        <SectionHeader title="Media Management" desc="Rename, move, or delete files across all artist vaults." />

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select className="input-base py-1 text-xs flex-1 min-w-[120px]" value={filterArtist} onChange={(e) => setFilterArtist(e.target.value)}>
            <option value="All">All artists</option>
            {artists.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select className="input-base py-1 text-xs flex-1 min-w-[120px]" value={filterFolder} onChange={(e) => setFilterFolder(e.target.value)}>
            <option value="All">All folders</option>
            {FOLDERS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          {visible.map((file) => {
            const Icon = FILE_TYPE_ICON[file.type];
            return (
              <div key={file.id} className="card p-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-canvas-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-ink-tertiary" />
                </div>
                <div className="flex-1 min-w-0">
                  {renameId === file.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="input-base py-0.5 text-xs flex-1"
                        value={renameName}
                        onChange={(e) => setRenameName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") confirmRename(); if (e.key === "Escape") setRenameId(null); }}
                        autoFocus
                      />
                      <button onClick={confirmRename} className="p-1 rounded text-emerald-500 hover:bg-emerald-50/10">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setRenameId(null)} className="p-1 rounded text-ink-tertiary hover:bg-canvas-100">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-ink truncate">{file.name}</p>
                  )}
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-2xs text-ink-tertiary">
                      <Folder className="w-2.5 h-2.5" />{file.folder}
                    </span>
                    <span className="text-2xs text-ink-tertiary">·</span>
                    <span className="text-2xs text-ink-tertiary">{file.artist}</span>
                    <span className="text-2xs text-ink-tertiary">·</span>
                    <span className="text-2xs text-ink-tertiary">{file.size}</span>
                  </div>
                </div>

                {moveId === file.id ? (
                  <div className="flex items-center gap-1.5">
                    <select
                      className="input-base py-0.5 text-xs"
                      defaultValue={file.folder}
                      onChange={(e) => moveFile(file.id, e.target.value)}
                    >
                      {FOLDERS.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <button onClick={() => setMoveId(null)} className="p-1 rounded text-ink-tertiary hover:bg-canvas-100">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => startRename(file)} className="p-1.5 rounded-lg text-ink-tertiary hover:text-ink hover:bg-canvas-100 transition-colors" title="Rename">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setMoveId(file.id)} className="p-1.5 rounded-lg text-ink-tertiary hover:text-ink hover:bg-canvas-100 transition-colors" title="Move to folder">
                      <MoveRight className="w-3.5 h-3.5" />
                    </button>
                    {removeConfirm === file.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-rose-500">Delete?</span>
                        <button onClick={() => handleDelete(file.id)} className="text-xs font-medium text-rose-500">Yes</button>
                        <button onClick={() => setRemoveConfirm(null)} className="text-xs text-ink-tertiary">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setRemoveConfirm(file.id)} className="p-1.5 rounded-lg text-ink-tertiary hover:text-rose-500 hover:bg-rose-50/10 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {visible.length === 0 && (
            <p className="text-sm text-ink-tertiary text-center py-8">No files found.</p>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Main AdminPanel ──────────────────────────────────────────────────────────

const ADMIN_SECTIONS: { icon: React.ElementType; label: AdminSection }[] = [
  { icon: Music2,      label: "Artists"    },
  { icon: Users,       label: "Team"       },
  { icon: ShieldCheck, label: "Roles"      },
  { icon: Settings2,   label: "Workspaces" },
  { icon: Film,        label: "Content"    },
  { icon: FolderOpen,  label: "Media"      },
];

export function AdminPanel() {
  const [section, setSection] = useState<AdminSection>("Artists");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading">Admin</h2>
        <p className="text-xs text-ink-tertiary mt-1">
          Full control over artists, team, workspaces, content, and media. Visible only to you.
        </p>
      </div>

      {/* Sub-nav — wraps on small screens */}
      <div className="flex flex-wrap gap-1 bg-canvas-100 p-1 rounded-xl">
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

      {section === "Artists"    && <ArtistsSection />}
      {section === "Team"       && <TeamSection />}
      {section === "Roles"      && <RolesSection />}
      {section === "Workspaces" && <WorkspacesSection />}
      {section === "Content"    && <ContentSection />}
      {section === "Media"      && <MediaSection />}
    </div>
  );
}

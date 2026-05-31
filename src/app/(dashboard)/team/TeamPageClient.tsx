"use client";

import { useState } from "react";
import { TopBar } from "@/components/navigation/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { MOCK_USERS, MOCK_TASKS } from "@/lib/mock-data";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { UserPlus, Mail, MoreHorizontal, X, Check } from "lucide-react";

const STATUS_DOT: Record<string, string> = {
  ACTIVE: "bg-emerald-500",
  AWAY: "bg-amber-400",
  BUSY: "bg-rose-500",
  OFFLINE: "bg-ink-tertiary",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Active",
  AWAY: "Away",
  BUSY: "Busy",
  OFFLINE: "Offline",
};

const ROLES = Object.entries(ROLE_LABELS) as [keyof typeof ROLE_LABELS, string][];

export function TeamPageClient() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<keyof typeof ROLE_LABELS>("CREATIVE_ASSISTANT");
  const [inviteSent, setInviteSent] = useState(false);
  const [messageUser, setMessageUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleSendInvite() {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    setInviteSent(true);
    setTimeout(() => {
      setInviteOpen(false);
      setInviteSent(false);
      setInviteName("");
      setInviteEmail("");
      showToast(`Invite sent to ${inviteEmail}`);
    }, 1500);
  }

  function handleSendMessage() {
    if (!messageText.trim() || !messageUser) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageUser(null);
      setMessageSent(false);
      setMessageText("");
      showToast(`Message sent to ${messageUser.name.split(" ")[0]}`);
    }, 1200);
  }

  return (
    <div className="min-h-screen">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Invite Modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-canvas-50 border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 animate-in">
            <div className="flex items-center justify-between">
              <h2 className="text-heading">Invite Team Member</h2>
              <button onClick={() => { setInviteOpen(false); setInviteSent(false); }} className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                <X className="w-4 h-4 text-ink-tertiary" />
              </button>
            </div>
            {inviteSent ? (
              <div className="py-6 flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-ink">Invite sent!</p>
                <p className="text-xs text-ink-tertiary">{inviteEmail}</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="text-label block mb-1.5">Full name</label>
                    <input className="input-base" placeholder="e.g. Jordan Williams" value={inviteName} onChange={(e) => setInviteName(e.target.value)} autoFocus />
                  </div>
                  <div>
                    <label className="text-label block mb-1.5">Email address</label>
                    <input className="input-base" type="email" placeholder="team@studio.io" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-label block mb-1.5">Role</label>
                    <select
                      className="input-base"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as keyof typeof ROLE_LABELS)}
                    >
                      {ROLES.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => setInviteOpen(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" className="flex-1" onClick={handleSendInvite} disabled={!inviteName.trim() || !inviteEmail.trim()}>
                    Send invite
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-canvas-50 border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 animate-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar user={messageUser} size="sm" />
                <div>
                  <h2 className="text-sm font-semibold text-ink">{messageUser.name}</h2>
                  <p className="text-xs text-ink-tertiary">{ROLE_LABELS[messageUser.role]}</p>
                </div>
              </div>
              <button onClick={() => { setMessageUser(null); setMessageSent(false); setMessageText(""); }} className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                <X className="w-4 h-4 text-ink-tertiary" />
              </button>
            </div>
            {messageSent ? (
              <div className="py-6 flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-ink">Message sent!</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-label block mb-1.5">Message</label>
                  <textarea
                    className="input-base resize-none"
                    rows={4}
                    placeholder={`Send a message to ${messageUser.name.split(" ")[0]}...`}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => { setMessageUser(null); setMessageText(""); }}>Cancel</Button>
                  <Button variant="primary" size="sm" className="flex-1" leftIcon={<Mail className="w-3 h-3" />} onClick={handleSendMessage} disabled={!messageText.trim()}>
                    Send
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <TopBar
        title="Team"
        subtitle={`${MOCK_USERS.length} members`}
        actions={
          <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-3.5 h-3.5" />} onClick={() => setInviteOpen(true)}>
            Invite member
          </Button>
        }
      />

      <div className="p-6 space-y-6 animate-in">
        {/* Role summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {(["ARTIST_CEO", "MANAGEMENT", "CREATIVE_OPS_DIRECTOR", "EDITOR", "SOCIAL_MEDIA"] as const).map((role) => {
            const count = MOCK_USERS.filter((u) => u.role === role).length;
            return (
              <div key={role} className="card p-3 text-center">
                <p className="text-lg font-semibold text-ink">{count}</p>
                <p className="text-2xs text-ink-tertiary mt-0.5 leading-tight">{ROLE_LABELS[role]}</p>
              </div>
            );
          })}
        </div>

        {/* Team cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_USERS.map((user) => {
            const userTasks = MOCK_TASKS.filter((t) => t.assignee?.id === user.id && t.status !== "DONE");
            const completedTasks = MOCK_TASKS.filter((t) => t.assignee?.id === user.id && t.status === "DONE");
            const totalTasks = userTasks.length + completedTasks.length;
            const workloadPct = totalTasks > 0 ? Math.round((userTasks.length / Math.max(totalTasks, 5)) * 100) : 0;

            return (
              <div key={user.id} className="card p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar user={user} size="md" showStatus />
                    <div>
                      <p className="text-sm font-semibold text-ink">{user.name}</p>
                      <p className="text-xs text-ink-tertiary">{user.email}</p>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-ink-tertiary" />
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", ROLE_COLORS[user.role])}>
                    {ROLE_LABELS[user.role]}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[user.status])} />
                    <span className="text-xs text-ink-tertiary">{STATUS_LABEL[user.status]}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-secondary">Workload</span>
                    <span className="text-xs text-ink-secondary">
                      {userTasks.length} open · {completedTasks.length} done
                    </span>
                  </div>
                  <Progress
                    value={workloadPct}
                    color={workloadPct >= 90 ? "amber" : workloadPct >= 70 ? "gold" : "emerald"}
                    showLabel
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button size="sm" variant="secondary" className="flex-1" leftIcon={<Mail className="w-3 h-3" />} onClick={() => setMessageUser(user)}>
                    Message
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1" onClick={() => showToast(`Viewing ${user.name.split(" ")[0]}'s work`)}>
                    View work
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { ROLE_LABELS } from "@/lib/constants";
import {
  FileText, BookOpen, UserCheck, MessageSquare, Monitor, Heart,
  CheckCircle2, Lock, ChevronRight, X, Check, Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RoleKey = keyof typeof ROLE_LABELS;

const TRACK_STEPS = [
  { id: "contract", title: "Sign your contract", desc: "Review and sign your team agreement and NDA.", icon: FileText, done: true },
  { id: "workflow", title: "Platform walkthrough", desc: "Learn how SCOPE is structured and how to navigate.", icon: Monitor, done: true },
  { id: "role", title: "Role & responsibilities", desc: "Understand your responsibilities, deliverables, and expectations.", icon: UserCheck, done: true },
  { id: "comms", title: "Communication standards", desc: "Learn response time expectations, channel etiquette, and escalation paths.", icon: MessageSquare, done: false },
  { id: "culture", title: "Culture & wellness overview", desc: "How we protect focus, prevent burnout, and create high-performance peace.", icon: Heart, done: false },
  { id: "tools", title: "System tutorial", desc: "Hands-on walkthrough of campaigns, content pipeline, asset library, and approvals.", icon: BookOpen, done: false },
];

export function OnboardingPageClient() {
  const [steps, setSteps] = useState(TRACK_STEPS);
  const [activeRole, setActiveRole] = useState<RoleKey>("CREATIVE_ASSISTANT");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const completed = steps.filter((s) => s.done).length;
  const pct = Math.round((completed / steps.length) * 100);

  function startStep(id: string) {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: true } : s)),
    );
  }

  function handleRoleChange(role: RoleKey) {
    setActiveRole(role);
    setSteps(TRACK_STEPS.map((s) => ({ ...s, done: s.done })));
  }

  function handleSendInvite() {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    setInviteSent(true);
    setTimeout(() => {
      setInviteOpen(false);
      setInviteSent(false);
      setInviteName("");
      setInviteEmail("");
      setToast(`Onboarding invite sent to ${inviteEmail}`);
      setTimeout(() => setToast(null), 3000);
    }, 1500);
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
              <h2 className="text-heading">Send Onboarding Invite</h2>
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
                    <label className="text-label block mb-1.5">New member name</label>
                    <input className="input-base" placeholder="e.g. Jordan Williams" value={inviteName} onChange={(e) => setInviteName(e.target.value)} autoFocus />
                  </div>
                  <div>
                    <label className="text-label block mb-1.5">Email address</label>
                    <input className="input-base" type="email" placeholder="team@studio.io" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-label block mb-1.5">Onboarding track</label>
                    <select className="input-base" value={activeRole} onChange={(e) => setActiveRole(e.target.value as RoleKey)}>
                      {(Object.entries(ROLE_LABELS) as [RoleKey, string][]).map(([role, label]) => (
                        <option key={role} value={role}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => setInviteOpen(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" className="flex-1" leftIcon={<Send className="w-3 h-3" />} onClick={handleSendInvite} disabled={!inviteName.trim() || !inviteEmail.trim()}>
                    Send invite
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <TopBar
        title="Onboarding"
        subtitle="New team member setup flow"
        actions={
          <Button variant="primary" size="sm" onClick={() => setInviteOpen(true)}>
            Send invite
          </Button>
        }
      />

      <div className="p-6 max-w-3xl space-y-8 animate-in">
        {/* Header card */}
        <div className="card p-6 bg-gradient-to-br from-gold-50 to-canvas-100 border-gold-200">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-label mb-1">Active track</p>
              <h2 className="text-heading">{ROLE_LABELS[activeRole]}</h2>
              <p className="text-sm text-ink-secondary mt-1 max-w-md">
                New team members receive contracts, role guidance, system tutorials, communication
                expectations, and a culture overview before going live.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-3xl font-black text-gold">{pct}%</p>
              <p className="text-xs text-ink-tertiary mt-0.5">
                {completed} / {steps.length} complete
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={pct} color="gold" size="md" />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const prevDone = i === 0 || steps[i - 1].done;
            const isNext = !step.done && prevDone;

            return (
              <div
                key={step.id}
                className={cn(
                  "card p-4 flex items-start gap-4 transition-all duration-150",
                  step.done && "opacity-70",
                  isNext && "border-gold-200 shadow-glow",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    step.done ? "bg-emerald-50" : isNext ? "bg-gold-100" : "bg-canvas-100",
                  )}
                >
                  {step.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Icon className={cn("w-5 h-5", isNext ? "text-gold" : "text-ink-tertiary")} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn("text-sm font-medium", step.done ? "line-through text-ink-tertiary" : "text-ink")}>
                      {step.title}
                    </p>
                    {isNext && (
                      <span className="text-2xs font-semibold px-1.5 py-0.5 rounded-full bg-gold-100 text-gold">
                        Up next
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-secondary mt-0.5">{step.desc}</p>
                </div>

                {!step.done && (
                  <Button
                    size="sm"
                    variant={isNext ? "primary" : "ghost"}
                    rightIcon={isNext ? <ChevronRight className="w-3.5 h-3.5" /> : undefined}
                    disabled={!isNext}
                    onClick={() => isNext && startStep(step.id)}
                  >
                    {isNext ? "Start" : <Lock className="w-3.5 h-3.5 text-ink-tertiary" />}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Role select */}
        <section>
          <h2 className="text-subheading mb-3">Onboard for a different role</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(Object.entries(ROLE_LABELS) as [RoleKey, string][]).map(([role, label]) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={cn(
                  "card p-3 text-left hover:border-gold-200 transition-colors",
                  activeRole === role && "border-gold-200 bg-gold-50/30",
                )}
              >
                <p className={cn("text-xs font-medium", activeRole === role ? "text-gold" : "text-ink")}>{label}</p>
                <p className="text-2xs text-ink-tertiary mt-0.5">6-step track</p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

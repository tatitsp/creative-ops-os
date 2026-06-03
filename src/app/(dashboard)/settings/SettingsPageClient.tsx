"use client";

import { useState } from "react";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { MOCK_USERS } from "@/lib/mock-data";
import { ROLE_LABELS } from "@/lib/constants";
import { User, Bell, Shield, Palette, Building2, Key, Globe, Zap, Check, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENT_USER } from "@/lib/mock-data";
import { AdminPanel } from "@/components/settings/AdminPanel";

type SettingsTab = "Profile" | "Workspace" | "Notifications" | "Permissions" | "Appearance" | "API & Integrations" | "Billing" | "Admin";

const BASE_SETTINGS_NAV: { icon: React.ElementType; label: SettingsTab }[] = [
  { icon: User, label: "Profile" },
  { icon: Building2, label: "Workspace" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Permissions" },
  { icon: Palette, label: "Appearance" },
  { icon: Key, label: "API & Integrations" },
  { icon: Globe, label: "Billing" },
];

const me = MOCK_USERS[0];
const isAdmin = CURRENT_USER.role === "CREATIVE_OPS_DIRECTOR";

export function SettingsPageClient() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Profile");
  const SETTINGS_NAV = isAdmin
    ? [...BASE_SETTINGS_NAV, { icon: ShieldCheck, label: "Admin" as SettingsTab }]
    : BASE_SETTINGS_NAV;
  const [name, setName] = useState(me.name);
  const [displayName, setDisplayName] = useState(me.displayName ?? me.name.split(" ")[0]);
  const [email, setEmail] = useState(me.email);
  const [timezone, setTimezone] = useState(me.timezone ?? "America/Chicago");
  const [workspaceName, setWorkspaceName] = useState("SCOPE");
  const [workspaceSlug, setWorkspaceSlug] = useState("scope");
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="min-h-screen">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      <TopBar title="Settings" />

      <div className="flex flex-col md:flex-row">
        {/* Settings nav — horizontal scroll on mobile, vertical sidebar on desktop */}
        <aside className="md:w-52 md:flex-shrink-0 border-b md:border-b-0 md:border-r border-border bg-canvas-50 md:p-3 md:min-h-[calc(100vh-3.5rem)]">
          <ul className="flex md:flex-col gap-0.5 overflow-x-auto px-3 py-2 md:px-0 md:py-0 scrollbar-hide">
            {SETTINGS_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="flex-shrink-0 md:flex-shrink">
                  <button
                    onClick={() => setActiveTab(item.label)}
                    className={cn(
                      "flex items-center gap-2 md:gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap w-full",
                      activeTab === item.label
                        ? "bg-gold-50 text-gold"
                        : "text-ink-secondary hover:bg-canvas-100 hover:text-ink",
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Settings content */}
        <div className="flex-1 p-4 md:p-6 max-w-2xl space-y-8 animate-in">
          {activeTab === "Profile" && (
            <>
              <section>
                <h2 className="text-heading mb-1">Profile</h2>
                <p className="text-xs text-ink-tertiary mb-4">Your name and account information</p>

                <div className="card p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar user={me} size="lg" />
                    <div>
                      <Button size="sm" variant="secondary" onClick={() => showToast("Photo upload available after deployment")}>
                        Change photo
                      </Button>
                      <p className="text-2xs text-ink-tertiary mt-1.5">JPG, PNG, or WebP · Max 5MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-label block mb-1.5">Full name</label>
                      <input className="input-base" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-label block mb-1.5">Display name</label>
                      <input className="input-base" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-label block mb-1.5">Email</label>
                      <input className="input-base" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                    </div>
                    <div>
                      <label className="text-label block mb-1.5">Timezone</label>
                      <input className="input-base" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-label block mb-1.5">Role</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-canvas-100 border border-border rounded-lg">
                      <span className="text-sm text-ink">{ROLE_LABELS[me.role]}</span>
                      <span className="text-2xs text-ink-tertiary ml-auto">Contact management to change</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    {saved && (
                      <span className="text-xs text-emerald-500 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Saved
                      </span>
                    )}
                    <Button variant="primary" size="md" onClick={handleSave}>
                      Save changes
                    </Button>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === "Workspace" && (
            <section>
              <h2 className="text-heading mb-1">Workspace</h2>
              <p className="text-xs text-ink-tertiary mb-4">Your studio&apos;s identity and settings</p>

              <div className="card p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center shadow-glow">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Button size="sm" variant="secondary" onClick={() => showToast("Logo upload available after deployment")}>Change logo</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-label block mb-1.5">Workspace name</label>
                    <input className="input-base" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-label block mb-1.5">Workspace slug</label>
                    <input className="input-base" value={workspaceSlug} onChange={(e) => setWorkspaceSlug(e.target.value)} />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  {saved && (
                    <span className="text-xs text-emerald-500 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Saved
                    </span>
                  )}
                  <Button variant="primary" size="md" onClick={handleSave}>Save</Button>
                </div>
              </div>
            </section>
          )}

          {activeTab === "Notifications" && (
            <section>
              <h2 className="text-heading mb-1">Notifications</h2>
              <p className="text-xs text-ink-tertiary mb-4">Control when and how you get notified</p>
              <div className="card p-6 space-y-4">
                {[
                  { label: "New approval requests", desc: "Get notified when something needs your review" },
                  { label: "Content published", desc: "When a content item goes live" },
                  { label: "Task assigned", desc: "When a task is assigned to you" },
                  { label: "Channel mentions", desc: "When someone @mentions you" },
                  { label: "Release milestones", desc: "When a release milestone is completed" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">{item.label}</p>
                      <p className="text-xs text-ink-tertiary">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-canvas-200 peer-checked:bg-gold rounded-full transition-colors peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                    </label>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <Button variant="primary" size="sm" onClick={() => showToast("Notification preferences saved")}>Save preferences</Button>
                </div>
              </div>
            </section>
          )}

          {(activeTab === "Permissions" || activeTab === "API & Integrations" || activeTab === "Billing") && (
            <section>
              <h2 className="text-heading mb-1">{activeTab}</h2>
              <div className="card p-12 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-xl bg-canvas-100 flex items-center justify-center mb-3">
                  <Key className="w-5 h-5 text-ink-tertiary" />
                </div>
                <p className="text-sm font-medium text-ink">Available after deployment</p>
                <p className="text-xs text-ink-tertiary mt-1 max-w-xs">
                  This section will be fully configured once SCOPE is live for the team.
                </p>
              </div>
            </section>
          )}

          {activeTab === "Appearance" && (
            <section>
              <h2 className="text-heading mb-1">Appearance</h2>
              <p className="text-xs text-ink-tertiary mb-4">Customize how SCOPE looks for you</p>
              <div className="card p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-ink mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Dark", active: true, bg: "bg-[#080808]", border: "border-gold" },
                      { label: "Light", active: false, bg: "bg-white", border: "border-border" },
                      { label: "System", active: false, bg: "bg-canvas-100", border: "border-border" },
                    ].map((theme) => (
                      <button key={theme.label} className={cn("p-3 rounded-xl border-2 text-xs font-medium transition-all", theme.border, theme.active ? "text-gold" : "text-ink-secondary")}>
                        <div className={cn("w-full h-8 rounded-lg mb-2", theme.bg)} />
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="primary" size="sm" onClick={() => showToast("Appearance saved")}>Save</Button>
                </div>
              </div>
            </section>
          )}

          {activeTab === "Admin" && isAdmin && <AdminPanel />}

          {/* Danger Zone — always visible */}
          {(activeTab === "Profile" || activeTab === "Workspace") && (
            <section>
              <h2 className="text-heading text-rose-600 mb-1">Danger Zone</h2>
              <div className="card p-4 border-rose-100">
                {deleteConfirm ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-rose-600">Are you sure? This cannot be undone.</p>
                    <div className="flex gap-3">
                      <Button variant="secondary" size="sm" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
                      <Button variant="danger" size="sm" onClick={() => { setDeleteConfirm(false); showToast("Workspace deletion requires admin confirmation"); }}>
                        Yes, delete workspace
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">Delete workspace</p>
                      <p className="text-xs text-ink-tertiary mt-0.5">
                        Permanently delete your workspace and all data. Cannot be undone.
                      </p>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(true)}>Delete</Button>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

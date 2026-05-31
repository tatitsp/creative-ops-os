"use client";

import { useState } from "react";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { ROLE_LABELS } from "@/lib/constants";
import { CURRENT_USER } from "@/lib/mock-data";
import { User, Bell, Shield, Palette, Building2, Key, Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type SettingsTab = "Profile" | "Workspace" | "Notifications" | "Permissions" | "Appearance" | "API & Integrations" | "Billing";

const SETTINGS_NAV: { icon: React.ElementType; label: SettingsTab }[] = [
  { icon: User, label: "Profile" },
  { icon: Building2, label: "Workspace" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Permissions" },
  { icon: Palette, label: "Appearance" },
  { icon: Key, label: "API & Integrations" },
  { icon: Globe, label: "Billing" },
];

const me = CURRENT_USER;

interface Props {
  artistName: string;
  artistHandle: string;
  location: string;
  genre: string;
}

export function ArtistSettingsClient({ artistName, artistHandle, location, genre }: Props) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Profile");
  const [name, setName] = useState(me.name);
  const [displayName, setDisplayName] = useState(me.displayName ?? me.name.split(" ")[0]);
  const [email, setEmail] = useState(me.email);
  const [timezone, setTimezone] = useState(me.timezone ?? "America/Chicago");
  const [wsArtistName, setWsArtistName] = useState(artistName);
  const [wsHandle, setWsHandle] = useState(artistHandle);
  const [wsLocation, setWsLocation] = useState(location);
  const [wsGenre, setWsGenre] = useState(genre);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="min-h-screen">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      <TopBar title="Settings" subtitle={artistName} />

      <div className="flex">
        <aside className="w-52 border-r border-border bg-canvas-50 p-3 min-h-[calc(100vh-3.5rem)]">
          <ul className="space-y-0.5">
            {SETTINGS_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    onClick={() => setActiveTab(item.label)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      activeTab === item.label ? "bg-gold-50 text-gold" : "text-ink-secondary hover:bg-canvas-100 hover:text-ink",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="flex-1 p-6 max-w-2xl space-y-8 animate-in">
          {activeTab === "Profile" && (
            <section>
              <h2 className="text-heading mb-1">Profile</h2>
              <p className="text-xs text-ink-tertiary mb-4">Your name and account information</p>
              <div className="card p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar user={me} size="lg" />
                  <div>
                    <Button size="sm" variant="secondary" onClick={() => showToast("Photo upload available after deployment")}>Change photo</Button>
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
                  {saved && <span className="text-xs text-emerald-500 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Saved</span>}
                  <Button variant="primary" size="md" onClick={handleSave}>Save changes</Button>
                </div>
              </div>
            </section>
          )}

          {activeTab === "Workspace" && (
            <section>
              <h2 className="text-heading mb-1">Workspace</h2>
              <p className="text-xs text-ink-tertiary mb-4">{artistName}&apos;s workspace settings</p>
              <div className="card p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-label block mb-1.5">Artist name</label>
                    <input className="input-base" value={wsArtistName} onChange={(e) => setWsArtistName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-label block mb-1.5">Handle</label>
                    <input className="input-base" value={wsHandle} onChange={(e) => setWsHandle(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-label block mb-1.5">Location</label>
                    <input className="input-base" value={wsLocation} onChange={(e) => setWsLocation(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-label block mb-1.5">Genre</label>
                    <input className="input-base" value={wsGenre} onChange={(e) => setWsGenre(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                  {saved && <span className="text-xs text-emerald-500 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Saved</span>}
                  <Button variant="primary" size="md" onClick={handleSave}>Save</Button>
                </div>
              </div>
            </section>
          )}

          {(activeTab === "Notifications" || activeTab === "Permissions" || activeTab === "Appearance" || activeTab === "API & Integrations" || activeTab === "Billing") && (
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

          {(activeTab === "Profile" || activeTab === "Workspace") && (
            <section>
              <h2 className="text-heading text-rose-600 mb-1">Danger Zone</h2>
              <div className="card p-4 border-rose-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">Remove workspace</p>
                    <p className="text-xs text-ink-tertiary mt-0.5">Remove {artistName} from SCOPE. Cannot be undone.</p>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => showToast("Workspace removal requires admin confirmation")}>Remove</Button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { MOCK_USERS } from "@/lib/mock-data";
import { ROLE_LABELS } from "@/lib/constants";
import {
  User,
  Bell,
  Shield,
  Palette,
  Building2,
  Key,
  Globe,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Settings" };

const SETTINGS_NAV = [
  { icon: User, label: "Profile", active: true },
  { icon: Building2, label: "Workspace" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Permissions" },
  { icon: Palette, label: "Appearance" },
  { icon: Key, label: "API & Integrations" },
  { icon: Globe, label: "Billing" },
];

const me = MOCK_USERS[0];

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Settings" />

      <div className="flex">
        {/* Settings nav */}
        <aside className="w-52 border-r border-border bg-canvas-50 p-3 min-h-[calc(100vh-3.5rem)]">
          <ul className="space-y-0.5">
            {SETTINGS_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      item.active
                        ? "bg-gold-50 text-gold"
                        : "text-ink-secondary hover:bg-canvas-100 hover:text-ink",
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

        {/* Settings content */}
        <div className="flex-1 p-6 max-w-2xl space-y-8 animate-in">
          {/* Profile */}
          <section>
            <h2 className="text-heading mb-1">Profile</h2>
            <p className="text-xs text-ink-tertiary mb-4">Your name and account information</p>

            <div className="card p-6 space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar user={me} size="lg" />
                <div>
                  <Button size="sm" variant="secondary">
                    Change photo
                  </Button>
                  <p className="text-2xs text-ink-tertiary mt-1.5">
                    JPG, PNG, or WebP · Max 5MB
                  </p>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-label block mb-1.5">Full name</label>
                  <input className="input-base" defaultValue={me.name} />
                </div>
                <div>
                  <label className="text-label block mb-1.5">Display name</label>
                  <input className="input-base" defaultValue={me.displayName ?? me.name.split(" ")[0]} />
                </div>
                <div>
                  <label className="text-label block mb-1.5">Email</label>
                  <input className="input-base" defaultValue={me.email} type="email" />
                </div>
                <div>
                  <label className="text-label block mb-1.5">Timezone</label>
                  <input className="input-base" defaultValue={me.timezone} />
                </div>
              </div>

              <div>
                <label className="text-label block mb-1.5">Role</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-canvas-100 border border-border rounded-lg">
                  <span className="text-sm text-ink">{ROLE_LABELS[me.role]}</span>
                  <span className="text-2xs text-ink-tertiary ml-auto">Contact management to change</span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="primary" size="md">
                  Save changes
                </Button>
              </div>
            </div>
          </section>

          {/* Workspace */}
          <section>
            <h2 className="text-heading mb-1">Workspace</h2>
            <p className="text-xs text-ink-tertiary mb-4">Your studio&apos;s identity and settings</p>

            <div className="card p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center shadow-glow">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Button size="sm" variant="secondary">Change logo</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-label block mb-1.5">Workspace name</label>
                  <input className="input-base" defaultValue="Creative Ops Studio" />
                </div>
                <div>
                  <label className="text-label block mb-1.5">Workspace slug</label>
                  <input className="input-base" defaultValue="creative-ops-studio" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="primary" size="md">Save</Button>
              </div>
            </div>
          </section>

          {/* Danger zone */}
          <section>
            <h2 className="text-heading text-rose-600 mb-1">Danger Zone</h2>
            <div className="card p-4 border-rose-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">Delete workspace</p>
                  <p className="text-xs text-ink-tertiary mt-0.5">
                    Permanently delete your workspace and all data. Cannot be undone.
                  </p>
                </div>
                <Button variant="danger" size="sm">Delete</Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

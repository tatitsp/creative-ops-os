"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOCK_USERS } from "@/lib/mock-data";
import { ROLE_LABELS } from "@/lib/constants";
import { Avatar } from "@/components/ui/Avatar";
import {
  LayoutDashboard,
  FolderKanban,
  Film,
  ImageIcon,
  CalendarDays,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  UserCheck,
  Zap,
  ChevronRight,
  Rocket,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Releases", href: "/releases", icon: Rocket, badge: 1 },
      { label: "Projects", href: "/projects", icon: FolderKanban, badge: 4 },
      { label: "Content", href: "/content", icon: Film, badge: 6 },
    ],
  },
  {
    label: "Create",
    items: [
      { label: "Asset Library", href: "/assets", icon: ImageIcon },
      { label: "Calendar", href: "/calendar", icon: CalendarDays },
    ],
  },
  {
    label: "Team",
    items: [
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Team", href: "/team", icon: Users },
      { label: "Channels", href: "/channels", icon: MessageSquare, badge: 3 },
      { label: "Onboarding", href: "/onboarding", icon: UserCheck },
    ],
  },
  {
    label: "System",
    items: [{ label: "Settings", href: "/settings", icon: Settings }],
  },
];

// Current user — replace with auth session in production
const ME = MOCK_USERS[0];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-border flex flex-col z-30">
      {/* Logo / Workspace */}
      <div className="px-4 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-glow">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink leading-none">Creative Ops</p>
            <p className="text-2xs text-ink-tertiary mt-0.5">Studio OS</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="text-label px-2 mb-1">{section.label}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "nav-item",
                        isActive && "active",
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={isActive ? 2 : 1.75} />
                      <span className="flex-1">{item.label}</span>
                      {"badge" in item && item.badge && (
                        <span
                          className={cn(
                            "text-2xs font-semibold px-1.5 py-0.5 rounded-full",
                            isActive
                              ? "bg-violet-100 text-violet-700"
                              : "bg-canvas-200 text-ink-tertiary",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border">
        <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-canvas-100 transition-colors group">
          <Avatar user={ME} size="sm" showStatus />
          <div className="flex-1 text-left min-w-0">
            <p className="text-xs font-medium text-ink truncate">{ME.name}</p>
            <p className="text-2xs text-ink-tertiary truncate">{ROLE_LABELS[ME.role]}</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-ink-tertiary group-hover:text-ink transition-colors" />
        </button>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CURRENT_USER } from "@/lib/mock-data";
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
  ArrowLeftRight,
  Rocket,
  CheckSquare,
  Star,
  DollarSign,
} from "lucide-react";

const BUDGET_ROLES = ["ARTIST_CEO", "CREATIVE_OPS_DIRECTOR"];
import { PENDING_APPROVALS_COUNT } from "@/lib/mock-approvals";
import { UNREAD_NAV_SECTIONS } from "@/lib/mock-notifications";

const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard",      href: "/dashboard",      icon: LayoutDashboard },
      ...(CURRENT_USER.role === "CREATIVE_OPS_DIRECTOR"
        ? [{ label: "Artist Portal", href: "/artist-portal", icon: Star }]
        : []),
      { label: "Releases",       href: "/releases",       icon: Rocket,       badge: 1 },
      { label: "Projects",       href: "/projects",       icon: FolderKanban, badge: 4 },
      { label: "Content",        href: "/content",        icon: Film,         badge: 6 },
      { label: "Approvals",      href: "/approvals",      icon: CheckSquare,  badge: PENDING_APPROVALS_COUNT },
      ...(BUDGET_ROLES.includes(CURRENT_USER.role)
        ? [{ label: "Budget", href: "/budget", icon: DollarSign }]
        : []),
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

const ME = CURRENT_USER;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[#050505] border-r border-[#1A1A1A] flex flex-col z-30">
      {/* Logo / Workspace */}
      <div className="px-4 pt-5 pb-4 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center shadow-glow flex-shrink-0">
            <span className="text-xs font-black text-white tracking-tight">SC</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">SCOPE</p>
            <p className="text-2xs text-[#444444] mt-0.5">by The Sighte Project</p>
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
                      {/* Unread notification dot */}
                      {!isActive && UNREAD_NAV_SECTIONS.has(item.href) && !("badge" in item && item.badge) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      )}
                      {"badge" in item && item.badge && (
                        <span
                          className={cn(
                            "text-2xs font-bold px-1.5 py-0.5 rounded-full",
                            isActive
                              ? "bg-gold-100 text-gold"
                              : "bg-[#1A1A1A] text-[#444444]",
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

      {/* User + workspace switcher */}
      <div className="p-3 border-t border-[#1A1A1A]">
        <Link
          href="/select-workspace"
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[#1A1A1A] transition-colors group"
        >
          <Avatar user={ME} size="sm" showStatus />
          <div className="flex-1 text-left min-w-0">
            <p className="text-xs font-semibold text-white truncate">{ME.name}</p>
            <p className="text-2xs text-[#444444] truncate">{ROLE_LABELS[ME.role]}</p>
          </div>
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#444444] group-hover:text-[#888888] transition-colors flex-shrink-0" />
        </Link>
      </div>
    </aside>
  );
}

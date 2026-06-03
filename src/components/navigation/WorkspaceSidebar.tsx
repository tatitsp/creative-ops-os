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
  Clapperboard,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Image from "next/image";
import { useSidebar } from "@/lib/sidebar-store";
import { useDemoRole, isHrefAllowed } from "@/lib/demo-role-store";
import { RoleSwitcher } from "@/components/navigation/RoleSwitcher";

const BUDGET_ROLES = ["ARTIST_CEO", "CREATIVE_OPS_DIRECTOR"];
const ME = CURRENT_USER;

type WorkspaceSidebarProps = {
  artistName: string;
  artistPhoto: string;
  genre: string;
  basePath: string;
};

export function WorkspaceSidebar({ artistName, artistPhoto, genre, basePath }: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const { isOpen, close, isCollapsed, toggleCollapsed } = useSidebar();
  const { role } = useDemoRole();

  const NAV_SECTIONS = [
    {
      label: "Workspace",
      items: [
        { label: "Dashboard",     href: `${basePath}/dashboard`,     icon: LayoutDashboard },
        ...(CURRENT_USER.role === "CREATIVE_OPS_DIRECTOR"
          ? [{ label: "Artist Portal", href: `${basePath}/artist-portal`, icon: Star }]
          : []),
        { label: "Drops",         href: `${basePath}/releases`,      icon: Rocket,       badge: 1 },
        { label: "Campaigns",     href: `${basePath}/projects`,      icon: FolderKanban },
        { label: "Content",       href: `${basePath}/content`,       icon: Film },
        { label: "Approvals",     href: `${basePath}/approvals`,     icon: CheckSquare },
        ...(BUDGET_ROLES.includes(CURRENT_USER.role)
          ? [{ label: "Budget", href: `${basePath}/budget`, icon: DollarSign }]
          : []),
      ],
    },
    ...(CURRENT_USER.role === "CREATIVE_OPS_DIRECTOR"
      ? [
          {
            label: "Director",
            items: [
              { label: "Vision Studio", href: "/director/studio", icon: Clapperboard },
            ],
          },
        ]
      : []),
    {
      label: "Create",
      items: [
        { label: "Media Vault",    href: `${basePath}/assets`,   icon: ImageIcon },
        { label: "Calendar",       href: `${basePath}/calendar`, icon: CalendarDays },
      ],
    },
    {
      label: "Team",
      items: [
        { label: "Analytics",      href: `${basePath}/analytics`,  icon: BarChart3 },
        { label: "Team",           href: `${basePath}/team`,       icon: Users },
        { label: "Messages",       href: `${basePath}/channels`,   icon: MessageSquare, badge: 2 },
        { label: "Getting Started", href: `${basePath}/onboarding`, icon: UserCheck },
      ],
    },
    {
      label: "System",
      items: [
        { label: "Settings", href: `${basePath}/settings`, icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-[#050505] border-r border-[#1A1A1A] flex flex-col z-30 transition-all duration-300",
          isCollapsed ? "w-16" : "w-60",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "border-b border-[#1A1A1A] flex items-center",
            isCollapsed ? "flex-col gap-2 px-2 pt-4 pb-3" : "gap-2.5 px-4 pt-5 pb-4",
          )}
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-canvas-100">
            <Image
              src={artistPhoto}
              alt={artistName}
              width={32}
              height={32}
              className="w-full h-full object-cover object-top"
              unoptimized
            />
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white leading-none truncate">{artistName}</p>
              <p className="text-2xs text-[#444444] mt-0.5 truncate">{genre}</p>
            </div>
          )}

          {/* Desktop collapse toggle — hidden on mobile */}
          <button
            onClick={toggleCollapsed}
            className="hidden md:flex items-center justify-center w-6 h-6 rounded-md text-[#444444] hover:text-white hover:bg-canvas-100 transition-colors flex-shrink-0"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed
              ? <PanelLeftOpen className="w-3.5 h-3.5" />
              : <PanelLeftClose className="w-3.5 h-3.5" />
            }
          </button>
        </div>

        {/* Nav */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto py-4",
            isCollapsed ? "px-2" : "px-3",
          )}
        >
          <ul className="space-y-0.5">
            {NAV_SECTIONS.flatMap((section) =>
              section.items.filter((item) => isHrefAllowed(item.href, role))
            ).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "nav-item",
                      isActive && "active",
                      isCollapsed && "justify-center px-0",
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={isActive ? 2 : 1.75} />

                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {"badge" in item && item.badge ? (
                          <span
                            className={cn(
                              "text-2xs font-bold px-1.5 py-0.5 rounded-full",
                              isActive ? "bg-gold-100 text-gold" : "bg-[#1A1A1A] text-[#444444]",
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {!isCollapsed && <RoleSwitcher />}

        {/* User footer */}
        <div className={cn("border-t border-[#1A1A1A]", isCollapsed ? "p-2 flex justify-center" : "p-3")}>
          {isCollapsed ? (
            <Avatar user={ME} size="sm" showStatus />
          ) : (
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
          )}
        </div>
      </aside>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Rocket,
  Film,
  Users,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";

type WorkspaceSidebarProps = {
  artistName: string;
  artistPhoto: string;
  genre: string;
  basePath: string; // e.g. "/artists/miriam"
};

export function WorkspaceSidebar({ artistName, artistPhoto, genre, basePath }: WorkspaceSidebarProps) {
  const pathname = usePathname();

  const NAV = [
    { label: "Dashboard", href: `${basePath}/dashboard`, icon: LayoutDashboard },
    { label: "Releases", href: `${basePath}/releases`, icon: Rocket },
    { label: "Content", href: `${basePath}/content`, icon: Film },
    { label: "Team", href: `${basePath}/team`, icon: Users },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[#050505] border-r border-[#1A1A1A] flex flex-col z-30">
      {/* Artist header */}
      <div className="px-4 pt-5 pb-4 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-canvas-100">
            <Image
              src={artistPhoto}
              alt={artistName}
              width={32}
              height={32}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-none truncate">{artistName}</p>
            <p className="text-2xs text-[#444444] mt-0.5 truncate">{genre}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <p className="text-label px-2 mb-1">Workspace</p>
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn("nav-item", isActive && "active")}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={isActive ? 2 : 1.75} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Back to workspace selector */}
      <div className="p-3 border-t border-[#1A1A1A]">
        <Link
          href="/select-workspace"
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[#1A1A1A] transition-colors group text-[#444444] hover:text-[#888888]"
        >
          <ArrowLeft className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-xs font-medium">Switch workspace</span>
        </Link>
      </div>
    </aside>
  );
}

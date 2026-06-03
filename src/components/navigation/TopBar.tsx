"use client";

import { useSession, signIn } from "next-auth/react";
import { Search, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useSidebar } from "@/lib/sidebar-store";

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { data: session } = useSession();
  const { toggle } = useSidebar();

  return (
    <header className="border-b border-border bg-canvas-50/80 backdrop-blur-sm sticky top-0 z-20 px-4 md:px-6 py-4 flex items-center gap-3 md:gap-4">
      {/* Hamburger — mobile only */}
      <button
        className="md:hidden flex-shrink-0 p-1.5 rounded-lg hover:bg-canvas-100 transition-colors"
        onClick={toggle}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-ink-secondary" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-black tracking-tight text-ink leading-none truncate">{title}</h1>
        {subtitle && <p className="text-sm font-medium text-ink-secondary mt-1.5">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-canvas-100 border border-border rounded-lg px-3 py-1.5 w-56 group focus-within:ring-1 focus-within:ring-white/20 focus-within:border-border-strong transition-all">
        <Search className="w-3.5 h-3.5 text-ink-tertiary flex-shrink-0" />
        <input
          placeholder="Search anything..."
          className="bg-transparent text-xs text-ink placeholder:text-ink-tertiary outline-none w-full"
        />
        <kbd className="text-2xs text-ink-tertiary bg-canvas-200 border border-border rounded px-1 py-0.5 font-mono hidden group-focus-within:hidden">
          ⌘K
        </kbd>
      </div>

      {/* Notifications */}
      <NotificationBell />

      {/* Session: avatar if signed in, Sign In button if not */}
      {session?.user ? (
        <div className="flex items-center gap-2 flex-shrink-0">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name ?? "User"}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-border"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-canvas-200 flex items-center justify-center text-2xs font-semibold text-ink-secondary ring-1 ring-border">
              {session.user.name?.[0] ?? "?"}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white text-black text-xs font-bold tracking-wide uppercase hover:bg-white/90 active:scale-95 transition-all shadow-sm flex-shrink-0"
        >
          Sign In
        </button>
      )}

      {/* Custom actions or default new button */}
      {actions ?? (
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          New
        </Button>
      )}
    </header>
  );
}

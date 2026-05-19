"use client";

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { data: session, status } = useSession();

  // Redirect to Google sign-in if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google");
    }
  }, [status]);

  return (
    <header className="h-14 border-b border-border bg-canvas-50/80 backdrop-blur-sm sticky top-0 z-20 px-6 flex items-center gap-4">
      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-bold text-ink truncate">{title}</h1>
        {subtitle && <p className="text-2xs text-ink-tertiary">{subtitle}</p>}
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

      {/* Session user avatar */}
      {session?.user && (
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

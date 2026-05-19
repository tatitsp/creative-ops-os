"use client";

import { Bell, Search, Plus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MOCK_APPROVALS } from "@/lib/mock-data";

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const pendingApprovals = MOCK_APPROVALS.filter((a) => a.status === "PENDING").length;

export function TopBar({ title, subtitle, actions }: TopBarProps) {
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
      <button className="relative p-2 rounded-lg hover:bg-canvas-100 transition-colors">
        <Bell className="w-4 h-4 text-ink-secondary" />
        {pendingApprovals > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-white text-2xs font-bold rounded-full flex items-center justify-center">
            {pendingApprovals}
          </span>
        )}
      </button>

      {/* Approvals quick-link */}
      {pendingApprovals > 0 && (
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 border border-amber-100 rounded-lg">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-semibold text-amber-400">
            {pendingApprovals} pending approval{pendingApprovals > 1 ? "s" : ""}
          </span>
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

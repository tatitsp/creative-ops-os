"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, FolderKanban, Users, CheckSquare, Disc3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_NOTIFICATIONS,
  formatNotifTime,
  getNotifGroup,
  type AppNotification,
  type NotificationType,
} from "@/lib/mock-notifications";
import { CURRENT_USER } from "@/lib/mock-data";
import { getDisplayName } from "@/lib/greeting";

// ─── Type icon map ─────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  campaign: <FolderKanban className="w-3.5 h-3.5 text-sky-400" />,
  team:     <Users        className="w-3.5 h-3.5 text-rose-400" />,
  approval: <CheckSquare  className="w-3.5 h-3.5 text-gold" />,
  release:  <Disc3        className="w-3.5 h-3.5 text-emerald-400" />,
};

// ─── Component ─────────────────────────────────────────────────────────────────

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Click-outside close
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleNotifClick(notif: AppNotification) {
    markRead(notif.id);
    setOpen(false);
    router.push(notif.href);
  }

  // Group by day
  const today     = notifications.filter((n) => getNotifGroup(n.timestamp) === "today");
  const yesterday = notifications.filter((n) => getNotifGroup(n.timestamp) === "yesterday");
  const earlier   = notifications.filter((n) => getNotifGroup(n.timestamp) === "earlier");

  const groups: { label: string; items: AppNotification[] }[] = [
    { label: "Today",     items: today },
    { label: "Yesterday", items: yesterday },
    { label: "Earlier",   items: earlier },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-canvas-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className={cn("w-4 h-4", open ? "text-gold" : "text-ink-secondary")} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-white text-2xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          className="absolute top-full right-0 mt-2 w-[360px] bg-canvas-50 border border-border rounded-2xl shadow-xl overflow-hidden z-50"
        >
          {/* Header */}
          <div className="px-4 pt-3 pb-2.5 border-b border-border">
            <p className="text-2xs text-ink-tertiary font-medium">
              Hey, {getDisplayName(CURRENT_USER)}
            </p>
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-sm font-bold text-ink">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-2xs font-semibold text-gold hover:text-gold/80 transition-colors"
                >
                  <Check className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-ink-tertiary text-center py-8">No notifications</p>
            ) : (
              groups.map((group) => (
                <div key={group.label}>
                  <p className="text-label px-4 pt-3 pb-1">{group.label}</p>
                  {group.items.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className={cn(
                        "w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-canvas-100 transition-colors group",
                        !notif.read && "bg-canvas-100/50",
                      )}
                    >
                      {/* Unread dot + icon */}
                      <div className="flex items-center gap-2 mt-0.5 flex-shrink-0">
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full flex-shrink-0",
                            notif.read ? "bg-transparent" : "bg-gold",
                          )}
                        />
                        <span className="flex-shrink-0">{TYPE_ICONS[notif.type]}</span>
                      </div>

                      {/* Message + time */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-xs leading-snug",
                            notif.read ? "text-ink-secondary" : "text-ink font-medium",
                          )}
                        >
                          {notif.message}
                        </p>
                        <p className="text-2xs text-ink-tertiary mt-0.5">
                          {formatNotifTime(notif.timestamp)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2.5">
            <button
              onClick={() => { setOpen(false); router.push("/notifications"); }}
              className="text-xs font-semibold text-ink-secondary hover:text-ink transition-colors w-full text-center"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

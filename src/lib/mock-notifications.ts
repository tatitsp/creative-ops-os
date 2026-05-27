import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType = "campaign" | "team" | "approval" | "release";

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string; // ISO string
  href: string;
  read: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
// "Now" for this mock is May 18, 2026 ~2 PM CT

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  // ── Today ──────────────────────────────────────────────────────────────────
  {
    id: "n1",
    type: "approval",
    message: '"Gravity" MV final cut needs your approval — premiere is June 3.',
    timestamp: "2026-05-27T10:30:00Z",
    href: "/approvals/ra1",
    read: false,
  },
  {
    id: "n2",
    type: "release",
    message: "YouTube premiere for \"Gravity\" isn't scheduled yet — 7 days out.",
    timestamp: "2026-05-27T09:15:00Z",
    href: "/releases/elijah",
    read: false,
  },
  {
    id: "n3",
    type: "approval",
    message: '"Gravity" vertical edit (60s) submitted — needs sign-off before June 3.',
    timestamp: "2026-05-27T08:45:00Z",
    href: "/approvals/ra4",
    read: false,
  },
  {
    id: "n4",
    type: "approval",
    message: "YouTube thumbnail revision requested — Key needs to approve final version.",
    timestamp: "2026-05-27T07:00:00Z",
    href: "/approvals/ra3",
    read: false,
  },
  // ── Yesterday ──────────────────────────────────────────────────────────────
  {
    id: "n5",
    type: "campaign",
    message: "Elijah drops in 52 days — pre-save campaign launches June 10.",
    timestamp: "2026-05-26T16:30:00Z",
    href: "/releases/elijah",
    read: false,
  },
  {
    id: "n6",
    type: "approval",
    message: "Key approved the Elijah album cover art — final.",
    timestamp: "2026-05-26T15:00:00Z",
    href: "/approvals",
    read: true,
  },
  {
    id: "n7",
    type: "team",
    message: "Kaito delivered Press Set A — 25 selects in the asset vault.",
    timestamp: "2026-05-26T18:30:00Z",
    href: "/assets",
    read: false,
  },
  // ── Earlier ────────────────────────────────────────────────────────────────
  {
    id: "n8",
    type: "release",
    message: "Apple Music editorial pitch submitted for Elijah.",
    timestamp: "2026-05-25T09:00:00Z",
    href: "/releases/elijah",
    read: true,
  },
  {
    id: "n9",
    type: "campaign",
    message: '"Gravity" single announcement goes live tomorrow — assets approved.',
    timestamp: "2026-05-25T08:00:00Z",
    href: "/projects",
    read: true,
  },
  {
    id: "n10",
    type: "approval",
    message: 'Studio BTS reel ("Gravity" MV day) approved — scheduled for June 10.',
    timestamp: "2026-05-24T17:00:00Z",
    href: "/approvals/ra8",
    read: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Fixed mock reference point so timestamps render consistently
const MOCK_NOW = new Date("2026-05-27T14:00:00Z");

export function formatNotifTime(timestamp: string): string {
  const date = new Date(timestamp);
  const diffMs = MOCK_NOW.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffHours < 48) return `Yesterday · ${format(date, "h:mm a")}`;
  return format(date, "MMM d");
}

export function getNotifGroup(timestamp: string): "today" | "yesterday" | "earlier" {
  const d = timestamp.slice(0, 10);
  if (d === "2026-05-27") return "today";
  if (d === "2026-05-26") return "yesterday";
  return "earlier";
}

// Which nav sections have unread notifications (for sidebar dots)
const TYPE_TO_SECTION: Record<NotificationType, string> = {
  campaign: "/projects",
  team:     "/team",
  approval: "/approvals",
  release:  "/releases",
};

export const UNREAD_NAV_SECTIONS = new Set(
  MOCK_NOTIFICATIONS
    .filter((n) => !n.read)
    .map((n) => TYPE_TO_SECTION[n.type]),
);

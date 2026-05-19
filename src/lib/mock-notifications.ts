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
    message: "3 approvals have been waiting over 24 hours.",
    timestamp: "2026-05-18T10:30:00Z",
    href: "/approvals",
    read: false,
  },
  {
    id: "n2",
    type: "release",
    message: "Elijah pre-save campaign hasn't launched yet — release is in 61 days.",
    timestamp: "2026-05-18T09:15:00Z",
    href: "/releases",
    read: false,
  },
  {
    id: "n3",
    type: "team",
    message: "Sofia is at capacity — reassign before adding more.",
    timestamp: "2026-05-18T08:45:00Z",
    href: "/team",
    read: false,
  },
  {
    id: "n4",
    type: "approval",
    message: "Revision requested on press kit bio — needs your attention.",
    timestamp: "2026-05-18T07:00:00Z",
    href: "/approvals/ra3",
    read: false,
  },
  // ── Yesterday ──────────────────────────────────────────────────────────────
  {
    id: "n5",
    type: "campaign",
    message: "Elijah drops in 61 days — 3 deliverables are still open.",
    timestamp: "2026-05-17T16:30:00Z",
    href: "/releases",
    read: false,
  },
  {
    id: "n6",
    type: "approval",
    message: "Lil Tony approved the REPENT! social copy.",
    timestamp: "2026-05-17T14:00:00Z",
    href: "/approvals",
    read: true,
  },
  {
    id: "n7",
    type: "team",
    message: "2 team members haven't logged activity in 3 days.",
    timestamp: "2026-05-17T11:00:00Z",
    href: "/team",
    read: false,
  },
  // ── Earlier ────────────────────────────────────────────────────────────────
  {
    id: "n8",
    type: "release",
    message: "No content scheduled for the week of June 2nd.",
    timestamp: "2026-05-16T09:00:00Z",
    href: "/calendar",
    read: true,
  },
  {
    id: "n9",
    type: "campaign",
    message: "Mrs.Key rollout is 2 days behind schedule.",
    timestamp: "2026-05-16T08:00:00Z",
    href: "/projects",
    read: true,
  },
  {
    id: "n10",
    type: "approval",
    message: "Start a Business video treatment has been waiting 48hrs for approval.",
    timestamp: "2026-05-15T17:00:00Z",
    href: "/approvals",
    read: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Fixed mock reference point so timestamps render consistently
const MOCK_NOW = new Date("2026-05-18T14:00:00Z");

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
  if (d === "2026-05-18") return "today";
  if (d === "2026-05-17") return "yesterday";
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

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
} from "lucide-react";
import type { UserRole, ContentPhase, TaskStatus, Priority, CampaignStatus } from "@/types";

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Content", href: "/content", icon: Film },
  { label: "Assets", href: "/assets", icon: ImageIcon },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Team", href: "/team", icon: Users },
  { label: "Channels", href: "/channels", icon: MessageSquare },
  { label: "Onboarding", href: "/onboarding", icon: UserCheck },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;

// ─── Role Labels ─────────────────────────────────────────────────────────────

export const ROLE_LABELS: Record<UserRole, string> = {
  ARTIST_CEO: "Artist / CEO",
  MANAGEMENT: "Management",
  CREATIVE_OPS_DIRECTOR: "Creative Ops Director",
  CREATIVE_ASSISTANT: "Creative Assistant",
  PHOTOGRAPHER_VIDEOGRAPHER: "Photo / Video",
  EDITOR: "Editor",
  SOCIAL_MEDIA: "Social Media",
  GRAPHIC_DESIGNER: "Graphic Designer",
  CONTRACTOR: "Contractor",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  ARTIST_CEO: "bg-violet-100 text-violet-700",
  MANAGEMENT: "bg-sky-100 text-sky-700",
  CREATIVE_OPS_DIRECTOR: "bg-emerald-100 text-emerald-700",
  CREATIVE_ASSISTANT: "bg-amber-100 text-amber-700",
  PHOTOGRAPHER_VIDEOGRAPHER: "bg-rose-100 text-rose-700",
  EDITOR: "bg-violet-100 text-violet-600",
  SOCIAL_MEDIA: "bg-sky-100 text-sky-600",
  GRAPHIC_DESIGNER: "bg-emerald-100 text-emerald-600",
  CONTRACTOR: "bg-canvas-200 text-ink-secondary",
};

// ─── Content Pipeline ────────────────────────────────────────────────────────

export const CONTENT_PHASES: { phase: ContentPhase; label: string; color: string }[] = [
  { phase: "IDEA", label: "Idea", color: "bg-ink-tertiary/20 text-ink-secondary" },
  { phase: "PLANNING", label: "Planning", color: "bg-sky-50 text-sky-600" },
  { phase: "PRODUCTION", label: "Production", color: "bg-amber-50 text-amber-600" },
  { phase: "EDITING", label: "Editing", color: "bg-violet-50 text-violet-600" },
  { phase: "REVIEW", label: "Review", color: "bg-rose-50 text-rose-500" },
  { phase: "APPROVED", label: "Approved", color: "bg-emerald-50 text-emerald-600" },
  { phase: "SCHEDULED", label: "Scheduled", color: "bg-violet-100 text-violet-700" },
  { phase: "POSTED", label: "Posted", color: "bg-emerald-100 text-emerald-700" },
  { phase: "ANALYTICS", label: "Analytics", color: "bg-sky-100 text-sky-700" },
  { phase: "ARCHIVED", label: "Archived", color: "bg-canvas-200 text-ink-tertiary" },
];

// ─── Task Status ─────────────────────────────────────────────────────────────

export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; dot: string }
> = {
  TODO: { label: "To Do", color: "bg-canvas-200 text-ink-secondary", dot: "bg-ink-tertiary" },
  IN_PROGRESS: { label: "In Progress", color: "bg-amber-50 text-amber-600", dot: "bg-amber-400" },
  IN_REVIEW: { label: "In Review", color: "bg-violet-50 text-violet-600", dot: "bg-violet-400" },
  BLOCKED: { label: "Blocked", color: "bg-rose-50 text-rose-500", dot: "bg-rose-500" },
  DONE: { label: "Done", color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  ARCHIVED: { label: "Archived", color: "bg-canvas-200 text-ink-tertiary", dot: "bg-ink-tertiary" },
};

// ─── Priority ────────────────────────────────────────────────────────────────

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; icon: string }> = {
  LOW: { label: "Low", color: "text-ink-tertiary", icon: "↓" },
  MEDIUM: { label: "Medium", color: "text-amber-500", icon: "→" },
  HIGH: { label: "High", color: "text-rose-500", icon: "↑" },
  URGENT: { label: "Urgent", color: "text-rose-600 font-semibold", icon: "!!" },
};

// ─── Campaign Status ─────────────────────────────────────────────────────────

export const CAMPAIGN_STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; color: string; dot: string }
> = {
  PLANNING: { label: "Planning", color: "bg-sky-50 text-sky-600", dot: "bg-sky-400" },
  ACTIVE: { label: "Active", color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  PAUSED: { label: "Paused", color: "bg-amber-50 text-amber-600", dot: "bg-amber-400" },
  COMPLETED: { label: "Completed", color: "bg-violet-50 text-violet-600", dot: "bg-violet-500" },
  ARCHIVED: { label: "Archived", color: "bg-canvas-200 text-ink-tertiary", dot: "bg-ink-tertiary" },
};

// ─── Platform colors ─────────────────────────────────────────────────────────

export const PLATFORM_CONFIG = {
  instagram: { label: "Instagram", color: "#E1306C", bg: "bg-rose-50" },
  tiktok: { label: "TikTok", color: "#010101", bg: "bg-ink/5" },
  youtube: { label: "YouTube", color: "#FF0000", bg: "bg-rose-50" },
  twitter: { label: "Twitter / X", color: "#1DA1F2", bg: "bg-sky-50" },
  spotify: { label: "Spotify", color: "#1DB954", bg: "bg-emerald-50" },
  apple_music: { label: "Apple Music", color: "#FC3C44", bg: "bg-rose-50" },
  website: { label: "Website", color: "#7C3AED", bg: "bg-violet-50" },
  press: { label: "Press", color: "#6B6B6A", bg: "bg-canvas-200" },
  other: { label: "Other", color: "#A0A09E", bg: "bg-canvas-100" },
} as const;

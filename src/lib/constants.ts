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
  { label: "Campaigns", href: "/projects", icon: FolderKanban },
  { label: "Content", href: "/content", icon: Film },
  { label: "Media Vault", href: "/assets", icon: ImageIcon },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Team", href: "/team", icon: Users },
  { label: "Messages", href: "/channels", icon: MessageSquare },
  { label: "Getting Started", href: "/onboarding", icon: UserCheck },
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
  ARTIST_CEO:               "bg-gold-100 text-gold",
  MANAGEMENT:               "bg-sky-50 text-sky-500",
  CREATIVE_OPS_DIRECTOR:    "bg-emerald-50 text-emerald-500",
  CREATIVE_ASSISTANT:       "bg-amber-50 text-amber-400",
  PHOTOGRAPHER_VIDEOGRAPHER:"bg-rose-50 text-rose-500",
  EDITOR:                   "bg-canvas-200 text-ink-secondary",
  SOCIAL_MEDIA:             "bg-sky-50 text-sky-500",
  GRAPHIC_DESIGNER:         "bg-emerald-50 text-emerald-500",
  CONTRACTOR:               "bg-canvas-200 text-ink-secondary",
};

// ─── Content Pipeline ────────────────────────────────────────────────────────

export const CONTENT_PHASES: { phase: ContentPhase; label: string; color: string }[] = [
  { phase: "IDEA",       label: "Idea",       color: "bg-canvas-200 text-ink-secondary" },
  { phase: "PLANNING",   label: "Planning",   color: "bg-sky-50 text-sky-500" },
  { phase: "PRODUCTION", label: "Production", color: "bg-amber-50 text-amber-400" },
  { phase: "EDITING",    label: "Editing",    color: "bg-gold-100 text-gold" },
  { phase: "REVIEW",     label: "Review",     color: "bg-rose-50 text-rose-500" },
  { phase: "APPROVED",   label: "Approved",   color: "bg-emerald-50 text-emerald-500" },
  { phase: "SCHEDULED",  label: "Scheduled",  color: "bg-emerald-100 text-emerald-500" },
  { phase: "POSTED",     label: "Posted",     color: "bg-emerald-100 text-emerald-500" },
  { phase: "ANALYTICS",  label: "Analytics",  color: "bg-sky-50 text-sky-500" },
  { phase: "ARCHIVED",   label: "Archived",   color: "bg-canvas-200 text-ink-tertiary" },
];

// ─── Task Status ─────────────────────────────────────────────────────────────

export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; dot: string }
> = {
  TODO:       { label: "To Do",       color: "bg-canvas-200 text-ink-secondary",  dot: "bg-ink-tertiary" },
  IN_PROGRESS:{ label: "In Progress", color: "bg-amber-50 text-amber-400",        dot: "bg-amber-400" },
  IN_REVIEW:  { label: "In Review",   color: "bg-gold-100 text-gold",             dot: "bg-gold" },
  BLOCKED:    { label: "Blocked",     color: "bg-rose-50 text-rose-500",          dot: "bg-rose-500" },
  DONE:       { label: "Done",        color: "bg-emerald-50 text-emerald-500",    dot: "bg-emerald-500" },
  ARCHIVED:   { label: "Archived",    color: "bg-canvas-200 text-ink-tertiary",   dot: "bg-ink-tertiary" },
};

// ─── Priority ────────────────────────────────────────────────────────────────

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; icon: string }> = {
  LOW:    { label: "Low",    color: "text-ink-tertiary",            icon: "↓" },
  MEDIUM: { label: "Medium", color: "text-amber-400",               icon: "→" },
  HIGH:   { label: "High",   color: "text-rose-500",                icon: "↑" },
  URGENT: { label: "Urgent", color: "text-rose-500 font-bold",      icon: "!!" },
};

// ─── Campaign Status ─────────────────────────────────────────────────────────

export const CAMPAIGN_STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; color: string; dot: string }
> = {
  PLANNING:  { label: "Planning",  color: "bg-sky-50 text-sky-500",       dot: "bg-sky-500" },
  ACTIVE:    { label: "Active",    color: "bg-emerald-50 text-emerald-500",dot: "bg-emerald-500" },
  PAUSED:    { label: "Paused",    color: "bg-amber-50 text-amber-400",    dot: "bg-amber-400" },
  COMPLETED: { label: "Completed", color: "bg-canvas-200 text-ink-secondary", dot: "bg-ink-secondary" },
  ARCHIVED:  { label: "Archived",  color: "bg-canvas-200 text-ink-tertiary",  dot: "bg-ink-tertiary" },
};

// ─── Platform colors ─────────────────────────────────────────────────────────

export const PLATFORM_CONFIG = {
  instagram:   { label: "Instagram",  color: "#E1306C", bg: "bg-rose-50" },
  tiktok:      { label: "TikTok",     color: "#F5F5F5", bg: "bg-canvas-200" },
  youtube:     { label: "YouTube",    color: "#FF0000", bg: "bg-rose-50" },
  twitter:     { label: "Twitter / X",color: "#4BA8D4", bg: "bg-sky-50" },
  spotify:     { label: "Spotify",    color: "#4CAF7D", bg: "bg-emerald-50" },
  apple_music: { label: "Apple Music",color: "#FC3C44", bg: "bg-rose-50" },
  website:     { label: "Website",    color: "#C8923A", bg: "bg-gold-50" },
  press:       { label: "Press",      color: "#888888", bg: "bg-canvas-200" },
  other:       { label: "Other",      color: "#444444", bg: "bg-canvas-200" },
} as const;

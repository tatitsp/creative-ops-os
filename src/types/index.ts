// ─── Core platform types ────────────────────────────────────────────────────

export type UserRole =
  | "ARTIST_CEO"
  | "MANAGEMENT"
  | "CREATIVE_OPS_DIRECTOR"
  | "CREATIVE_ASSISTANT"
  | "PHOTOGRAPHER_VIDEOGRAPHER"
  | "EDITOR"
  | "SOCIAL_MEDIA"
  | "GRAPHIC_DESIGNER"
  | "CONTRACTOR";

export type UserStatus = "ACTIVE" | "AWAY" | "BUSY" | "OFFLINE";

export type ContentPhase =
  | "IDEA"
  | "PLANNING"
  | "PRODUCTION"
  | "EDITING"
  | "REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "POSTED"
  | "ANALYTICS"
  | "ARCHIVED";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "BLOCKED" | "DONE" | "ARCHIVED";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type CampaignStatus = "PLANNING" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "REVISION_REQUESTED";

export type ContentType =
  | "PHOTO"
  | "VIDEO"
  | "REEL"
  | "STORY"
  | "CAROUSEL"
  | "SHORT"
  | "PODCAST"
  | "BLOG"
  | "TWEET"
  | "OTHER";

export type Platform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitter"
  | "spotify"
  | "apple_music"
  | "website"
  | "press"
  | "other";

// ─── Entity types ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  displayName?: string;
  email: string;
  image?: string;
  role: UserRole;
  status: UserStatus;
  timezone: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  phase: ContentPhase;
  startDate?: string;
  endDate?: string;
  platforms: Platform[];
  coverImage?: string;
  progress: number;
  taskCount: number;
  completedTasks: number;
  teamMembers: User[];
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: User;
  dueDate?: string;
  campaignName?: string;
  type: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  phase: ContentPhase;
  platforms: Platform[];
  scheduledAt?: string;
  assignee?: User;
  campaignName?: string;
  thumbnail?: string;
}

export interface Asset {
  id: string;
  name: string;
  fileType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  tags: string[];
  uploader: User;
  createdAt: string;
}

export interface Approval {
  id: string;
  title: string;
  type: "task" | "content";
  status: ApprovalStatus;
  requester: User;
  requestedAt: string;
  priority: Priority;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface AnalyticsSnapshot {
  platform: Platform;
  followers: number;
  followersGrowth: number;
  impressions: number;
  engagement: number;
  engagementRate: number;
  shares: number;
  saves: number;
}

export interface ActivityItem {
  id: string;
  user: User;
  action: string;
  entityType: string;
  entityName: string;
  timestamp: string;
}

// ─── UI types ────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number | string;
  children?: NavItem[];
}

export interface MetricCard {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "neutral";
  icon?: string;
  color?: string;
}

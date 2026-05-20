// Mock data for Caam1k — second artist workspace

export const CAAM1K_PHOTO =
  "https://i.scdn.co/image/ab6761610000e5ebe0b7e8617073ecad7baaee17";

export const CAAM1K_COVER =
  "https://i.scdn.co/image/ab67616d00004851e7afc98daff07952a21999a5";

export const CAAM1K_RELEASES = [
  {
    id: "c-r1",
    title: "Eastside Evangelist",
    type: "Album",
    status: "ACTIVE" as const,
    releaseDate: "2026-03-14",
    coverImage: CAAM1K_COVER,
    tracklist: [
      "Intro (Fort Worth)",
      "Psalms 7",
      "40 Days & 40 Nights",
      "God's Soldier",
      "Eastside Evangelist",
      "No Weapon",
      "Through the Fire",
      "Still Standing",
    ],
  },
  {
    id: "c-r2",
    title: "God's Soldier",
    type: "Single",
    status: "POSTED" as const,
    releaseDate: "2025-11-08",
    tracklist: ["God's Soldier"],
  },
];

export const CAAM1K_TOP_TRACKS = [
  { title: "Psalms 7", streams: "567K" },
  { title: "40 Days & 40 Nights", streams: "477K" },
  { title: "God's Soldier", streams: "443K" },
];

export const CAAM1K_CAMPAIGNS = [
  {
    id: "cc1",
    name: "Eastside Evangelist — Album Push",
    status: "ACTIVE" as const,
    phase: "ANALYTICS" as const,
    progress: 68,
    taskCount: 16,
    completedTasks: 11,
    startDate: "2026-03-14",
    endDate: "2026-06-30",
    platforms: ["instagram", "tiktok", "spotify", "youtube"],
  },
  {
    id: "cc2",
    name: "Psalms 7 — Playlist Pitching",
    status: "ACTIVE" as const,
    phase: "POSTED" as const,
    progress: 85,
    taskCount: 8,
    completedTasks: 7,
    startDate: "2026-04-01",
    endDate: "2026-05-31",
    platforms: ["spotify"],
  },
  {
    id: "cc3",
    name: "Summer Single — Pre-Production",
    status: "PLANNING" as const,
    phase: "PLANNING" as const,
    progress: 12,
    taskCount: 10,
    completedTasks: 1,
    startDate: "2026-06-01",
    endDate: "2026-08-01",
    platforms: ["instagram", "tiktok", "spotify"],
  },
];

export const CAAM1K_ANALYTICS = [
  {
    platform: "instagram",
    followers: 12400,
    followersGrowth: 4.3,
    impressions: 98000,
    engagement: 5200,
    engagementRate: 6.1,
  },
  {
    platform: "tiktok",
    followers: 8900,
    followersGrowth: 9.7,
    impressions: 210000,
    engagement: 14000,
    engagementRate: 7.8,
  },
  {
    platform: "spotify",
    followers: 3200,
    followersGrowth: 6.2,
    impressions: 55787,
    engagement: 3200,
    engagementRate: 19.4,
  },
];

export const CAAM1K_TEAM = [
  {
    id: "ct1",
    name: "Tatiyana",
    displayName: "Tati",
    email: "whoistati@thesighteproject.com",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=96&h=96&fit=crop",
    role: "Creative Director",
    status: "ACTIVE" as const,
  },
  {
    id: "ct2",
    name: "Darius King",
    displayName: "Darius",
    email: "darius@liltonystudio.io",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop",
    role: "Editor",
    status: "BUSY" as const,
  },
  {
    id: "ct3",
    name: "Amara Osei",
    displayName: "Amara",
    email: "amara@liltonystudio.io",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=96&h=96&fit=crop",
    role: "Graphic Designer",
    status: "ACTIVE" as const,
  },
];

export const CAAM1K_CONTENT = [
  {
    id: "cc-ci1",
    title: "Psalms 7 — Hook reel (Instagram/TikTok)",
    type: "REEL",
    phase: "POSTED",
    platforms: ["instagram", "tiktok"],
    scheduledAt: "2026-05-10T14:00:00Z",
  },
  {
    id: "cc-ci2",
    title: "Eastside Evangelist — Album trailer (YouTube)",
    type: "VIDEO",
    phase: "POSTED",
    platforms: ["youtube"],
    scheduledAt: "2026-03-12T16:00:00Z",
  },
  {
    id: "cc-ci3",
    title: "40 Days & 40 Nights — Lyric video snippet",
    type: "REEL",
    phase: "EDITING",
    platforms: ["instagram", "tiktok"],
    scheduledAt: "2026-05-28T12:00:00Z",
  },
  {
    id: "cc-ci4",
    title: "God's Soldier — Testimony carousel",
    type: "CAROUSEL",
    phase: "REVIEW",
    platforms: ["instagram"],
    scheduledAt: "2026-06-05T18:00:00Z",
  },
  {
    id: "cc-ci5",
    title: "Fort Worth origin story — BTS doc clip",
    type: "VIDEO",
    phase: "PRODUCTION",
    platforms: ["youtube", "instagram"],
    scheduledAt: "2026-06-15T10:00:00Z",
  },
];

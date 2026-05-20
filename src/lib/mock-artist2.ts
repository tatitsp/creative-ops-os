// Mock data for Miriam — second artist workspace (lighter dataset)

export const MIRIAM_PHOTO =
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face";

export const MIRIAM_RELEASES = [
  {
    id: "m-r1",
    title: "Still Waters",
    type: "EP",
    status: "PLANNING" as const,
    releaseDate: "2026-08-01",
    tracklist: [
      "Still Waters (Intro)",
      "Overflow",
      "He Restores",
      "Valleys",
      "Peace That Passes",
    ],
    coverColor: "#1E3A5F",
  },
  {
    id: "m-r2",
    title: "Overflow",
    type: "Single",
    status: "PRODUCTION" as const,
    releaseDate: "2026-06-15",
    tracklist: ["Overflow"],
    coverColor: "#2D4A3E",
  },
];

export const MIRIAM_CAMPAIGNS = [
  {
    id: "mc1",
    name: "Still Waters — EP Pre-Save Push",
    status: "PLANNING" as const,
    phase: "PLANNING" as const,
    progress: 22,
    taskCount: 12,
    completedTasks: 3,
    startDate: "2026-06-01",
    endDate: "2026-08-15",
    platforms: ["instagram", "spotify", "youtube"],
  },
  {
    id: "mc2",
    name: "Overflow — Single Launch",
    status: "ACTIVE" as const,
    phase: "PRODUCTION" as const,
    progress: 55,
    taskCount: 8,
    completedTasks: 4,
    startDate: "2026-05-15",
    endDate: "2026-06-20",
    platforms: ["instagram", "tiktok", "spotify"],
  },
];

export const MIRIAM_ANALYTICS = [
  {
    platform: "instagram",
    followers: 18400,
    followersGrowth: 5.2,
    impressions: 142000,
    engagement: 7100,
    engagementRate: 5.8,
  },
  {
    platform: "tiktok",
    followers: 31200,
    followersGrowth: 11.4,
    impressions: 480000,
    engagement: 27000,
    engagementRate: 7.1,
  },
  {
    platform: "spotify",
    followers: 4800,
    followersGrowth: 8.9,
    impressions: 84000,
    engagement: 4800,
    engagementRate: 22.4,
  },
];

export const MIRIAM_TEAM = [
  {
    id: "mt1",
    name: "Tatiyana",
    displayName: "Tati",
    email: "whoistati@thesighteproject.com",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=96&h=96&fit=crop",
    role: "Creative Director",
  },
  {
    id: "mt2",
    name: "Amara Osei",
    displayName: "Amara",
    email: "amara@liltonystudio.io",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=96&h=96&fit=crop",
    role: "Graphic Designer",
  },
  {
    id: "mt3",
    name: "Kaito Mori",
    displayName: "Kaito",
    email: "kaito@liltonystudio.io",
    role: "Photographer / Videographer",
  },
];

export const MIRIAM_CONTENT = [
  {
    id: "mc-ci1",
    title: "Overflow — Lyric reel (hook section)",
    type: "REEL",
    phase: "PLANNING",
    platforms: ["instagram", "tiktok"],
    scheduledAt: "2026-06-10T14:00:00Z",
  },
  {
    id: "mc-ci2",
    title: "Still Waters — Artist intro story series",
    type: "STORY",
    phase: "DRAFT",
    platforms: ["instagram"],
    scheduledAt: "2026-06-05T18:00:00Z",
  },
  {
    id: "mc-ci3",
    title: "He Restores — Devotional carousel",
    type: "CAROUSEL",
    phase: "PLANNING",
    platforms: ["instagram"],
    scheduledAt: "2026-06-20T12:00:00Z",
  },
];

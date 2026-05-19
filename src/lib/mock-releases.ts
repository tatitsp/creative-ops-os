// Release Command Center — Mock data for "Elijah" by Lil Tony

export type ReleaseType = "SINGLE" | "EP" | "ALBUM" | "MERCH_DROP" | "TOUR";
export type ReleaseStatus = "CONCEPT" | "PRE_RELEASE" | "RELEASE_WEEK" | "RELEASED" | "ARCHIVED";
export type MilestoneStatus = "COMPLETED" | "CURRENT" | "UPCOMING";
export type ApprovalStage =
  | "DRAFT"
  | "INTERNAL_REVIEW"
  | "ARTIST_REVIEW"
  | "MANAGEMENT_APPROVAL"
  | "SCHEDULED"
  | "POSTED";
export type AssetStage = "PRE_PRODUCTION" | "PRODUCTION" | "PRE_RELEASE" | "LAUNCH" | "POST_RELEASE";
export type AssetStatus = "DONE" | "IN_PROGRESS" | "PENDING" | "BLOCKED";
export type ContentDropType =
  | "MUSIC_VIDEO"
  | "REEL"
  | "TEASER"
  | "ANNOUNCEMENT"
  | "BTS"
  | "STATIC"
  | "PRESS"
  | "RELEASE_DAY"
  | "SNIPPET";

export interface RolloutMilestone {
  id: string;
  label: string;
  sublabel?: string;
  date: string;
  status: MilestoneStatus;
  isKeyDate?: boolean;
}

export interface ContentDrop {
  id: string;
  title: string;
  type: ContentDropType;
  platforms: string[];
  date: string;
  stage: ApprovalStage;
  assignee?: string;
  notes?: string;
}

export interface ReleaseAsset {
  id: string;
  name: string;
  stage: AssetStage;
  status: AssetStatus;
  fileType?: string;
  dueDate?: string;
  assignee?: string;
  count?: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  type: string;
  stage: ApprovalStage;
  submittedBy: string;
  submittedAt?: string;
  reviewer?: string;
  feedback?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}

export interface PlatformTask {
  id: string;
  label: string;
  done: boolean;
  required: boolean;
  notes?: string;
}

export interface PlatformChecklist {
  platform: string;
  label: string;
  color: string;
  bg: string;
  tasks: PlatformTask[];
}

export interface Release {
  id: string;
  title: string;
  artist: string;
  type: ReleaseType;
  status: ReleaseStatus;
  releaseDate: string;
  announcementDate: string;
  coverArt?: string;
  trackCount: number;
  leadSingles: string[];
  description: string;
  milestones: RolloutMilestone[];
  contentDrops: ContentDrop[];
  assets: ReleaseAsset[];
  approvals: ApprovalItem[];
  platformChecklists: PlatformChecklist[];
  analytics: {
    preSaves: number;
    weekOneStreams: number;
    weekOneTikTokSounds: number;
    pressPickups: number;
    editorialPlaylists: string[];
    weekOneYouTubeViews: number;
    peakChartPosition?: string;
    followersGained: number;
  };
}

// ─── Elijah by Lil Tony ─────────────────────────────────────────────────────

export const MOCK_RELEASES: Release[] = [
  {
    id: "elijah",
    title: "Elijah",
    artist: "Lil Tony Official",
    type: "ALBUM",
    status: "PRE_RELEASE",
    releaseDate: "2026-07-18",
    announcementDate: "2026-05-28",
    trackCount: 12,
    leadSingles: ["Gravity", "Elijah"],
    description:
      "12-track album named after his real middle name — Tekai Elijah Key. A deeply personal body of work exploring faith, survival, and identity. Cinematic production, introspective lyricism, and a carefully constructed visual world.",

    // ─── Timeline milestones ─────────────────────────────────────────────
    milestones: [
      {
        id: "m1",
        label: "Concept Lock",
        sublabel: "Brief + moodboard finalized",
        date: "2026-05-01",
        status: "COMPLETED",
      },
      {
        id: "m2",
        label: "Single 1 Announcement",
        sublabel: '"Gravity" + press rollout',
        date: "2026-05-28",
        status: "COMPLETED",
      },
      {
        id: "m3",
        label: '"Gravity" MV Premiere',
        sublabel: "YouTube + cross-platform push",
        date: "2026-06-03",
        status: "CURRENT",
        isKeyDate: true,
      },
      {
        id: "m4",
        label: "Pre-Save Campaign",
        sublabel: "All DSPs · link goes live",
        date: "2026-06-10",
        status: "UPCOMING",
      },
      {
        id: "m5",
        label: "Visual Rollout Begins",
        sublabel: "Moodboard + aesthetic reveal",
        date: "2026-06-17",
        status: "UPCOMING",
      },
      {
        id: "m6",
        label: "Tracklist Reveal",
        sublabel: "Features + artwork",
        date: "2026-06-27",
        status: "UPCOMING",
      },
      {
        id: "m7",
        label: "Listening Event",
        sublabel: "Press + tastemakers (invite only)",
        date: "2026-07-11",
        status: "UPCOMING",
      },
      {
        id: "m8",
        label: "RELEASE DAY",
        sublabel: "Elijah — everywhere",
        date: "2026-07-18",
        status: "UPCOMING",
        isKeyDate: true,
      },
      {
        id: "m9",
        label: "Post-Release Push",
        sublabel: "Week 1 content + press follow-up",
        date: "2026-07-25",
        status: "UPCOMING",
      },
      {
        id: "m10",
        label: "Tour Announcement",
        sublabel: "Fall 2026 dates revealed",
        date: "2026-08-08",
        status: "UPCOMING",
      },
    ],

    // ─── Content drops ────────────────────────────────────────────────────
    contentDrops: [
      {
        id: "cd1",
        title: '"Elijah is coming" — Cryptic teaser post',
        type: "TEASER",
        platforms: ["instagram", "twitter"],
        date: "2026-05-20",
        stage: "POSTED",
        assignee: "Sofia Reyes",
        notes: "Black card, title text only. No further context.",
      },
      {
        id: "cd2",
        title: '"Gravity" — Single announcement graphic',
        type: "ANNOUNCEMENT",
        platforms: ["instagram", "twitter", "tiktok"],
        date: "2026-05-28",
        stage: "POSTED",
        assignee: "Amara Osei",
      },
      {
        id: "cd3",
        title: '"Gravity" — Official music video',
        type: "MUSIC_VIDEO",
        platforms: ["youtube", "instagram"],
        date: "2026-06-03",
        stage: "SCHEDULED",
        assignee: "Darius King",
        notes: "Premiere on YouTube. Vertical edit posted to IG Reels simultaneously.",
      },
      {
        id: "cd4",
        title: '"Gravity" — Vertical edit (60s)',
        type: "REEL",
        platforms: ["instagram", "tiktok"],
        date: "2026-06-03",
        stage: "MANAGEMENT_APPROVAL",
        assignee: "Darius King",
      },
      {
        id: "cd5",
        title: "Studio session BTS — Recording day",
        type: "BTS",
        platforms: ["instagram", "tiktok"],
        date: "2026-06-10",
        stage: "ARTIST_REVIEW",
        assignee: "Kaito Mori",
      },
      {
        id: "cd6",
        title: "Pre-save campaign launch — Link + visual",
        type: "ANNOUNCEMENT",
        platforms: ["instagram", "twitter", "tiktok"],
        date: "2026-06-10",
        stage: "INTERNAL_REVIEW",
        assignee: "Sofia Reyes",
      },
      {
        id: "cd7",
        title: '"Smoke & Mirrors" — 30s snippet',
        type: "SNIPPET",
        platforms: ["tiktok", "instagram"],
        date: "2026-06-20",
        stage: "DRAFT",
        assignee: "Sofia Reyes",
      },
      {
        id: "cd8",
        title: "Tracklist reveal graphic",
        type: "STATIC",
        platforms: ["instagram", "twitter"],
        date: "2026-06-27",
        stage: "DRAFT",
        assignee: "Amara Osei",
      },
      {
        id: "cd9",
        title: "Feature announcement thread",
        type: "ANNOUNCEMENT",
        platforms: ["twitter"],
        date: "2026-07-04",
        stage: "DRAFT",
        assignee: "Tatiyana",
      },
      {
        id: "cd10",
        title: "Listening event recap reel",
        type: "REEL",
        platforms: ["instagram", "tiktok"],
        date: "2026-07-12",
        stage: "DRAFT",
        assignee: "Kaito Mori",
      },
      {
        id: "cd11",
        title: "Final countdown — 72hr series (3 reels)",
        type: "TEASER",
        platforms: ["instagram", "tiktok"],
        date: "2026-07-15",
        stage: "DRAFT",
        assignee: "Darius King",
      },
      {
        id: "cd12",
        title: "RELEASE DAY — Full rollout package",
        type: "RELEASE_DAY",
        platforms: ["instagram", "tiktok", "youtube", "twitter", "spotify", "apple_music"],
        date: "2026-07-18",
        stage: "DRAFT",
        assignee: "Tatiyana",
        notes: "Coordinated multi-platform drop. All content goes live at 12AM EST.",
      },
    ],

    // ─── Assets ───────────────────────────────────────────────────────────
    assets: [
      // Pre-Production
      { id: "a1", name: "Rollout brief", stage: "PRE_PRODUCTION", status: "DONE", fileType: "doc" },
      { id: "a2", name: "Visual moodboard", stage: "PRE_PRODUCTION", status: "DONE", fileType: "pdf" },
      { id: "a3", name: "Tracklist (final)", stage: "PRE_PRODUCTION", status: "DONE", fileType: "doc" },
      { id: "a4", name: "Artwork direction doc", stage: "PRE_PRODUCTION", status: "DONE", fileType: "doc" },
      { id: "a5", name: "Budget breakdown", stage: "PRE_PRODUCTION", status: "DONE", fileType: "sheet" },
      // Production
      { id: "a6", name: "Album cover art (final)", stage: "PRODUCTION", status: "DONE", fileType: "image", assignee: "Amara Osei" },
      { id: "a7", name: '"Gravity" single artwork', stage: "PRODUCTION", status: "DONE", fileType: "image", assignee: "Amara Osei" },
      { id: "a8", name: '"Gravity" music video', stage: "PRODUCTION", status: "DONE", fileType: "video", assignee: "Darius King" },
      { id: "a9", name: "Press photos — Set A (25 selects)", stage: "PRODUCTION", status: "DONE", fileType: "image", assignee: "Kaito Mori" },
      { id: "a10", name: "Press photos — Set B (20 selects)", stage: "PRODUCTION", status: "IN_PROGRESS", fileType: "image", assignee: "Kaito Mori", dueDate: "2026-06-05" },
      { id: "a11", name: "Album trailer (90s)", stage: "PRODUCTION", status: "IN_PROGRESS", fileType: "video", assignee: "Darius King", dueDate: "2026-06-10" },
      { id: "a12", name: "Visualizer pack (12 tracks)", stage: "PRODUCTION", status: "IN_PROGRESS", fileType: "video", assignee: "Darius King", count: "2 / 12", dueDate: "2026-07-10" },
      // Pre-Release
      { id: "a13", name: "Distribution files submitted", stage: "PRE_RELEASE", status: "DONE" },
      { id: "a14", name: "DSP pitch assets", stage: "PRE_RELEASE", status: "DONE" },
      { id: "a15", name: "Press kit (full)", stage: "PRE_RELEASE", status: "DONE", assignee: "Tatiyana" },
      { id: "a16", name: "Social content calendar", stage: "PRE_RELEASE", status: "IN_PROGRESS", assignee: "Sofia Reyes", dueDate: "2026-06-01" },
      { id: "a17", name: "Single artwork — Tracks 2–12", stage: "PRE_RELEASE", status: "PENDING", assignee: "Amara Osei", dueDate: "2026-07-01" },
      { id: "a18", name: "EPK video (3 min)", stage: "PRE_RELEASE", status: "PENDING", assignee: "Darius King", dueDate: "2026-07-05" },
      { id: "a19", name: "Lyric videos — All 12 tracks", stage: "PRE_RELEASE", status: "PENDING", assignee: "Darius King", dueDate: "2026-07-15" },
      // Launch
      { id: "a20", name: "Listening event invitation design", stage: "LAUNCH", status: "PENDING", assignee: "Amara Osei", dueDate: "2026-07-01" },
      { id: "a21", name: "Release day rollout kit (all formats)", stage: "LAUNCH", status: "PENDING", dueDate: "2026-07-15" },
      { id: "a22", name: "Day-of social copy (all platforms)", stage: "LAUNCH", status: "PENDING", assignee: "Sofia Reyes", dueDate: "2026-07-16" },
      // Post-Release
      { id: "a23", name: "Week 1 recap reel", stage: "POST_RELEASE", status: "PENDING" },
      { id: "a24", name: "Analytics & performance report", stage: "POST_RELEASE", status: "PENDING" },
      { id: "a25", name: "Thank you content series", stage: "POST_RELEASE", status: "PENDING" },
    ],

    // ─── Approvals ────────────────────────────────────────────────────────
    approvals: [
      {
        id: "ap1",
        title: "Album cover art — Final",
        type: "Asset",
        stage: "POSTED",
        submittedBy: "Amara Osei",
        submittedAt: "2026-05-10T09:00:00Z",
        reviewer: "Lil Tony Official",
        priority: "HIGH",
      },
      {
        id: "ap2",
        title: '"Gravity" announcement copy',
        type: "Copy",
        stage: "POSTED",
        submittedBy: "Sofia Reyes",
        submittedAt: "2026-05-26T14:00:00Z",
        reviewer: "Lil Tony Official",
        priority: "HIGH",
      },
      {
        id: "ap3",
        title: '"Gravity" music video — Final cut',
        type: "Video",
        stage: "MANAGEMENT_APPROVAL",
        submittedBy: "Darius King",
        submittedAt: "2026-05-30T11:00:00Z",
        reviewer: "Tatiyana",
        priority: "URGENT",
      },
      {
        id: "ap4",
        title: '"Gravity" vertical edit (60s)',
        type: "Video",
        stage: "MANAGEMENT_APPROVAL",
        submittedBy: "Darius King",
        submittedAt: "2026-05-31T10:00:00Z",
        reviewer: "Tatiyana",
        priority: "HIGH",
      },
      {
        id: "ap5",
        title: "Studio BTS reel — Recording day",
        type: "Reel",
        stage: "ARTIST_REVIEW",
        submittedBy: "Kaito Mori",
        submittedAt: "2026-06-01T16:00:00Z",
        reviewer: "Lil Tony Official",
        priority: "MEDIUM",
      },
      {
        id: "ap6",
        title: "Pre-save campaign visual",
        type: "Asset",
        stage: "INTERNAL_REVIEW",
        submittedBy: "Sofia Reyes",
        submittedAt: "2026-06-02T09:00:00Z",
        priority: "MEDIUM",
      },
      {
        id: "ap7",
        title: 'Social copy — Week of June 10',
        type: "Copy",
        stage: "INTERNAL_REVIEW",
        submittedBy: "Sofia Reyes",
        submittedAt: "2026-06-02T10:30:00Z",
        priority: "MEDIUM",
      },
      {
        id: "ap8",
        title: '"Smoke & Mirrors" 30s snippet edit',
        type: "Video",
        stage: "DRAFT",
        submittedBy: "Darius King",
        priority: "LOW",
      },
      {
        id: "ap9",
        title: "Tracklist reveal graphic",
        type: "Asset",
        stage: "DRAFT",
        submittedBy: "Amara Osei",
        priority: "MEDIUM",
      },
      {
        id: "ap10",
        title: "Press release — Album announcement",
        type: "Copy",
        stage: "DRAFT",
        submittedBy: "Tatiyana",
        priority: "HIGH",
      },
    ],

    // ─── Platform checklists ─────────────────────────────────────────────
    platformChecklists: [
      {
        platform: "spotify",
        label: "Spotify",
        color: "#1DB954",
        bg: "bg-emerald-50",
        tasks: [
          { id: "sp1", label: "Distribution submitted via DistroKid", done: true, required: true },
          { id: "sp2", label: "ISRC codes registered for all 12 tracks", done: true, required: true },
          { id: "sp3", label: "Pre-save link generated & live", done: true, required: true },
          { id: "sp4", label: "Spotify for Artists profile updated", done: true, required: true },
          { id: "sp5", label: "Editorial playlist pitching submitted", done: true, required: true, notes: "Pitched: New Music Friday, Rap Caviar, Most Necessary" },
          { id: "sp6", label: "Canvas videos uploaded (lead singles)", done: false, required: true },
          { id: "sp7", label: "Lyrics submitted via Musixmatch", done: false, required: false },
          { id: "sp8", label: "Artist radio seeding requested", done: false, required: false },
          { id: "sp9", label: "Podcast/interview scheduled", done: false, required: false },
        ],
      },
      {
        platform: "apple_music",
        label: "Apple Music",
        color: "#FC3C44",
        bg: "bg-rose-50",
        tasks: [
          { id: "am1", label: "Distribution submitted", done: true, required: true },
          { id: "am2", label: "Pre-add link live", done: true, required: true },
          { id: "am3", label: "Artist bio updated", done: true, required: true },
          { id: "am4", label: "Artist story written and submitted", done: false, required: false },
          { id: "am5", label: "Exclusive content / first listen submitted", done: false, required: false },
          { id: "am6", label: "Lyrics submitted", done: false, required: false },
          { id: "am7", label: "Apple Music editorial pitch", done: false, required: true },
        ],
      },
      {
        platform: "youtube",
        label: "YouTube",
        color: "#FF0000",
        bg: "bg-rose-50",
        tasks: [
          { id: "yt1", label: '"Gravity" MV uploaded (unlisted)', done: true, required: true },
          { id: "yt2", label: "YouTube premiere scheduled", done: false, required: true },
          { id: "yt3", label: "Thumbnail approved by artist", done: false, required: true },
          { id: "yt4", label: "Video chapters / timestamps added", done: false, required: false },
          { id: "yt5", label: "Description + credits finalized", done: false, required: true },
          { id: "yt6", label: "Community post drafted for premiere", done: false, required: false },
          { id: "yt7", label: "End screen + cards configured", done: false, required: false },
          { id: "yt8", label: "Shorts reposts (vertical clips)", done: false, required: false },
        ],
      },
      {
        platform: "instagram",
        label: "Instagram",
        color: "#E1306C",
        bg: "bg-rose-50",
        tasks: [
          { id: "ig1", label: "Bio updated with pre-save link", done: true, required: true },
          { id: "ig2", label: "Profile photo updated", done: true, required: false },
          { id: "ig3", label: "Cover announcement reel ready", done: false, required: true },
          { id: "ig4", label: "Reels series planned (5 reels min)", done: false, required: true, notes: "1/5 completed" },
          { id: "ig5", label: "Story schedule set in planning doc", done: false, required: true },
          { id: "ig6", label: "Collab posts with features confirmed", done: false, required: false },
          { id: "ig7", label: "Highlight cover artwork created", done: false, required: false },
        ],
      },
      {
        platform: "tiktok",
        label: "TikTok",
        color: "#010101",
        bg: "bg-canvas-200",
        tasks: [
          { id: "tt1", label: "Sound page preview audio uploaded", done: false, required: true },
          { id: "tt2", label: "Content series mapped (8 videos)", done: false, required: true },
          { id: "tt3", label: "Hashtag strategy finalized", done: true, required: true },
          { id: "tt4", label: "Creator outreach list compiled", done: false, required: false },
          { id: "tt5", label: "Duet / stitch strategy planned", done: false, required: false },
          { id: "tt6", label: "Paid promotion plan approved", done: false, required: false },
        ],
      },
      {
        platform: "twitter",
        label: "Twitter / X",
        color: "#1DA1F2",
        bg: "bg-sky-50",
        tasks: [
          { id: "tw1", label: "Announcement thread drafted", done: true, required: true },
          { id: "tw2", label: "Release day tweet series scheduled", done: false, required: true },
          { id: "tw3", label: "Press pickup RT strategy", done: false, required: false },
          { id: "tw4", label: "Listening party tweet thread", done: false, required: false },
          { id: "tw5", label: "Header image updated", done: false, required: false },
        ],
      },
    ],

    // ─── Post-release analytics ───────────────────────────────────────────
    analytics: {
      preSaves: 12800,
      weekOneStreams: 284000,
      weekOneTikTokSounds: 8400,
      pressPickups: 6,
      editorialPlaylists: ["New Music Friday (US)", "Rap Caviar (Pitched)", "Most Necessary (Pitched)"],
      weekOneYouTubeViews: 0,
      peakChartPosition: "#43 Spotify US Viral 50",
      followersGained: 4200,
    },
  },
];

export function getReleaseById(id: string) {
  return MOCK_RELEASES.find((r) => r.id === id);
}

// ─── Label configs ────────────────────────────────────────────────────────────

export const RELEASE_TYPE_CONFIG: Record<ReleaseType, { label: string; color: string; emoji: string }> = {
  SINGLE: { label: "Single", color: "bg-sky-100 text-sky-700", emoji: "🎵" },
  EP: { label: "EP", color: "bg-gold-100 text-gold", emoji: "💿" },
  ALBUM: { label: "Album", color: "bg-ink text-white", emoji: "🎧" },
  MERCH_DROP: { label: "Merch Drop", color: "bg-amber-100 text-amber-700", emoji: "👕" },
  TOUR: { label: "Tour", color: "bg-emerald-100 text-emerald-700", emoji: "🎤" },
};

export const RELEASE_STATUS_CONFIG: Record<ReleaseStatus, { label: string; color: string; dot: string }> = {
  CONCEPT: { label: "Concept", color: "bg-canvas-200 text-ink-secondary", dot: "bg-ink-tertiary" },
  PRE_RELEASE: { label: "Pre-Release", color: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
  RELEASE_WEEK: { label: "Release Week", color: "bg-gold-100 text-gold", dot: "bg-gold animate-pulse" },
  RELEASED: { label: "Released", color: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  ARCHIVED: { label: "Archived", color: "bg-canvas-200 text-ink-tertiary", dot: "bg-ink-tertiary" },
};

export const APPROVAL_STAGE_CONFIG: Record<
  ApprovalStage,
  { label: string; short: string; color: string; bg: string; index: number }
> = {
  DRAFT: { label: "Draft", short: "Draft", color: "text-ink-tertiary", bg: "bg-canvas-100", index: 0 },
  INTERNAL_REVIEW: { label: "Internal Review", short: "Internal", color: "text-sky-600", bg: "bg-sky-50", index: 1 },
  ARTIST_REVIEW: { label: "Artist Review", short: "Artist", color: "text-gold", bg: "bg-gold-50", index: 2 },
  MANAGEMENT_APPROVAL: { label: "Management", short: "Mgmt", color: "text-amber-600", bg: "bg-amber-50", index: 3 },
  SCHEDULED: { label: "Scheduled", short: "Sched.", color: "text-emerald-600", bg: "bg-emerald-50", index: 4 },
  POSTED: { label: "Posted", short: "Posted", color: "text-emerald-700", bg: "bg-emerald-100", index: 5 },
};

export const ASSET_STAGE_CONFIG: Record<AssetStage, { label: string; color: string }> = {
  PRE_PRODUCTION: { label: "Pre-Production", color: "bg-canvas-200 text-ink-secondary" },
  PRODUCTION: { label: "Production", color: "bg-amber-50 text-amber-700" },
  PRE_RELEASE: { label: "Pre-Release", color: "bg-gold-50 text-gold" },
  LAUNCH: { label: "Launch", color: "bg-rose-50 text-rose-600" },
  POST_RELEASE: { label: "Post-Release", color: "bg-emerald-50 text-emerald-700" },
};

export const ASSET_STATUS_CONFIG: Record<AssetStatus, { label: string; color: string; dot: string }> = {
  DONE: { label: "Done", color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  IN_PROGRESS: { label: "In Progress", color: "bg-amber-50 text-amber-600", dot: "bg-amber-400" },
  PENDING: { label: "Pending", color: "bg-canvas-200 text-ink-tertiary", dot: "bg-ink-tertiary" },
  BLOCKED: { label: "Blocked", color: "bg-rose-50 text-rose-500", dot: "bg-rose-500" },
};

export const DROP_TYPE_CONFIG: Record<ContentDropType, { label: string; color: string }> = {
  MUSIC_VIDEO: { label: "Music Video", color: "bg-gold-100 text-gold" },
  REEL: { label: "Reel", color: "bg-rose-50 text-rose-500" },
  TEASER: { label: "Teaser", color: "bg-amber-50 text-amber-600" },
  ANNOUNCEMENT: { label: "Announcement", color: "bg-sky-50 text-sky-600" },
  BTS: { label: "BTS", color: "bg-canvas-200 text-ink-secondary" },
  STATIC: { label: "Static Post", color: "bg-canvas-200 text-ink-secondary" },
  PRESS: { label: "Press", color: "bg-canvas-200 text-ink-secondary" },
  RELEASE_DAY: { label: "Release Day", color: "bg-ink text-white" },
  SNIPPET: { label: "Snippet", color: "bg-gold-50 text-gold" },
};

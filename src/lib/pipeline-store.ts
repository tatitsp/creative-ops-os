import type { ContentItem, ContentType, Platform } from "@/types";

// Minimal shape of a VideoRow needed for slot expansion
interface VideoRowInput {
  type: string;
  count: number;
  platforms: string;
}

const STORAGE_KEY = "creative-ops-pipeline-slots";

// ─── Row → readable short name ────────────────────────────────────────────────

function rowShortName(type: string): string {
  if (type.includes("Music Video"))            return "Official Video";
  if (type.includes("Vertical Edit"))          return "Vertical Cut";
  if (type.includes("Visualizer") || type.includes("Lyric")) return "Visualizer";
  if (type.includes("Short-form") || type.includes("short-form") || type.includes("clip")) return "TikTok Clip";
  if (type.includes("Trailer"))                return "Album Trailer";
  if (type.includes("Teaser Reel"))            return "TikTok Teaser";
  if (type.includes("Release Day"))            return "Release Day Pack";
  if (type.includes("BTS") || type.includes("Studio Reel")) return "BTS Clip";
  if (type.includes("Album Single"))           return "Single Visualizer";
  if (type.includes("Deep Cut"))               return "Deep Cut Visual";
  return type.split("—").pop()?.trim() ?? type;
}

// ─── Row → ContentType ────────────────────────────────────────────────────────

function rowToContentType(type: string): ContentType {
  if (type.includes("Music Video"))                                      return "VIDEO";
  if (type.includes("Vertical") || type.includes("BTS") || type.includes("Studio")) return "REEL";
  if (type.includes("Teaser") || type.includes("Trailer"))               return "VIDEO";
  if (type.includes("Visualizer") || type.includes("Lyric"))             return "VIDEO";
  if (type.includes("Release Day"))                                      return "VIDEO";
  if (type.includes("short-form") || type.includes("clip"))              return "REEL";
  return "VIDEO";
}

// ─── Platform string → Platform[] ────────────────────────────────────────────

function parsePlatforms(label: string): Platform[] {
  const map: Record<string, Platform> = {
    youtube:  "youtube",
    instagram: "instagram",
    ig:       "instagram",
    tiktok:   "tiktok",
    spotify:  "spotify",
    twitter:  "twitter",
    apple:    "apple_music" as Platform,
  };
  const result: Platform[] = [];
  const lower = label.toLowerCase();
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key) && !result.includes(val)) result.push(val);
  }
  return result.length ? result : ["instagram", "tiktok", "youtube"];
}

// ─── Expand rows into individual titled ContentItems ──────────────────────────

export function expandRowsToContentItems(
  rows: VideoRowInput[],
  releaseName: string,
  campaignId: string,
  campaignName: string,
): ContentItem[] {
  const items: ContentItem[] = [];
  const nameCounts: Record<string, number> = {};

  for (const row of rows) {
    const shortName = rowShortName(row.type);
    const type = rowToContentType(row.type);
    const platforms = parsePlatforms(row.platforms);

    for (let i = 0; i < row.count; i++) {
      nameCounts[shortName] = (nameCounts[shortName] ?? 0) + 1;
      const num = String(nameCounts[shortName]).padStart(2, "0");
      // Singles don't need a number suffix
      const title =
        row.count === 1
          ? `${releaseName} – ${shortName}`
          : `${releaseName} – ${shortName} ${num}`;

      items.push({
        id: `gen-${campaignId}-${shortName.replace(/\s+/g, "-").toLowerCase()}-${num}-${Date.now()}`,
        title,
        type,
        phase: "PLANNING",
        platforms,
        campaignName,
      });
    }
  }

  return items;
}

// ─── Store API ────────────────────────────────────────────────────────────────

export function savePipelineSlots(items: ContentItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable — fail silently
  }
}

export function loadPipelineSlots(): ContentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ContentItem[]) : [];
  } catch {
    return [];
  }
}

export function clearPipelineSlots(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* empty */ }
}

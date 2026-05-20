import type { User } from "@/types";

// Returns the short display name with a trailing period: "Key.", "Tati.", "Sofia.", etc.
export function getDisplayName(user: User): string {
  const base = user.displayName ?? user.name.split(" ")[0];
  return `${base}.`;
}

const POOLS = {
  morning:   ["Good morning", "Rise and grind", "New day. Let's move.", "Early bird.", "Morning, let's get it."],
  afternoon: ["Good afternoon", "Keep pushing.", "Still building.", "Midday check in.", "Don't stop now."],
  evening:   ["Good evening", "End strong.", "How'd today go?", "Almost there.", "Finish what you started."],
  night:     ["Still up?", "Burning the midnight oil.", "Late night mode.", "The night shift.", "Rest is productive too."],
};

// Returns a time-sensitive greeting string: "Good morning, Tati."
export function pickGreeting(displayName: string): string {
  const h = new Date().getHours();
  const pool =
    h >= 5 && h < 12  ? POOLS.morning   :
    h >= 12 && h < 17 ? POOLS.afternoon :
    h >= 17 && h < 21 ? POOLS.evening   :
                        POOLS.night;
  const base = pool[Math.floor(Math.random() * pool.length)];
  // If the phrase ends in punctuation other than comma, join with a space; otherwise use ", "
  return /[?.!]$/.test(base) ? `${base} ${displayName}` : `${base}, ${displayName}`;
}

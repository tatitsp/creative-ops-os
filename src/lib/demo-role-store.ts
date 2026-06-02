import { create } from "zustand";

export type DemoRole = "creative-director" | "artist-ceo" | "team-member" | "management";

export const DEMO_ROLES: { value: DemoRole; label: string; description: string }[] = [
  { value: "creative-director", label: "Creative Director", description: "Full access" },
  { value: "artist-ceo",        label: "Artist / CEO",      description: "Artist portal view" },
  { value: "team-member",       label: "Team Member",       description: "Limited access" },
  { value: "management",        label: "Management",        description: "Ops & approvals" },
];

// hrefs visible per role. "*" = unrestricted
export const ROLE_ALLOWED_HREFS: Record<DemoRole, string[] | "*"> = {
  "creative-director": "*",
  "artist-ceo":   ["/dashboard", "/artist-portal", "/releases", "/content", "/calendar", "/analytics", "/assets", "/settings"],
  "team-member":  ["/dashboard", "/content", "/assets", "/calendar", "/channels"],
  "management":   ["/dashboard", "/approvals", "/budget", "/releases", "/projects", "/analytics", "/settings"],
};

export function isHrefAllowed(href: string, role: DemoRole): boolean {
  const allowed = ROLE_ALLOWED_HREFS[role];
  if (allowed === "*") return true;
  return allowed.some((path) => href === path || href.endsWith(path));
}

interface DemoRoleStore {
  role: DemoRole;
  setRole: (role: DemoRole) => void;
}

export const useDemoRole = create<DemoRoleStore>((set) => ({
  role: "creative-director",
  setRole: (role) => set({ role }),
}));

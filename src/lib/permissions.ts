// ─── Permission system ───────────────────────────────────────────────────────
//
// Roles are grouped into 4 tiers. All 9 UserRole enum values are supported —
// tier assignment is the only thing that changes behavior.
//
// Tier membership:
//   creative_director → CREATIVE_OPS_DIRECTOR
//   artist_ceo        → ARTIST_CEO
//   management        → MANAGEMENT
//   team_member       → CREATIVE_ASSISTANT, PHOTOGRAPHER_VIDEOGRAPHER, EDITOR,
//                        SOCIAL_MEDIA, GRAPHIC_DESIGNER, CONTRACTOR

export type Permission =
  | "view_workspace"
  | "view_all_assigned_workspaces"
  | "create_edit_tasks"
  | "approve_content"
  | "upload_assets"
  | "view_analytics"
  | "manage_team"
  | "view_budget"
  | "use_copilot"
  | "access_admin";

type PermissionTier = "creative_director" | "artist_ceo" | "management" | "team_member";

const ROLE_TIER: Record<string, PermissionTier> = {
  CREATIVE_OPS_DIRECTOR:       "creative_director",
  ARTIST_CEO:                  "artist_ceo",
  MANAGEMENT:                  "management",
  CREATIVE_ASSISTANT:          "team_member",
  PHOTOGRAPHER_VIDEOGRAPHER:   "team_member",
  EDITOR:                      "team_member",
  SOCIAL_MEDIA:                "team_member",
  GRAPHIC_DESIGNER:            "team_member",
  CONTRACTOR:                  "team_member",
};

// Confirmed permission matrix — June 2026
const TIER_PERMISSIONS: Record<PermissionTier, ReadonlySet<Permission>> = {
  creative_director: new Set<Permission>([
    "view_workspace",
    "view_all_assigned_workspaces",
    "create_edit_tasks",
    "approve_content",
    "upload_assets",
    "view_analytics",
    "manage_team",
    "view_budget",
    "use_copilot",
  ]),
  artist_ceo: new Set<Permission>([
    "view_workspace",
    // NO view_all_assigned_workspaces — own workspace only
    "create_edit_tasks",
    "approve_content",
    "upload_assets",
    "view_analytics",
    "view_budget",
  ]),
  management: new Set<Permission>([
    "view_workspace",
    "view_all_assigned_workspaces",
    "create_edit_tasks",
    "approve_content",
    "view_analytics",
    "view_budget",
    "use_copilot",
  ]),
  team_member: new Set<Permission>([
    "view_workspace",
    "view_all_assigned_workspaces",
    "upload_assets",
    // create_edit_tasks: own tasks only — checked via canEditTask()
    // NO approve_content, view_analytics, manage_team, view_budget, use_copilot
  ]),
};

export function getRoleTier(role: string): PermissionTier | null {
  return ROLE_TIER[role] ?? null;
}

export function roleHasPermission(role: string, permission: Permission): boolean {
  const tier = getRoleTier(role);
  if (!tier) return false;
  return (TIER_PERMISSIONS[tier] as Set<Permission>).has(permission);
}

// Team members can create/edit only their own tasks.
// All other tiers with create_edit_tasks can edit any task.
export function canEditTask(role: string, isOwnTask: boolean): boolean {
  const tier = getRoleTier(role);
  if (!tier) return false;
  if (tier === "team_member") return isOwnTask;
  return (TIER_PERMISSIONS[tier] as Set<Permission>).has("create_edit_tasks");
}

// Returns the human-readable permission summary for a role (used in admin UI).
export function getPermissionSummary(role: string): Permission[] {
  const tier = getRoleTier(role);
  if (!tier) return [];
  return Array.from(TIER_PERMISSIONS[tier] as Set<Permission>);
}

export const PERMISSION_LABELS: Record<Permission, string> = {
  view_workspace:                "View workspace",
  view_all_assigned_workspaces:  "View all assigned workspaces",
  create_edit_tasks:             "Create & edit tasks",
  approve_content:               "Approve content",
  upload_assets:                 "Upload assets",
  view_analytics:                "View analytics",
  manage_team:                   "Manage team (invite/remove)",
  view_budget:                   "View budget",
  use_copilot:                   "Use Copilot",
  access_admin:                  "Access admin panel",
};

export const ALL_PERMISSIONS: Permission[] = Object.keys(PERMISSION_LABELS) as Permission[];

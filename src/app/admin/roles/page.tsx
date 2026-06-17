import type { Metadata } from "next";
import { ALL_PERMISSIONS, PERMISSION_LABELS, getPermissionSummary, getRoleTier } from "@/lib/permissions";

export const metadata: Metadata = { title: "Admin — Roles" };

const ALL_ROLES = [
  "CREATIVE_OPS_DIRECTOR",
  "ARTIST_CEO",
  "MANAGEMENT",
  "CREATIVE_ASSISTANT",
  "PHOTOGRAPHER_VIDEOGRAPHER",
  "EDITOR",
  "SOCIAL_MEDIA",
  "GRAPHIC_DESIGNER",
  "CONTRACTOR",
] as const;

const TIER_LABELS: Record<string, string> = {
  creative_director: "Creative Director",
  artist_ceo: "Artist / CEO",
  management: "Management",
  team_member: "Team Member",
};

const ROLE_DISPLAY: Record<string, string> = {
  CREATIVE_OPS_DIRECTOR:     "Creative Ops Director",
  ARTIST_CEO:                "Artist / CEO",
  MANAGEMENT:                "Management",
  CREATIVE_ASSISTANT:        "Creative Assistant",
  PHOTOGRAPHER_VIDEOGRAPHER: "Photographer / Videographer",
  EDITOR:                    "Editor",
  SOCIAL_MEDIA:              "Social Media",
  GRAPHIC_DESIGNER:          "Graphic Designer",
  CONTRACTOR:                "Contractor",
};

export default function AdminRolesPage() {
  return (
    <div>
      <h1 className="text-lg font-bold text-white mb-1">Role Permissions</h1>
      <p className="text-xs mb-8" style={{ color: "rgba(255,255,255,0.3)" }}>
        Read-only. Permissions are defined in code and grouped into tiers.
        Admin access is controlled exclusively via the{" "}
        <code className="text-xs" style={{ color: "rgba(200,146,58,0.8)" }}>ADMIN_EMAILS</code>{" "}
        environment variable — never by role.
      </p>

      {/* Permission matrix */}
      <div className="overflow-x-auto mb-12">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th
                className="text-left py-3 pr-6 font-medium"
                style={{ color: "rgba(255,255,255,0.4)", minWidth: 200 }}
              >
                Permission
              </th>
              {ALL_ROLES.map((role) => (
                <th
                  key={role}
                  className="text-center py-3 px-3 font-medium"
                  style={{ color: "rgba(255,255,255,0.4)", minWidth: 90 }}
                >
                  <span className="block">{ROLE_DISPLAY[role]}</span>
                  <span
                    className="block text-[10px] mt-0.5"
                    style={{ color: "rgba(200,146,58,0.6)" }}
                  >
                    {TIER_LABELS[getRoleTier(role) ?? ""] ?? ""}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_PERMISSIONS.map((perm) => (
              <tr
                key={perm}
                className="border-t"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <td className="py-2.5 pr-6" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {PERMISSION_LABELS[perm]}
                  {perm === "create_edit_tasks" && (
                    <span
                      className="ml-2 text-[10px]"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      (team: own only)
                    </span>
                  )}
                </td>
                {ALL_ROLES.map((role) => {
                  const has = getPermissionSummary(role).includes(perm);
                  return (
                    <td key={role} className="py-2.5 px-3 text-center">
                      {has ? (
                        <span style={{ color: "#4CAF7D" }}>✓</span>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.12)" }}>—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tier summary */}
      <h2 className="text-sm font-semibold text-white mb-4">Tier Definitions</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(TIER_LABELS).map(([tier, label]) => {
          const roles = ALL_ROLES.filter((r) => getRoleTier(r) === tier);
          return (
            <div
              key={tier}
              className="rounded-xl border p-4"
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
            >
              <p className="text-xs font-semibold text-white mb-2">{label}</p>
              <div className="flex flex-wrap gap-1.5">
                {roles.map((r) => (
                  <span
                    key={r}
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}
                  >
                    {ROLE_DISPLAY[r]}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

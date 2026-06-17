import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { WORKSPACES } from "@/lib/workspaces";

export const metadata: Metadata = { title: "Admin — Workspaces" };
export const dynamic = "force-dynamic";

export default async function AdminWorkspacesPage() {
  const workspaces = await prisma.workspace.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      plan: true,
      createdAt: true,
      _count: { select: { members: true } },
      members: {
        select: {
          role: true,
          user: { select: { id: true, email: true, name: true } },
        },
      },
    },
  });

  // If no workspaces in DB yet, show the static list as a reference
  const display = workspaces.length > 0 ? workspaces : WORKSPACES.map((ws) => ({
    id: ws.slug,
    name: ws.artistName,
    slug: ws.slug,
    plan: "STARTER" as const,
    createdAt: new Date(),
    _count: { members: 0 },
    members: [],
  }));

  return (
    <div>
      <h1 className="text-lg font-bold text-white mb-1">Workspaces</h1>
      <p className="text-xs mb-8" style={{ color: "rgba(255,255,255,0.3)" }}>
        All artist workspaces in the system.
      </p>

      <div className="space-y-4">
        {display.map((ws) => (
          <div
            key={ws.id}
            className="rounded-xl border p-6"
            style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-white">{ws.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  /{ws.slug} · {ws.plan}
                </p>
              </div>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
              >
                {ws._count.members} member{ws._count.members !== 1 ? "s" : ""}
              </span>
            </div>

            {ws.members.length > 0 ? (
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ color: "rgba(255,255,255,0.3)" }}>
                    <th className="text-left pb-2 font-medium">User</th>
                    <th className="text-left pb-2 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {ws.members.map((m, i) => (
                    <tr key={i} style={{ color: "rgba(255,255,255,0.6)" }}>
                      <td className="py-1">{m.user.name ?? m.user.email}</td>
                      <td className="py-1">{m.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                No members assigned yet.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

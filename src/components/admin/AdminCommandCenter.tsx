import Link from "next/link";
import {
  Users,
  Layers,
  Mail,
  TrendingUp,
  Plus,
  Clock,
  Upload,
  CheckCircle2,
  UserPlus,
  FileText,
} from "lucide-react";
import { AdminClientCard } from "@/components/workspace/AdminClientCard";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AdminClientData = {
  id: string;
  name: string;
  slug: string;
  type: string;
  brandColor: string;
  status: string;
  workspaceCount: number;
  primaryWorkspaceHref: string | null;
};

export type ActivityItem = {
  id: string;
  type: "upload" | "approval" | "member" | "content";
  label: string;
  sub: string;
  time: string;
};

type Props = {
  firstName: string;
  stats: {
    activeClients: number;
    totalMembers: number;
    pendingInvites: number;
  };
  clients: AdminClientData[];
  directAccess: { slug: string; name: string; href: string }[];
  activity: ActivityItem[];
};

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  href?: string;
}) {
  const inner = (
    <div
      className="flex flex-col gap-3 p-5 rounded-2xl border"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-white leading-none">{value}</p>
        <p className="text-2xs mt-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
          {label}
        </p>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block hover:opacity-80 transition-opacity">
      {inner}
    </Link>
  ) : (
    inner
  );
}

// ─── Activity icon ────────────────────────────────────────────────────────────

function ActivityIcon({ type }: { type: ActivityItem["type"] }) {
  const base = "w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0";
  if (type === "upload")
    return (
      <div className={base} style={{ background: "rgba(99,102,241,0.12)" }}>
        <Upload className="w-3.5 h-3.5" style={{ color: "#818CF8" }} />
      </div>
    );
  if (type === "approval")
    return (
      <div className={base} style={{ background: "rgba(16,185,129,0.12)" }}>
        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#34D399" }} />
      </div>
    );
  if (type === "member")
    return (
      <div className={base} style={{ background: "rgba(245,158,11,0.12)" }}>
        <UserPlus className="w-3.5 h-3.5" style={{ color: "#FBBF24" }} />
      </div>
    );
  return (
    <div className={base} style={{ background: "rgba(255,255,255,0.06)" }}>
      <FileText className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function AdminCommandCenter({
  firstName,
  stats,
  clients,
  directAccess,
  activity,
}: Props) {
  return (
    <div
      className="min-h-screen px-6 py-12 md:px-12"
      style={{ background: "#0A0A0A" }}
    >
      {/* Header */}
      <div className="mb-10">
        <p
          className="text-xs font-black tracking-[-0.02em] mb-6 opacity-30 text-white"
        >
          SCOPE
        </p>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Command Center
        </h1>
        <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
          Welcome back, {firstName}. Here&apos;s what&apos;s happening across your roster.
        </p>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<Layers className="w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} />}
          label="Active clients"
          value={stats.activeClients}
        />
        <StatCard
          icon={<Users className="w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} />}
          label="Team members"
          value={stats.totalMembers}
          href="/admin/users"
        />
        <StatCard
          icon={<Mail className="w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} />}
          label="Pending invites"
          value={stats.pendingInvites}
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} />}
          label="Monthly revenue"
          value="—"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* ── Left column ── */}
        <div className="space-y-8">

          {/* Client cards */}
          {clients.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-2xs tracking-[0.2em] uppercase font-semibold"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  Clients
                </p>
                <Link
                  href="/admin/clients"
                  className="text-2xs transition-opacity hover:opacity-70"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {clients.map((c) => (
                  <AdminClientCard key={c.id} client={c} />
                ))}
              </div>
            </section>
          )}

          {/* Direct access workspaces */}
          {directAccess.length > 0 && (
            <section>
              <p
                className="text-2xs tracking-[0.2em] uppercase font-semibold mb-4"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                Direct Access
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {directAccess.map((ws) => (
                  <Link
                    key={ws.slug}
                    href={ws.href}
                    className="flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all hover:border-white/[0.14] hover:bg-white/[0.04]"
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <span className="text-sm font-semibold text-white">{ws.name}</span>
                    <span className="text-2xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Enter →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Activity feed */}
          <section>
            <p
              className="text-2xs tracking-[0.2em] uppercase font-semibold mb-4"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              Recent Activity
            </p>
            {activity.length === 0 ? (
              <div
                className="rounded-2xl border px-6 py-10 text-center"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <Clock className="w-5 h-5 mx-auto mb-2" style={{ color: "rgba(255,255,255,0.2)" }} />
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                  No recent activity yet. Actions across the platform will appear here.
                </p>
              </div>
            ) : (
              <div
                className="rounded-2xl border divide-y overflow-hidden"
                style={{
                  borderColor: "rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                {activity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3.5"
                    style={{ borderColor: "rgba(255,255,255,0.05)" }}
                  >
                    <ActivityIcon type={item.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{item.label}</p>
                      <p className="text-2xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {item.sub}
                      </p>
                    </div>
                    <p className="text-2xs flex-shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {item.time}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ── Right column — Quick actions ── */}
        <div className="space-y-3">
          <p
            className="text-2xs tracking-[0.2em] uppercase font-semibold mb-4"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Quick Actions
          </p>

          <Link
            href="/admin/clients"
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl border text-left transition-all hover:border-white/[0.14] hover:bg-white/[0.04]"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <Plus className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Create New Client</p>
              <p className="text-2xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                Add a client to your roster
              </p>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl border text-left transition-all hover:border-white/[0.14] hover:bg-white/[0.04]"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <Users className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">All Team Members</p>
              <p className="text-2xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                {stats.totalMembers} members across all clients
              </p>
            </div>
          </Link>

          <Link
            href="/admin/workspaces"
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl border text-left transition-all hover:border-white/[0.14] hover:bg-white/[0.04]"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <Layers className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">All Workspaces</p>
              <p className="text-2xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                Manage workspace settings
              </p>
            </div>
          </Link>

          {stats.pendingInvites > 0 && (
            <div
              className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl border"
              style={{
                borderColor: "rgba(245,158,11,0.2)",
                background: "rgba(245,158,11,0.04)",
              }}
            >
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(245,158,11,0.12)" }}
              >
                <Mail className="w-3.5 h-3.5" style={{ color: "#FBBF24" }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  {stats.pendingInvites} Pending Invite{stats.pendingInvites !== 1 ? "s" : ""}
                </p>
                <p className="text-2xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Awaiting acceptance
                </p>
              </div>
            </div>
          )}

          {/* Admin panel link */}
          <div
            className="mt-4 pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Link
              href="/admin/clients"
              className="block text-center text-2xs tracking-widest uppercase transition-opacity hover:opacity-70"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              Full Admin Panel →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p
        className="mt-16 text-[0.6rem] tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.08)" }}
      >
        © 2026 The Sighte Project
      </p>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import {
  MIRIAM_ANALYTICS,
  MIRIAM_CAMPAIGNS,
  MIRIAM_RELEASES,
  MIRIAM_CONTENT,
} from "@/lib/mock-artist2";
import { TrendingUp, Music, Film, Users } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Dashboard` : "Dashboard" };
}

export async function generateStaticParams() {
  return WORKSPACES.map((w) => ({ slug: w.slug }));
}

export default async function ArtistDashboardPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  const activeCampaign = MIRIAM_CAMPAIGNS.find((c) => c.status === "ACTIVE") ?? MIRIAM_CAMPAIGNS[0];
  const upcomingRelease = MIRIAM_RELEASES[0];

  return (
    <>
      <TopBar
        title={ws.artistName}
        subtitle={ws.genre}
      />

      <div className="p-6 space-y-6 animate-in max-w-5xl">
        {/* Hero stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Monthly Listeners", value: ws.monthlyListeners, icon: Music, change: "+8.9%" },
            { label: "Active Campaigns", value: MIRIAM_CAMPAIGNS.filter(c => c.status === "ACTIVE").length.toString(), icon: TrendingUp, change: "+1" },
            { label: "Content Items", value: MIRIAM_CONTENT.length.toString(), icon: Film, change: "in progress" },
            { label: "Team Members", value: "3", icon: Users, change: "active" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gold" />
                  </div>
                  <span className="text-2xs text-emerald-500 font-medium">{stat.change}</span>
                </div>
                <p className="text-xl font-black text-ink tracking-tight">{stat.value}</p>
                <p className="text-2xs text-ink-tertiary mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active campaign */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-subheading">Active Campaign</h2>
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                {activeCampaign.status}
              </span>
            </div>
            <p className="text-sm font-semibold text-ink mb-1">{activeCampaign.name}</p>
            <p className="text-xs text-ink-tertiary mb-4">
              {activeCampaign.completedTasks} / {activeCampaign.taskCount} tasks complete
            </p>
            <div className="h-1.5 rounded-full bg-canvas-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gold"
                style={{ width: `${activeCampaign.progress}%` }}
              />
            </div>
            <p className="text-2xs text-ink-tertiary mt-2 text-right">{activeCampaign.progress}%</p>
          </div>

          {/* Upcoming release */}
          <div className="card p-5">
            <h2 className="text-subheading mb-4">Upcoming Release</h2>
            <div
              className="w-full h-20 rounded-xl mb-3 flex items-center justify-center"
              style={{ background: upcomingRelease.coverColor }}
            >
              <p className="text-white font-black text-lg tracking-tight">{upcomingRelease.title}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">{upcomingRelease.title}</p>
                <p className="text-2xs text-ink-tertiary">{upcomingRelease.type} · {upcomingRelease.tracklist.length} tracks</p>
              </div>
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-gold-50 text-gold">
                {upcomingRelease.status}
              </span>
            </div>
          </div>
        </div>

        {/* Analytics snapshot */}
        <div className="card p-5">
          <h2 className="text-subheading mb-4">Platform Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            {MIRIAM_ANALYTICS.map((a) => (
              <div key={a.platform} className="text-center">
                <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-2 capitalize">
                  {a.platform}
                </p>
                <p className="text-xl font-black text-ink">
                  {a.followers >= 1000
                    ? `${(a.followers / 1000).toFixed(a.followers >= 100000 ? 0 : 1)}K`
                    : a.followers}
                </p>
                <p className="text-2xs text-ink-tertiary">followers</p>
                <p className="text-2xs text-emerald-500 font-medium mt-1">+{a.followersGrowth}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

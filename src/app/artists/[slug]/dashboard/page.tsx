import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import {
  CAAM1K_ANALYTICS,
  CAAM1K_CAMPAIGNS,
  CAAM1K_TOP_TRACKS,
  CAAM1K_COVER,
} from "@/lib/mock-artist2";
import { TrendingUp, Music, Film, Headphones } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Dashboard` : "Dashboard" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

export default async function ArtistDashboardPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  const activeCampaigns = CAAM1K_CAMPAIGNS.filter((c) => c.status === "ACTIVE");
  const primaryCampaign = activeCampaigns[0];

  return (
    <>
      <TopBar title={ws.artistName} subtitle={`${ws.genre} · Fort Worth, TX`} />

      <div className="p-6 space-y-5 animate-in max-w-5xl">
        {/* Hero stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Monthly Listeners", value: ws.monthlyListeners, icon: Headphones, change: "+6.2%" },
            { label: "Active Campaigns", value: activeCampaigns.length.toString(), icon: TrendingUp, change: "running" },
            { label: "Top Track Streams", value: "567K", icon: Music, change: "Psalms 7" },
            { label: "Content Items", value: "5", icon: Film, change: "in pipeline" },
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
          {/* Active release */}
          <div className="card p-5">
            <h2 className="text-subheading mb-4">Latest Release</h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-canvas-100">
                <Image
                  src={CAAM1K_COVER}
                  alt="Eastside Evangelist"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Eastside Evangelist</p>
                <p className="text-xs text-ink-tertiary">Album · 2026</p>
                <p className="text-xs text-ink-tertiary mt-1">8 tracks</p>
                <span className="inline-block mt-2 text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Top tracks */}
          <div className="card p-5">
            <h2 className="text-subheading mb-4">Top Tracks</h2>
            <div className="space-y-3">
              {CAAM1K_TOP_TRACKS.map((track, i) => (
                <div key={track.title} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-ink-tertiary w-4 text-right flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-ink truncate">{track.title}</p>
                  </div>
                  <span className="text-xs text-ink-tertiary flex-shrink-0">{track.streams}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active campaign */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-subheading">Active Campaign</h2>
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
              {primaryCampaign.phase}
            </span>
          </div>
          <p className="text-sm font-semibold text-ink mb-1">{primaryCampaign.name}</p>
          <p className="text-xs text-ink-tertiary mb-4">
            {primaryCampaign.completedTasks} / {primaryCampaign.taskCount} tasks complete
          </p>
          <div className="h-1.5 rounded-full bg-canvas-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gold"
              style={{ width: `${primaryCampaign.progress}%` }}
            />
          </div>
          <p className="text-2xs text-ink-tertiary mt-2 text-right">{primaryCampaign.progress}%</p>
        </div>

        {/* Platform snapshot */}
        <div className="card p-5">
          <h2 className="text-subheading mb-4">Platform Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            {CAAM1K_ANALYTICS.map((a) => (
              <div key={a.platform} className="text-center">
                <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-2 capitalize">
                  {a.platform}
                </p>
                <p className="text-xl font-black text-ink">
                  {a.platform === "spotify"
                    ? ws.monthlyListeners
                    : a.followers >= 1000
                      ? `${(a.followers / 1000).toFixed(1)}K`
                      : a.followers}
                </p>
                <p className="text-2xs text-ink-tertiary">
                  {a.platform === "spotify" ? "monthly listeners" : "followers"}
                </p>
                <p className="text-2xs text-emerald-500 font-medium mt-1">+{a.followersGrowth}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

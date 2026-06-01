import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { CAAM1K_ANALYTICS, CAAM1K_MONTHLY_ENGAGEMENT } from "@/lib/mock-artist2";
import { formatNumber } from "@/lib/utils";
import { PLATFORM_CONFIG } from "@/lib/constants";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { EngagementChart } from "./EngagementChart";
import { TrendingUp, Users, Heart, Share2 } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Analytics` : "Analytics" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

export default async function ArtistAnalyticsPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  const totalFollowers = CAAM1K_ANALYTICS.reduce((s, a) => s + a.followers, 0);
  const totalImpressions = CAAM1K_ANALYTICS.reduce((s, a) => s + a.impressions, 0);
  const totalEngagement = CAAM1K_ANALYTICS.reduce((s, a) => s + a.engagement, 0);
  const avgEngRate = (
    CAAM1K_ANALYTICS.reduce((s, a) => s + a.engagementRate, 0) / CAAM1K_ANALYTICS.length
  ).toFixed(1);

  return (
    <>
      <TopBar title={`${ws.artistName} | Command`} subtitle="Last 30 days · All platforms" />

      <div className="p-6 space-y-6 animate-in">
        {/* Top metrics */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard label="Total Followers" value={totalFollowers} change={5.8} changeLabel="this month" trend="up" accent="gold" icon={<Users className="w-4 h-4" />} />
          <MetricCard label="Total Impressions" value={totalImpressions} change={14.2} changeLabel="this month" trend="up" accent="sky" icon={<TrendingUp className="w-4 h-4" />} />
          <MetricCard label="Total Engagements" value={totalEngagement} change={11.3} changeLabel="this month" trend="up" accent="emerald" icon={<Heart className="w-4 h-4" />} />
          <MetricCard label="Avg Engagement Rate" value={`${avgEngRate}%`} change={1.2} changeLabel="vs prev 30d" trend="up" accent="amber" icon={<Share2 className="w-4 h-4" />} />
        </div>

        {/* Engagement chart */}
        <EngagementChart data={CAAM1K_MONTHLY_ENGAGEMENT} />

        {/* Platform breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {CAAM1K_ANALYTICS.map((a) => {
            const cfg = PLATFORM_CONFIG[a.platform as keyof typeof PLATFORM_CONFIG];
            return (
              <div key={a.platform} className="card p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-lg"
                    style={{ backgroundColor: `${cfg?.color}18`, color: cfg?.color }}
                  >
                    {cfg?.label ?? a.platform}
                  </span>
                  <span className={`text-xs font-medium ${a.followersGrowth > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                    +{a.followersGrowth}%
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-ink">
                    {a.platform === "spotify" ? ws.monthlyListeners : formatNumber(a.followers)}
                  </p>
                  <p className="text-xs text-ink-tertiary">
                    {a.platform === "spotify" ? "monthly listeners" : "followers"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{formatNumber(a.impressions)}</p>
                    <p className="text-2xs text-ink-tertiary">impressions</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{a.engagementRate}%</p>
                    <p className="text-2xs text-ink-tertiary">eng. rate</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{formatNumber(a.shares)}</p>
                    <p className="text-2xs text-ink-tertiary">shares</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{formatNumber(a.saves)}</p>
                    <p className="text-2xs text-ink-tertiary">saves</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

"use client";

import { TopBar } from "@/components/navigation/TopBar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MOCK_ANALYTICS, MONTHLY_ENGAGEMENT_DATA } from "@/lib/mock-data";
import { PLATFORM_CONFIG } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import { TrendingUp, Users, Heart, Share2, Bookmark } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <TopBar
        title="Analytics"
        subtitle="Last 30 days · All platforms"
      />

      <div className="p-6 space-y-6 animate-in">
        {/* Top metrics */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            label="Total Followers"
            value={961000}
            change={3.2}
            changeLabel="this month"
            trend="up"
            accent="violet"
            icon={<Users className="w-4 h-4" />}
          />
          <MetricCard
            label="Total Impressions"
            value={6350000}
            change={12.4}
            changeLabel="this month"
            trend="up"
            accent="sky"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <MetricCard
            label="Total Engagements"
            value={332600}
            change={8.1}
            changeLabel="this month"
            trend="up"
            accent="emerald"
            icon={<Heart className="w-4 h-4" />}
          />
          <MetricCard
            label="Avg Engagement Rate"
            value="5.2%"
            change={0.6}
            changeLabel="vs prev 30d"
            trend="up"
            accent="amber"
            icon={<Share2 className="w-4 h-4" />}
          />
        </div>

        {/* Engagement chart */}
        <div className="card p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-subheading">Engagement Trend</h2>
              <p className="text-xs text-ink-tertiary mt-0.5">Monthly engagement by platform</p>
            </div>
            <div className="flex items-center gap-3">
              {["instagram", "tiktok", "youtube"].map((p) => {
                const cfg = PLATFORM_CONFIG[p as keyof typeof PLATFORM_CONFIG];
                return (
                  <div key={p} className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cfg?.color }}
                    />
                    <span className="text-xs text-ink-secondary">{cfg?.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MONTHLY_ENGAGEMENT_DATA}>
              <defs>
                <linearGradient id="instagram" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E1306C" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#E1306C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tiktok" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="youtube" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF0000" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#A0A09E" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#A0A09E" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #E8E8E6",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: 12,
                }}
                formatter={(value: number) => [formatNumber(value), ""]}
              />
              <Area type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} fill="url(#instagram)" dot={false} />
              <Area type="monotone" dataKey="tiktok" stroke="#7C3AED" strokeWidth={2} fill="url(#tiktok)" dot={false} />
              <Area type="monotone" dataKey="youtube" stroke="#FF0000" strokeWidth={2} fill="url(#youtube)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Platform breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {MOCK_ANALYTICS.map((a) => {
            const cfg = PLATFORM_CONFIG[a.platform as keyof typeof PLATFORM_CONFIG];
            return (
              <div key={a.platform} className="card p-4 space-y-4">
                {/* Platform header */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-lg"
                    style={{
                      backgroundColor: `${cfg?.color}18`,
                      color: cfg?.color,
                    }}
                  >
                    {cfg?.label ?? a.platform}
                  </span>
                  <span
                    className={`text-xs font-medium ${a.followersGrowth > 0 ? "text-emerald-600" : "text-rose-500"}`}
                  >
                    {a.followersGrowth > 0 ? "+" : ""}
                    {a.followersGrowth}%
                  </span>
                </div>

                {/* Followers */}
                <div>
                  <p className="text-2xl font-semibold text-ink">{formatNumber(a.followers)}</p>
                  <p className="text-xs text-ink-tertiary">followers</p>
                </div>

                {/* Stats grid */}
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
    </div>
  );
}

"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PLATFORM_CONFIG } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";

interface DataPoint {
  month: string;
  instagram: number;
  tiktok: number;
  youtube: number;
}

interface Props {
  data: DataPoint[];
}

export function EngagementChart({ data }: Props) {
  return (
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
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg?.color }} />
                <span className="text-xs text-ink-secondary">{cfg?.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="c-instagram" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E1306C" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#E1306C" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="c-tiktok" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="c-youtube" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF0000" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E6" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#A0A09E" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#A0A09E" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
          <Tooltip contentStyle={{ background: "white", border: "1px solid #E8E8E6", borderRadius: "10px", fontSize: 12 }} formatter={(value: number) => [formatNumber(value), ""]} />
          <Area type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} fill="url(#c-instagram)" dot={false} />
          <Area type="monotone" dataKey="tiktok"    stroke="#7C3AED" strokeWidth={2} fill="url(#c-tiktok)"    dot={false} />
          <Area type="monotone" dataKey="youtube"   stroke="#FF0000" strokeWidth={2} fill="url(#c-youtube)"   dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

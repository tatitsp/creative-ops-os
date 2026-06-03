import { cn, formatNumber } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  accent?: "gold" | "emerald" | "amber" | "rose" | "sky";
  className?: string;
}

const ACCENT_STYLES = {
  gold:    { icon: "bg-gold-100 text-gold",       value: "text-white" },
  emerald: { icon: "bg-emerald-50 text-emerald-500", value: "text-white" },
  amber:   { icon: "bg-amber-50 text-amber-400",    value: "text-white" },
  rose:    { icon: "bg-rose-50 text-rose-500",       value: "text-white" },
  sky:     { icon: "bg-sky-50 text-sky-500",         value: "text-white" },
};

export function MetricCard({
  label,
  value,
  change,
  changeLabel,
  trend = "neutral",
  icon: _icon,
  accent = "gold",
  className,
}: MetricCardProps) {
  const styles = ACCENT_STYLES[accent];

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-emerald-500"
      : trend === "down"
        ? "text-rose-500"
        : "text-ink-tertiary";

  return (
    <div className={cn("card p-7 flex flex-col gap-5", className)}>
      <p className="text-label">{label}</p>

      <div>
        <p className={cn("text-5xl font-black tracking-tight leading-none", styles.value)}>
          {typeof value === "number" ? formatNumber(value) : value}
        </p>
        {(change !== undefined || changeLabel) && (
          <div className={cn("flex items-center gap-1 mt-3", trendColor)}>
            <TrendIcon className="w-4 h-4" />
            {change !== undefined && (
              <span className="text-sm font-semibold">
                {trend === "up" ? "+" : ""}
                {change}%
              </span>
            )}
            {changeLabel && <span className="text-sm text-ink-tertiary">{changeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

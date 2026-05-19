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
  icon,
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
    <div className={cn("card p-5 flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between">
        <p className="text-label">{label}</p>
        {icon && (
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", styles.icon)}>
            {icon}
          </div>
        )}
      </div>

      <div>
        <p className={cn("text-2xl font-black tracking-tight", styles.value)}>
          {typeof value === "number" ? formatNumber(value) : value}
        </p>
        {(change !== undefined || changeLabel) && (
          <div className={cn("flex items-center gap-1 mt-1.5", trendColor)}>
            <TrendIcon className="w-3.5 h-3.5" />
            {change !== undefined && (
              <span className="text-xs font-semibold">
                {trend === "up" ? "+" : ""}
                {change}%
              </span>
            )}
            {changeLabel && <span className="text-xs text-ink-tertiary">{changeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md";
  color?: "violet" | "emerald" | "amber" | "rose";
  showLabel?: boolean;
  className?: string;
}

const TRACK_HEIGHT = { sm: "h-1", md: "h-2" };
const BAR_COLOR = {
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-400",
  rose: "bg-rose-500",
};

export function Progress({
  value,
  max = 100,
  size = "sm",
  color = "violet",
  showLabel = false,
  className,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex-1 bg-canvas-200 rounded-full overflow-hidden", TRACK_HEIGHT[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", BAR_COLOR[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-2xs font-medium text-ink-secondary w-8 text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}

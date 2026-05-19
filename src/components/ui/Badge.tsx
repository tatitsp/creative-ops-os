import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gold" | "emerald" | "amber" | "rose" | "sky" | "ghost";
  size?: "sm" | "md";
}

export function Badge({ children, className, variant = "default", size = "sm" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        size === "sm" && "px-2 py-0.5 text-2xs",
        size === "md" && "px-2.5 py-1 text-xs",
        variant === "default" && "bg-canvas-200 text-ink-secondary",
        variant === "gold" && "bg-gold-100 text-gold",
        variant === "emerald" && "bg-emerald-50 text-emerald-500",
        variant === "amber" && "bg-amber-50 text-amber-400",
        variant === "rose" && "bg-rose-50 text-rose-500",
        variant === "sky" && "bg-sky-50 text-sky-500",
        variant === "ghost" && "bg-transparent text-ink-secondary border border-border",
        className,
      )}
    >
      {children}
    </span>
  );
}

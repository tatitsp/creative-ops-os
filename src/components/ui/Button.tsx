import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "secondary",
      size = "md",
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 select-none",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          // Size
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "md" && "px-4 py-2 text-sm",
          size === "lg" && "px-5 py-2.5 text-sm",
          size === "icon" && "p-2",
          // Variant
          variant === "primary" &&
            "bg-gold text-white hover:bg-gold-400 active:bg-gold-600 shadow-sm",
          variant === "secondary" &&
            "bg-canvas-100 text-ink border border-border hover:bg-canvas-200 hover:border-border-strong active:bg-canvas-200 shadow-card",
          variant === "ghost" &&
            "text-ink-secondary hover:bg-canvas-100 hover:text-ink active:bg-canvas-200",
          variant === "outline" &&
            "border border-border text-ink hover:bg-canvas-100 hover:border-border-strong active:bg-canvas-200",
          variant === "danger" &&
            "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 shadow-sm",
          className,
        )}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";

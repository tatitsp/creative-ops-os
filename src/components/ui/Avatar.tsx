import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";
import type { User } from "@/types";

interface AvatarProps {
  user: Pick<User, "name" | "image" | "status">;
  size?: "xs" | "sm" | "md" | "lg";
  showStatus?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: { container: "w-6 h-6", text: "text-2xs", dot: "w-1.5 h-1.5" },
  sm: { container: "w-8 h-8", text: "text-xs", dot: "w-2 h-2" },
  md: { container: "w-9 h-9", text: "text-sm", dot: "w-2.5 h-2.5" },
  lg: { container: "w-11 h-11", text: "text-base", dot: "w-3 h-3" },
};

const STATUS_COLORS = {
  ACTIVE: "bg-emerald-500",
  AWAY: "bg-amber-400",
  BUSY: "bg-rose-500",
  OFFLINE: "bg-ink-tertiary",
};

export function Avatar({ user, size = "md", showStatus = false, className }: AvatarProps) {
  const s = SIZE_MAP[size];

  return (
    <div className={cn("relative inline-flex flex-shrink-0", className)}>
      <div
        className={cn(
          s.container,
          "rounded-full overflow-hidden bg-violet-100 flex items-center justify-center ring-2 ring-white",
        )}
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            fill
            className="object-cover"
            sizes={size === "lg" ? "44px" : "32px"}
          />
        ) : (
          <span className={cn(s.text, "font-semibold text-violet-700 select-none")}>
            {getInitials(user.name)}
          </span>
        )}
      </div>
      {showStatus && user.status && (
        <span
          className={cn(
            s.dot,
            "absolute bottom-0 right-0 rounded-full border-2 border-white",
            STATUS_COLORS[user.status],
          )}
        />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  users: Pick<User, "name" | "image" | "status">[];
  max?: number;
  size?: "xs" | "sm" | "md";
}

export function AvatarGroup({ users, max = 4, size = "sm" }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <Avatar key={i} user={user} size={size} className="ring-2 ring-white" />
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            SIZE_MAP[size].container,
            "rounded-full bg-canvas-200 border-2 border-white flex items-center justify-center",
          )}
        >
          <span className={cn(SIZE_MAP[size].text, "text-ink-secondary font-medium")}>
            +{overflow}
          </span>
        </div>
      )}
    </div>
  );
}

import { Avatar } from "@/components/ui/Avatar";
import { formatRelativeTime } from "@/lib/utils";
import type { ActivityItem } from "@/types";
import { Upload, Send, Clock, CheckCircle2, Plus, ThumbsUp } from "lucide-react";

const ACTION_ICON: Record<string, React.ReactNode> = {
  uploaded: <Upload className="w-3 h-3" />,
  "submitted for approval": <Send className="w-3 h-3" />,
  scheduled: <Clock className="w-3 h-3" />,
  completed: <CheckCircle2 className="w-3 h-3" />,
  "created campaign": <Plus className="w-3 h-3" />,
  approved: <ThumbsUp className="w-3 h-3" />,
};

const ACTION_COLOR: Record<string, string> = {
  uploaded: "bg-sky-50 text-sky-500",
  "submitted for approval": "bg-amber-50 text-amber-500",
  scheduled: "bg-violet-50 text-violet-500",
  completed: "bg-emerald-50 text-emerald-600",
  "created campaign": "bg-violet-50 text-violet-500",
  approved: "bg-emerald-50 text-emerald-600",
};

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const icon = ACTION_ICON[item.action] ?? <CheckCircle2 className="w-3 h-3" />;
        const color = ACTION_COLOR[item.action] ?? "bg-canvas-200 text-ink-tertiary";

        return (
          <div key={item.id} className="flex items-start gap-3">
            <Avatar user={item.user} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-medium text-ink">{item.user.name}</span>
                <span
                  className={`inline-flex items-center gap-1 text-2xs px-1.5 py-0.5 rounded-full ${color}`}
                >
                  {icon}
                  <span>{item.action}</span>
                </span>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5 truncate">{item.entityName}</p>
              <p className="text-2xs text-ink-tertiary mt-0.5">{formatRelativeTime(item.timestamp)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/Progress";
import { AvatarGroup } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { CAMPAIGN_STATUS_CONFIG, CONTENT_PHASES, PLATFORM_CONFIG } from "@/lib/constants";
import type { Campaign } from "@/types";

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const statusCfg = CAMPAIGN_STATUS_CONFIG[campaign.status];
  const phaseCfg = CONTENT_PHASES.find((p) => p.phase === campaign.phase);

  return (
    <Link href={`/projects/${campaign.id}`}>
      <div className="card-hover p-4 flex flex-col gap-3">
        {/* Cover / header */}
        <div className="flex items-start gap-3">
          {campaign.coverImage ? (
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-canvas-200 flex-shrink-0 relative">
              <Image
                src={campaign.coverImage}
                alt={campaign.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex-shrink-0 flex items-center justify-center">
              <span className="text-lg">🎬</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{campaign.name}</p>
            {campaign.description && (
              <p className="text-xs text-ink-secondary truncate mt-0.5">{campaign.description}</p>
            )}
          </div>
        </div>

        {/* Status + phase */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full",
              statusCfg.color,
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
            {statusCfg.label}
          </span>
          {phaseCfg && (
            <span className={cn("text-2xs font-medium px-2 py-0.5 rounded-full", phaseCfg.color)}>
              {phaseCfg.label}
            </span>
          )}
        </div>

        {/* Platforms */}
        <div className="flex items-center gap-1.5">
          {campaign.platforms.slice(0, 4).map((p) => {
            const cfg = PLATFORM_CONFIG[p];
            return (
              <span
                key={p}
                className={cn("text-2xs font-medium px-2 py-0.5 rounded-full", cfg?.bg ?? "bg-canvas-200")}
                style={{ color: cfg?.color }}
              >
                {cfg?.label ?? p}
              </span>
            );
          })}
          {campaign.platforms.length > 4 && (
            <span className="text-2xs text-ink-tertiary">+{campaign.platforms.length - 4}</span>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-2xs text-ink-secondary">
              {campaign.completedTasks} / {campaign.taskCount} tasks
            </span>
            <span className="text-2xs font-medium text-ink">{campaign.progress}%</span>
          </div>
          <Progress
            value={campaign.progress}
            color={campaign.progress >= 75 ? "emerald" : campaign.progress >= 40 ? "violet" : "amber"}
          />
        </div>

        {/* Team */}
        <div className="flex items-center justify-between">
          <AvatarGroup users={campaign.teamMembers} max={4} size="xs" />
          {campaign.endDate && (
            <span className="text-2xs text-ink-tertiary">
              Due {new Date(campaign.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

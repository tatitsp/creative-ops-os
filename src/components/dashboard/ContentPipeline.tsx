"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { CONTENT_PHASES, PLATFORM_CONFIG } from "@/lib/constants";
import type { ContentItem, ContentPhase } from "@/types";
import { Film, Camera, Layers, Image as ImageIcon, Mic, FileText } from "lucide-react";
import Link from "next/link";

const CONTENT_TYPE_ICONS: Record<string, React.ReactNode> = {
  VIDEO: <Film className="w-3.5 h-3.5" />,
  REEL: <Film className="w-3.5 h-3.5" />,
  SHORT: <Film className="w-3.5 h-3.5" />,
  PHOTO: <Camera className="w-3.5 h-3.5" />,
  CAROUSEL: <Layers className="w-3.5 h-3.5" />,
  STORY: <ImageIcon className="w-3.5 h-3.5" />,
  PODCAST: <Mic className="w-3.5 h-3.5" />,
  BLOG: <FileText className="w-3.5 h-3.5" />,
};

// Show a subset of phases for the pipeline board view
const PIPELINE_PHASES: ContentPhase[] = [
  "PLANNING",
  "PRODUCTION",
  "EDITING",
  "REVIEW",
  "APPROVED",
  "SCHEDULED",
];

interface ContentPipelineProps {
  items: ContentItem[];
}

export function ContentPipeline({ items }: ContentPipelineProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 pb-2 min-w-max">
        {PIPELINE_PHASES.map((phase) => {
          const phaseCfg = CONTENT_PHASES.find((p) => p.phase === phase)!;
          const phaseItems = items.filter((i) => i.phase === phase);

          return (
            <div key={phase} className="w-48 flex-shrink-0">
              {/* Column header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-2xs font-bold px-2 py-0.5 rounded-full", phaseCfg.color)}>
                    {phaseCfg.label}
                  </span>
                </div>
                <span className="text-2xs text-ink-tertiary font-semibold">{phaseItems.length}</span>
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {phaseItems.length === 0 && (
                  <div className="h-16 border border-dashed border-border rounded-lg flex items-center justify-center">
                    <span className="text-2xs text-ink-tertiary">Empty</span>
                  </div>
                )}
                {phaseItems.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContentCard({ item }: { item: ContentItem }) {
  const typeIcon = CONTENT_TYPE_ICONS[item.type] ?? <Film className="w-3.5 h-3.5" />;

  return (
    <Link href={`/content/${item.id}`}>
      <div className="bg-canvas-100 border border-border rounded-lg p-3 hover:border-border-strong hover:shadow-card transition-all duration-150 cursor-pointer">
        {/* Title */}
        <div className="flex items-start gap-2">
          <span className="text-ink-tertiary mt-0.5 flex-shrink-0">{typeIcon}</span>
          <p className="text-xs font-semibold text-ink leading-snug line-clamp-2 flex-1">
            {item.title}
          </p>
        </div>

        {/* Platforms */}
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          {item.platforms.slice(0, 3).map((p) => {
            const cfg = PLATFORM_CONFIG[p];
            return (
              <span
                key={p}
                className="text-2xs px-1.5 py-0.5 rounded-full bg-canvas-200 text-ink-tertiary"
              >
                {cfg?.label ?? p}
              </span>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2.5">
          {item.assignee ? (
            <Avatar user={item.assignee} size="xs" />
          ) : (
            <div className="w-5 h-5 rounded-full border border-dashed border-border" />
          )}
          {item.scheduledAt && (
            <span className="text-2xs text-ink-tertiary">
              {new Date(item.scheduledAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

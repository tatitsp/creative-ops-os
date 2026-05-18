import { cn } from "@/lib/utils";
import {
  ASSET_STAGE_CONFIG,
  ASSET_STATUS_CONFIG,
  type ReleaseAsset,
  type AssetStage,
} from "@/lib/mock-releases";
import {
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  FileSpreadsheet,
  File,
  CheckCircle2,
  Clock,
  AlertCircle,
  Circle,
} from "lucide-react";

const FILE_TYPE_ICON: Record<string, React.ReactNode> = {
  doc: <FileText className="w-4 h-4 text-sky-400" />,
  pdf: <FileText className="w-4 h-4 text-rose-400" />,
  image: <ImageIcon className="w-4 h-4 text-violet-400" />,
  video: <Film className="w-4 h-4 text-amber-400" />,
  audio: <Music className="w-4 h-4 text-emerald-400" />,
  sheet: <FileSpreadsheet className="w-4 h-4 text-emerald-400" />,
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  DONE: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  IN_PROGRESS: <Clock className="w-4 h-4 text-amber-500" />,
  PENDING: <Circle className="w-4 h-4 text-ink-tertiary" />,
  BLOCKED: <AlertCircle className="w-4 h-4 text-rose-500" />,
};

const STAGE_ORDER: AssetStage[] = [
  "PRE_PRODUCTION",
  "PRODUCTION",
  "PRE_RELEASE",
  "LAUNCH",
  "POST_RELEASE",
];

interface AssetTrackerProps {
  assets: ReleaseAsset[];
}

export function AssetTracker({ assets }: AssetTrackerProps) {
  return (
    <div className="space-y-6">
      {STAGE_ORDER.map((stage) => {
        const stageAssets = assets.filter((a) => a.stage === stage);
        if (!stageAssets.length) return null;

        const stageCfg = ASSET_STAGE_CONFIG[stage];
        const done = stageAssets.filter((a) => a.status === "DONE").length;
        const pct = Math.round((done / stageAssets.length) * 100);

        return (
          <section key={stage}>
            {/* Stage header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", stageCfg.color)}>
                  {stageCfg.label}
                </span>
                <span className="text-xs text-ink-tertiary">
                  {done} / {stageAssets.length} complete
                </span>
              </div>
              {/* Mini progress */}
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-canvas-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      pct === 100 ? "bg-emerald-500" : pct >= 50 ? "bg-violet-500" : "bg-amber-400",
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-2xs font-medium text-ink-secondary w-8 text-right">{pct}%</span>
              </div>
            </div>

            {/* Asset rows */}
            <div className="card divide-y divide-border overflow-hidden">
              {stageAssets.map((asset) => {
                const statusCfg = ASSET_STATUS_CONFIG[asset.status];
                const icon =
                  FILE_TYPE_ICON[asset.fileType ?? ""] ?? <File className="w-4 h-4 text-ink-tertiary" />;
                const statusIcon = STATUS_ICON[asset.status];

                return (
                  <div
                    key={asset.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 hover:bg-canvas-50 transition-colors",
                      asset.status === "DONE" && "opacity-60",
                    )}
                  >
                    {/* File icon */}
                    <div className="w-7 h-7 rounded-lg bg-canvas-100 flex items-center justify-center flex-shrink-0">
                      {icon}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          asset.status === "DONE" ? "text-ink-tertiary line-through" : "text-ink",
                        )}
                      >
                        {asset.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {asset.assignee && (
                          <span className="text-2xs text-ink-tertiary">{asset.assignee}</span>
                        )}
                        {asset.count && (
                          <span className="text-2xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                            {asset.count}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Due date */}
                    {asset.dueDate && asset.status !== "DONE" && (
                      <span
                        className={cn(
                          "text-2xs flex-shrink-0",
                          new Date(asset.dueDate) < new Date()
                            ? "text-rose-500 font-semibold"
                            : "text-ink-tertiary",
                        )}
                      >
                        Due{" "}
                        {new Date(asset.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}

                    {/* Status */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {statusIcon}
                      <span className={cn("text-2xs font-medium hidden sm:block", statusCfg.color.split(" ")[1])}>
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

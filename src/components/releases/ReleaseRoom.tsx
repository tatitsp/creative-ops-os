"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Release } from "@/lib/mock-releases";
import { RELEASE_TYPE_CONFIG, RELEASE_STATUS_CONFIG } from "@/lib/mock-releases";
import { RolloutTimeline } from "./RolloutTimeline";
import { ContentSchedule } from "./ContentSchedule";
import { AssetTracker } from "./AssetTracker";
import { ApprovalChain } from "./ApprovalChain";
import { PlatformChecklist } from "./PlatformChecklist";
import { AnalyticsSnapshot } from "./AnalyticsSnapshot";
import { VideoCalculator, type GeneratedSlot } from "./VideoCalculator";
import { ReleaseBudget } from "./ReleaseBudget";
import { CURRENT_USER } from "@/lib/mock-data";
import {
  Flag,
  Film,
  FolderOpen,
  CheckCircle2,
  Globe,
  BarChart3,
  Calculator,
  CalendarDays,
  ChevronLeft,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

const BUDGET_ROLES = ["ARTIST_CEO", "CREATIVE_OPS_DIRECTOR"];

type Tab =
  | "timeline"
  | "content"
  | "assets"
  | "approvals"
  | "publishing"
  | "analytics"
  | "calculator"
  | "budget";

const BASE_TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "timeline",   label: "Timeline",   icon: <Flag        className="w-3.5 h-3.5" /> },
  { id: "content",    label: "Content",    icon: <CalendarDays className="w-3.5 h-3.5" /> },
  { id: "assets",     label: "Assets",     icon: <FolderOpen  className="w-3.5 h-3.5" /> },
  { id: "approvals",  label: "Approvals",  icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { id: "publishing", label: "Publishing", icon: <Globe       className="w-3.5 h-3.5" /> },
  { id: "analytics",  label: "Analytics",  icon: <BarChart3   className="w-3.5 h-3.5" /> },
  { id: "calculator", label: "Video Calc", icon: <Calculator  className="w-3.5 h-3.5" /> },
  { id: "budget",     label: "Budget",     icon: <DollarSign  className="w-3.5 h-3.5" /> },
];

// Budget tab only visible to permitted roles
const TABS = BASE_TABS.filter(
  (t) => t.id !== "budget" || BUDGET_ROLES.includes(CURRENT_USER.role),
);

interface ReleaseRoomProps {
  release: Release;
}

export function ReleaseRoom({ release }: ReleaseRoomProps) {
  const [activeTab, setActiveTab] = useState<Tab>("timeline");
  const [generatedSlots, setGeneratedSlots] = useState<GeneratedSlot[]>([]);

  function handleGenerate(slots: GeneratedSlot[]) {
    setGeneratedSlots(slots);
    setActiveTab("content");
  }

  const typeCfg = RELEASE_TYPE_CONFIG[release.type];
  const statusCfg = RELEASE_STATUS_CONFIG[release.status];

  const daysToRelease = Math.ceil(
    (new Date(release.releaseDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );

  // Compute quick stats
  const totalAssets = release.assets.length;
  const doneAssets = release.assets.filter((a) => a.status === "DONE").length;
  const pendingApprovals = release.approvals.filter(
    (a) => a.stage === "MANAGEMENT_APPROVAL" || a.stage === "ARTIST_REVIEW",
  ).length;
  const platformTasks = release.platformChecklists.flatMap((c) => c.tasks);
  const publishingPct = Math.round(
    (platformTasks.filter((t) => t.done).length / platformTasks.length) * 100,
  );
  const completedMilestones = release.milestones.filter((m) => m.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero header — dark premium */}
      <div className="bg-canvas-50 text-white">
        {/* Back nav */}
        <div className="px-6 pt-5 pb-0">
          <Link
            href="/releases"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors mb-4"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            All releases
          </Link>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Release type icon block */}
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                {typeCfg.emoji}
              </div>

              <div>
                {/* Badges */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 text-white">
                    {typeCfg.label}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
                      statusCfg.color,
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                    {statusCfg.label}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold tracking-tight">{release.title}</h1>
                <p className="text-white/60 text-sm mt-1">{release.artist}</p>
                <p className="text-white/50 text-xs mt-2 max-w-xl leading-relaxed">
                  {release.description}
                </p>
              </div>
            </div>

            {/* Key dates */}
            <div className="flex-shrink-0 text-right hidden md:block">
              <div className="space-y-3">
                <div>
                  <p className="text-2xs text-white/40 uppercase tracking-wider">Announcement</p>
                  <p className="text-sm font-semibold text-white/80">
                    {new Date(release.announcementDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-2xs text-white/40 uppercase tracking-wider">Release Day</p>
                  <p className="text-lg font-bold text-gold">
                    {new Date(release.releaseDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {daysToRelease > 0 && (
                  <div className="px-3 py-2 bg-white/10 rounded-xl text-center">
                    <p className="text-2xl font-bold text-gold">{daysToRelease}</p>
                    <p className="text-2xs text-white/50">days out</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats bar */}
          <div className="flex items-center gap-6 mt-6 pt-5 border-t border-white/10 flex-wrap">
            <StatPill label="Tracks" value={release.trackCount.toString()} />
            <StatPill label="Lead singles" value={release.leadSingles.length.toString()} />
            <StatPill
              label="Milestones"
              value={`${completedMilestones}/${release.milestones.length}`}
            />
            <StatPill label="Assets" value={`${doneAssets}/${totalAssets}`} />
            <StatPill
              label="Approvals pending"
              value={pendingApprovals.toString()}
              highlight={pendingApprovals > 0}
            />
            <StatPill label="Publishing" value={`${publishingPct}%`} />
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-0 px-6 border-t border-white/10 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all flex-shrink-0",
                activeTab === tab.id
                  ? "text-white border-gold"
                  : "text-white/50 border-transparent hover:text-white/80 hover:border-white/20",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-canvas p-6 max-w-5xl animate-in">
        {activeTab === "timeline" && (
          <RolloutTimeline
            milestones={release.milestones}
            releaseDate={release.releaseDate}
          />
        )}
        {activeTab === "content" && (
          <ContentSchedule drops={release.contentDrops} generatedSlots={generatedSlots} />
        )}
        {activeTab === "assets" && <AssetTracker assets={release.assets} />}
        {activeTab === "approvals" && <ApprovalChain approvals={release.approvals} />}
        {activeTab === "publishing" && (
          <PlatformChecklist checklists={release.platformChecklists} />
        )}
        {activeTab === "analytics" && (
          <AnalyticsSnapshot
            analytics={release.analytics}
            releaseDate={release.releaseDate}
            title={release.title}
            leadSingles={release.leadSingles}
          />
        )}
        {activeTab === "calculator" && (
          <VideoCalculator
            defaultTracks={release.trackCount}
            releaseName={release.title}
            campaignId={release.id}
            campaignName={release.title}
            onGenerate={handleGenerate}
          />
        )}
        {activeTab === "budget" && (
          <ReleaseBudget releaseId={release.id} />
        )}
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <p className="text-2xs text-white/40 uppercase tracking-wider">{label}</p>
      <p
        className={cn(
          "text-sm font-bold",
          highlight ? "text-amber-300" : "text-white",
        )}
      >
        {value}
      </p>
    </div>
  );
}

"use client";

import { CalendarDays, Film, Music2, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiContentItem } from "@/store/pipeline-store";
import type { ApiRelease } from "@/store/releases-store";

// ─── Config ──────────────────────────────────────────────────────────────────

const PHASE_STYLES: Record<string, string> = {
  IDEA:        "bg-canvas-100 text-ink-tertiary",
  PLANNING:    "bg-canvas-100 text-ink-tertiary",
  PRODUCTION:  "bg-gold-50 text-gold",
  EDITING:     "bg-amber-50 text-amber-600",
  REVIEW:      "bg-amber-50 text-amber-600",
  APPROVED:    "bg-emerald-50 text-emerald-600",
  SCHEDULED:   "bg-sky-50 text-sky-600",
  POSTED:      "bg-canvas-100 text-ink-secondary",
  ANALYTICS:   "bg-blue-50 text-blue-600",
  ARCHIVED:    "bg-canvas-100 text-ink-tertiary",
};

const RELEASE_STATUS_STYLES: Record<string, string> = {
  CONCEPT:      "bg-canvas-100 text-ink-tertiary",
  PRE_RELEASE:  "bg-amber-50 text-amber-700",
  RELEASE_WEEK: "bg-gold-100 text-gold",
  RELEASED:     "bg-emerald-50 text-emerald-600",
  ARCHIVED:     "bg-canvas-100 text-ink-tertiary",
};

const RELEASE_STATUS_LABELS: Record<string, string> = {
  CONCEPT:      "Concept",
  PRE_RELEASE:  "Pre-Release",
  RELEASE_WEEK: "Release Week",
  RELEASED:     "Released",
  ARCHIVED:     "Archived",
};

const STAGE_LABELS: Record<string, string> = {
  DRAFT:               "Draft",
  INTERNAL_REVIEW:     "Internal Review",
  ARTIST_REVIEW:       "Artist Review",
  MANAGEMENT_APPROVAL: "Management",
  SCHEDULED:           "Scheduled",
  POSTED:              "Posted",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type PortalApproval = {
  id: string;
  title: string;
  type: string;
  stage: string;
  requestedAt: string;
  requesterName: string | null;
};

interface ArtistPortalReadOnlyProps {
  slug: string;
  artistName: string;
  workspaceName: string;
  contentItems: ApiContentItem[];
  approvals: PortalApproval[];
  releases: ApiRelease[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ArtistPortalReadOnly({
  artistName,
  contentItems,
  approvals,
  releases,
}: ArtistPortalReadOnlyProps) {
  return (
    <div className="p-6 space-y-8 animate-in max-w-4xl">
      {/* Header */}
      <div>
        <p className="text-2xs font-bold text-ink-tertiary uppercase tracking-widest mb-1">
          Read-only view
        </p>
        <h1 className="text-2xl font-black text-ink tracking-tight">{artistName}</h1>
        <p className="text-sm text-ink-tertiary mt-1">
          Your workspace overview. Contact your team to make changes.
        </p>
      </div>

      {/* ── Recent Content ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader label="Recent Content" count={contentItems.length} />
        {contentItems.length === 0 ? (
          <EmptyState icon={<Film className="w-6 h-6 text-ink-tertiary" />} message="No content items yet." />
        ) : (
          <div className="space-y-2">
            {contentItems.map((item) => (
              <div
                key={item.id}
                className="card p-4 flex items-center gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-canvas-100 flex items-center justify-center flex-shrink-0">
                  <Film className="w-4 h-4 text-ink-tertiary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                  {item.campaign && (
                    <p className="text-2xs text-ink-tertiary truncate">{item.campaign.name}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.scheduledAt && (
                    <span className="flex items-center gap-1 text-2xs text-ink-tertiary">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(item.scheduledAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-2xs font-semibold px-2 py-0.5 rounded-full",
                      PHASE_STYLES[item.phase] ?? "bg-canvas-100 text-ink-tertiary"
                    )}
                  >
                    {item.phase}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Pending Approvals ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader label="Pending Approvals" count={approvals.length} />
        {approvals.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="w-6 h-6 text-ink-tertiary" />}
            message="No pending approvals."
          />
        ) : (
          <div className="space-y-2">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className="card p-4 flex items-center gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-canvas-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-ink-tertiary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{approval.title}</p>
                  <p className="text-2xs text-ink-tertiary mt-0.5 flex items-center gap-1.5">
                    {approval.requesterName && <span>by {approval.requesterName}</span>}
                    <span>·</span>
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(approval.requestedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                    {STAGE_LABELS[approval.stage] ?? approval.stage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Upcoming Releases ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader label="Releases" count={releases.length} />
        {releases.length === 0 ? (
          <EmptyState
            icon={<Music2 className="w-6 h-6 text-ink-tertiary" />}
            message="No releases yet."
          />
        ) : (
          <div className="space-y-2">
            {releases.map((release) => (
              <div key={release.id} className="card p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-canvas-100 flex items-center justify-center flex-shrink-0">
                  <Music2 className="w-4 h-4 text-ink-tertiary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{release.title}</p>
                  <p className="text-2xs text-ink-tertiary mt-0.5 flex items-center gap-1.5">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(release.releaseDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    <span>· {release.trackCount} track{release.trackCount !== 1 ? "s" : ""}</span>
                  </p>
                </div>
                <span
                  className={cn(
                    "text-2xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
                    RELEASE_STATUS_STYLES[release.status] ?? "bg-canvas-100 text-ink-tertiary"
                  )}
                >
                  {RELEASE_STATUS_LABELS[release.status] ?? release.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ label, count }: { label: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-xs font-bold text-ink-tertiary uppercase tracking-[0.2em]">{label}</h2>
      {count !== undefined && count > 0 && (
        <span className="w-5 h-5 rounded-full bg-ink text-white text-2xs font-bold flex items-center justify-center">
          {count}
        </span>
      )}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="card p-6 flex flex-col items-center justify-center text-center gap-2">
      {icon}
      <p className="text-xs text-ink-tertiary">{message}</p>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { MOCK_RELEASES, RELEASE_TYPE_CONFIG, RELEASE_STATUS_CONFIG } from "@/lib/mock-releases";
import { WORKSPACES } from "@/lib/workspaces";
import { cn } from "@/lib/utils";
import { Plus, Flag, ChevronRight, Music2, X, Check } from "lucide-react";

const LIL_TONY = WORKSPACES.find((w) => w.slug === "lil-tony")!;

const RELEASE_TYPES = ["SINGLE", "EP", "ALBUM", "MERCH_DROP", "TOUR"] as const;
const RELEASE_STATUSES = ["CONCEPT", "PRE_RELEASE", "RELEASE_WEEK", "RELEASED"] as const;

export function ReleasesPageClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<typeof RELEASE_TYPES[number]>("SINGLE");
  const [newStatus, setNewStatus] = useState<typeof RELEASE_STATUSES[number]>("CONCEPT");
  const [newDate, setNewDate] = useState("");
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function handleCreate() {
    if (!newTitle.trim()) return;
    setSaved(true);
    setTimeout(() => {
      setModalOpen(false);
      setSaved(false);
      setNewTitle("");
      setNewDate("");
      setToast(`"${newTitle}" added to releases`);
      setTimeout(() => setToast(null), 3000);
    }, 1200);
  }

  return (
    <div className="min-h-screen">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* New Release Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-canvas-50 border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 animate-in">
            <div className="flex items-center justify-between">
              <h2 className="text-heading">New Release Room</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-canvas-100 transition-colors">
                <X className="w-4 h-4 text-ink-tertiary" />
              </button>
            </div>
            {saved ? (
              <div className="py-6 flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-ink">Release room created!</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="text-label block mb-1.5">Title</label>
                    <input className="input-base" placeholder="e.g. Mrs.Key, The Sermon EP" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus />
                  </div>
                  <div>
                    <label className="text-label block mb-1.5">Type</label>
                    <select className="input-base" value={newType} onChange={(e) => setNewType(e.target.value as typeof newType)}>
                      {RELEASE_TYPES.map((t) => (
                        <option key={t} value={t}>{RELEASE_TYPE_CONFIG[t]?.label ?? t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-label block mb-1.5">Status</label>
                    <select className="input-base" value={newStatus} onChange={(e) => setNewStatus(e.target.value as typeof newStatus)}>
                      {RELEASE_STATUSES.map((s) => (
                        <option key={s} value={s}>{RELEASE_STATUS_CONFIG[s]?.label ?? s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-label block mb-1.5">Release date</label>
                    <input className="input-base" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" className="flex-1" onClick={handleCreate} disabled={!newTitle.trim()}>
                    Create room
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <TopBar
        title={`${LIL_TONY.artistName} | Command`}
        subtitle="Every release. One room."
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setModalOpen(true)}>
            New release
          </Button>
        }
      />

      <div className="p-6 space-y-6 animate-in">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(
            [
              { label: "Active Drops", value: MOCK_RELEASES.filter((r) => r.status === "PRE_RELEASE" || r.status === "RELEASE_WEEK").length, color: "text-amber-500" },
              { label: "In Concept", value: MOCK_RELEASES.filter((r) => r.status === "CONCEPT").length, color: "text-ink-secondary" },
              { label: "Released", value: MOCK_RELEASES.filter((r) => r.status === "RELEASED").length, color: "text-emerald-600" },
              { label: "Total Drops", value: MOCK_RELEASES.length, color: "text-gold" },
            ] as const
          ).map((s) => (
            <div key={s.label} className="card p-4">
              <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-ink-tertiary mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Release cards */}
        <div className="space-y-4">
          <p className="text-label">All releases</p>

          {MOCK_RELEASES.map((release) => {
            const typeCfg = RELEASE_TYPE_CONFIG[release.type];
            const statusCfg = RELEASE_STATUS_CONFIG[release.status];
            const daysOut = Math.ceil(
              (new Date(release.releaseDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
            );
            const doneAssets = release.assets.filter((a) => a.status === "DONE").length;
            const assetPct = Math.round((doneAssets / release.assets.length) * 100);
            const completedMilestones = release.milestones.filter((m) => m.status === "COMPLETED").length;
            const milestonePct = Math.round((completedMilestones / release.milestones.length) * 100);
            const pendingApprovals = release.approvals.filter(
              (a) => a.stage === "MANAGEMENT_APPROVAL" || a.stage === "ARTIST_REVIEW",
            ).length;

            return (
              <Link key={release.id} href={`/releases/${release.id}`}>
                <div className="card-hover p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-ink flex items-center justify-center text-2xl flex-shrink-0">
                      {typeCfg.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-ink text-white">
                              {typeCfg.label}
                            </span>
                            <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full", statusCfg.color)}>
                              <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                              {statusCfg.label}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-ink">{release.title}</h3>
                          <p className="text-sm text-ink-secondary">{release.artist}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {daysOut > 0 ? (
                            <>
                              <p className="text-2xl font-bold text-ink">{daysOut}</p>
                              <p className="text-2xs text-ink-tertiary">days out</p>
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-emerald-600">Released</span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-2xs text-ink-tertiary">Milestones</span>
                            <span className="text-2xs font-medium text-ink">{completedMilestones}/{release.milestones.length}</span>
                          </div>
                          <Progress value={milestonePct} size="sm" color="gold" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-2xs text-ink-tertiary">Assets</span>
                            <span className="text-2xs font-medium text-ink">{doneAssets}/{release.assets.length}</span>
                          </div>
                          <Progress value={assetPct} size="sm" color={assetPct >= 80 ? "emerald" : "amber"} />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-2xs text-ink-tertiary">Approvals</span>
                            <span className={cn("text-2xs font-semibold", pendingApprovals > 0 ? "text-amber-500" : "text-emerald-600")}>
                              {pendingApprovals > 0 ? `${pendingApprovals} pending` : "All clear"}
                            </span>
                          </div>
                          <Progress value={release.approvals.filter((a) => a.stage === "POSTED").length / release.approvals.length * 100} size="sm" color="emerald" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Flag className="w-3.5 h-3.5 text-ink-tertiary" />
                          <span className="text-xs text-ink-tertiary">
                            {new Date(release.releaseDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gold font-semibold">
                          Open release room
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-canvas-100 flex items-center justify-center mb-3">
              <Music2 className="w-6 h-6 text-ink-tertiary" />
            </div>
            <p className="text-sm font-semibold text-ink">Add your next release</p>
            <p className="text-xs text-ink-tertiary mt-1 max-w-xs">
              Singles, EPs, albums, merch drops, or tour announcements — every release gets its own command center.
            </p>
            <Button variant="secondary" size="sm" className="mt-4" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setModalOpen(true)}>
              Create release room
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

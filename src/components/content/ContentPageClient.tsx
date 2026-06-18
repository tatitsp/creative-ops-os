"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { CONTENT_PHASES, PLATFORM_CONFIG } from "@/lib/constants";
import { usePipelineStore, type ApiContentItem } from "@/store/pipeline-store";
import {
  Film, Camera, Layers, Image as ImageIcon, Mic, FileText,
  X, ChevronRight, CalendarDays, Check, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentItem, ContentPhase } from "@/types";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  VIDEO:    <Film     className="w-4 h-4" />,
  REEL:     <Film     className="w-4 h-4" />,
  SHORT:    <Film     className="w-4 h-4" />,
  PHOTO:    <Camera   className="w-4 h-4" />,
  CAROUSEL: <Layers   className="w-4 h-4" />,
  STORY:    <ImageIcon className="w-4 h-4" />,
  PODCAST:  <Mic      className="w-4 h-4" />,
  BLOG:     <FileText className="w-4 h-4" />,
};

const PIPELINE_STAGES: ContentPhase[] = [
  "IDEA", "PLANNING", "PRODUCTION", "EDITING",
  "REVIEW", "APPROVED", "SCHEDULED", "POSTED",
];

const FILTER_TABS: { key: string; label: string; phases: ContentPhase[] | null }[] = [
  { key: "all",       label: "All",        phases: null },
  { key: "draft",     label: "Draft",      phases: ["IDEA", "PLANNING", "PRODUCTION", "EDITING"] },
  { key: "review",    label: "In Review",  phases: ["REVIEW"] },
  { key: "approved",  label: "Approved",   phases: ["APPROVED"] },
  { key: "published", label: "Published",  phases: ["SCHEDULED", "POSTED"] },
];

const CONTENT_TYPES = ["VIDEO", "REEL", "SHORT", "PHOTO", "CAROUSEL", "STORY", "PODCAST", "BLOG", "PRESS_RELEASE", "TWEET", "OTHER"] as const;
const PLATFORM_OPTIONS = ["INSTAGRAM", "TIKTOK", "YOUTUBE", "TWITTER", "FACEBOOK", "SPOTIFY", "APPLE_MUSIC", "WEBSITE", "OTHER"];

type Props = {
  workspaceSlug: string;
  initialItems: ApiContentItem[];
};

export function ContentPageClient({ workspaceSlug, initialItems }: Props) {
  const store = usePipelineStore();
  const { items, moveItem, addItem } = store;

  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState({
    title: "",
    type: "VIDEO" as typeof CONTENT_TYPES[number],
    platforms: [] as string[],
    phase: "IDEA" as ContentPhase,
  });

  // Initialise store from server-fetched data on mount
  useEffect(() => {
    store.init(workspaceSlug, initialItems);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceSlug]);

  const tab = FILTER_TABS.find((t) => t.key === activeFilter)!;
  const filtered = tab.phases
    ? items.filter((i) => tab.phases!.includes(i.phase))
    : items;

  const selectedItem = selected ? items.find((i) => i.id === selected.id) ?? null : null;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newForm.title.trim() || !workspaceSlug) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceSlug}/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });
      if (res.ok) {
        const data = await res.json();
        addItem(data.item);
        setShowNewModal(false);
        setNewForm({ title: "", type: "VIDEO", platforms: [], phase: "IDEA" });
      }
    } finally {
      setCreating(false);
    }
  }

  function togglePlatform(p: string) {
    setNewForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p],
    }));
  }

  return (
    <div className="p-6 animate-in">

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        {FILTER_TABS.map((tab) => {
          const count = tab.phases
            ? items.filter((i) => tab.phases!.includes(i.phase)).length
            : items.length;
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors",
                isActive
                  ? "border-white text-white"
                  : "border-transparent text-ink-tertiary hover:text-ink-secondary",
              )}
            >
              {tab.label}
              <span className={cn("text-2xs font-bold px-1.5 py-0.5 rounded-full", isActive ? "bg-canvas-200 text-ink" : "bg-canvas-100 text-ink-tertiary")}>
                {count}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => setShowNewModal(true)}
          className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-ink-secondary hover:text-ink transition-colors px-3 py-2"
        >
          <Plus className="w-3.5 h-3.5" />
          New
        </button>
      </div>

      {/* ── Content list ── */}
      <div className="card divide-y divide-border">
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-ink-tertiary mb-3">No content in this stage.</p>
            {activeFilter === "all" && workspaceSlug && (
              <button
                onClick={() => setShowNewModal(true)}
                className="text-xs font-semibold text-ink-secondary hover:text-ink transition-colors flex items-center gap-1.5 mx-auto"
              >
                <Plus className="w-3.5 h-3.5" /> Add your first piece
              </button>
            )}
          </div>
        )}
        {filtered.map((item) => {
          const phaseCfg = CONTENT_PHASES.find((p) => p.phase === item.phase)!;
          return (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className="flex items-center gap-4 px-5 py-4 hover:bg-canvas-100 transition-colors cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-canvas-100 group-hover:bg-canvas-200 flex items-center justify-center flex-shrink-0 text-ink-tertiary transition-colors">
                {TYPE_ICONS[item.type] ?? <Film className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{item.title}</p>
                {item.campaignName && (
                  <p className="text-2xs text-ink-tertiary mt-0.5 truncate">{item.campaignName}</p>
                )}
              </div>
              <span className={cn("text-2xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0", phaseCfg?.color)}>
                {phaseCfg?.label}
              </span>
              <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                {item.platforms.slice(0, 3).map((p) => {
                  const cfg = PLATFORM_CONFIG[p as keyof typeof PLATFORM_CONFIG];
                  return (
                    <span key={p} className="text-2xs px-2 py-0.5 rounded-full bg-canvas-100 text-ink-tertiary">
                      {cfg?.label ?? p}
                    </span>
                  );
                })}
              </div>
              {item.scheduledAt ? (
                <span className="hidden lg:flex items-center gap-1.5 text-xs text-ink-tertiary flex-shrink-0">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {new Date(item.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              ) : (
                <span className="hidden lg:block w-20 flex-shrink-0" />
              )}
              <div className="flex-shrink-0">
                {item.assignee
                  ? <Avatar user={item.assignee as any} size="sm" />
                  : <div className="w-7 h-7 rounded-full border border-dashed border-border" />
                }
              </div>
              <ChevronRight className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
            </div>
          );
        })}
      </div>

      {/* ── New content modal ── */}
      {showNewModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowNewModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <form
              onSubmit={handleCreate}
              className="w-full max-w-md bg-[#0D0D0D] border border-border rounded-2xl p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-ink">New Content</h2>
                <button type="button" onClick={() => setShowNewModal(false)} className="p-1.5 rounded-lg hover:bg-canvas-100 text-ink-tertiary">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-label mb-1.5 block">Title</label>
                <input
                  autoFocus
                  value={newForm.title}
                  onChange={(e) => setNewForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Behind the Scenes Reel"
                  className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong placeholder:text-ink-tertiary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-label mb-1.5 block">Type</label>
                  <select
                    value={newForm.type}
                    onChange={(e) => setNewForm((f) => ({ ...f, type: e.target.value as typeof CONTENT_TYPES[number] }))}
                    className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong"
                  >
                    {CONTENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase().replace("_", " ")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-label mb-1.5 block">Start Phase</label>
                  <select
                    value={newForm.phase}
                    onChange={(e) => setNewForm((f) => ({ ...f, phase: e.target.value as ContentPhase }))}
                    className="w-full bg-canvas-100 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-border-strong"
                  >
                    {PIPELINE_STAGES.map((p) => {
                      const cfg = CONTENT_PHASES.find((c) => c.phase === p);
                      return <option key={p} value={p}>{cfg?.label ?? p}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-label mb-2 block">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORM_OPTIONS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full border transition-colors",
                        newForm.platforms.includes(p)
                          ? "bg-white text-black border-white"
                          : "border-border text-ink-secondary hover:border-border-strong",
                      )}
                    >
                      {p.charAt(0) + p.slice(1).toLowerCase().replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-ink-secondary bg-canvas-100 hover:bg-canvas-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newForm.title.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black bg-white hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {creating ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── Detail panel ── */}
      {selectedItem && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0D0D0D] border-l border-border z-50 flex flex-col animate-[slide-in-right_0.2s_ease-out] overflow-hidden">
            <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-border">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-canvas-100 flex items-center justify-center flex-shrink-0 text-ink-tertiary mt-0.5">
                  {TYPE_ICONS[selectedItem.type] ?? <Film className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-ink leading-snug">{selectedItem.title}</h2>
                  {selectedItem.campaignName && (
                    <p className="text-xs text-ink-tertiary mt-0.5">{selectedItem.campaignName}</p>
                  )}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-canvas-100 text-ink-tertiary hover:text-ink transition-colors flex-shrink-0 ml-3">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 border-b border-border">
              <p className="text-label mb-4">Pipeline Stage</p>
              <div className="space-y-1">
                {PIPELINE_STAGES.map((phase, idx) => {
                  const cfg = CONTENT_PHASES.find((p) => p.phase === phase)!;
                  const currentIdx = PIPELINE_STAGES.indexOf(selectedItem.phase);
                  const isActive = phase === selectedItem.phase;
                  const isCompleted = idx < currentIdx;
                  return (
                    <button
                      key={phase}
                      onClick={() => moveItem(selectedItem.id, phase)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                        isActive ? "bg-canvas-200 border border-border-strong" : "hover:bg-canvas-100 border border-transparent",
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-2xs font-bold",
                        isActive ? "bg-white text-black" : isCompleted ? "bg-emerald-500/20 text-emerald-500" : "bg-canvas-200 text-ink-tertiary",
                      )}>
                        {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                      </div>
                      <span className={cn("text-sm font-medium", isActive ? "text-ink" : isCompleted ? "text-ink-tertiary line-through" : "text-ink-secondary")}>
                        {cfg?.label}
                      </span>
                      {isActive && <span className={cn("ml-auto text-2xs font-semibold px-2 py-0.5 rounded-full", cfg?.color)}>Current</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-5 space-y-4 flex-1 overflow-y-auto">
              {selectedItem.platforms.length > 0 && (
                <div>
                  <p className="text-label mb-2">Platforms</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedItem.platforms.map((p) => {
                      const cfg = PLATFORM_CONFIG[p as keyof typeof PLATFORM_CONFIG];
                      return (
                        <span key={p} className="text-xs font-medium px-3 py-1 rounded-full bg-canvas-100 border border-border text-ink-secondary">
                          {cfg?.label ?? p}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {selectedItem.assignee && (
                <div>
                  <p className="text-label mb-2">Assigned To</p>
                  <div className="flex items-center gap-2.5">
                    <Avatar user={selectedItem.assignee as any} size="sm" showStatus />
                    <p className="text-sm font-medium text-ink">{selectedItem.assignee.name}</p>
                  </div>
                </div>
              )}
              {selectedItem.scheduledAt && (
                <div>
                  <p className="text-label mb-2">Scheduled</p>
                  <p className="text-sm text-ink flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-ink-tertiary" />
                    {new Date(selectedItem.scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

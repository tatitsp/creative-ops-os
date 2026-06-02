"use client";

import React, { useState } from "react";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { AssetUploadButton } from "@/components/assets/AssetUploadButton";
import { WORKSPACES } from "@/lib/workspaces";
import { FolderOpen, Search, Filter, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";

const FOLDERS = [
  "All Files",
  "Album Artwork",
  "Video Assets",
  "Photos",
  "Press",
  "Audio",
  "Templates",
];

const FILTER_OPTIONS = ["Images", "Video", "Audio", "Documents", "Raw"];
const TAG_OPTIONS = ["Mrs.Key", "Ecclesiastes", "Press Kit", "Social", "Merch", "BTS"];

interface Props {
  workspaceSlug: string;
  children: React.ReactNode;
}

export function AssetsPageClient({ workspaceSlug, children }: Props) {
  const ws = WORKSPACES.find((w) => w.slug === workspaceSlug);
  const [activeFolder, setActiveFolder] = useState("All Files");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  function toggleFilter(f: string) {
    setActiveFilters((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  }

  function toggleTag(t: string) {
    setActiveTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }

  const hasActiveFilters = activeFilters.length > 0 || activeTags.length > 0;

  return (
    <div className="min-h-screen">
      <TopBar
        title={ws ? `Welcome to ${ws.artistName}'s Vault` : "Media Vault"}
        subtitle="Central media archive"
        actions={<AssetUploadButton workspaceSlug={workspaceSlug} />}
      />

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Folder sidebar */}
        <aside className="w-48 border-r border-border bg-canvas-50 p-3 flex-shrink-0">
          <p className="text-label mb-2">Folders</p>
          <ul className="space-y-0.5">
            {FOLDERS.map((folder) => (
              <li key={folder}>
                <button
                  onClick={() => setActiveFolder(folder)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    activeFolder === folder
                      ? "bg-gold-50 text-gold"
                      : "text-ink-secondary hover:bg-canvas-100 hover:text-ink",
                  )}
                >
                  <FolderOpen className="w-3.5 h-3.5 flex-shrink-0" />
                  {folder}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {/* Search + filter bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-canvas-100 border border-border rounded-lg px-3 py-2 flex-1 max-w-sm focus-within:ring-1 focus-within:ring-white/20 focus-within:border-border-strong transition-all">
              <Search className="w-4 h-4 text-ink-tertiary" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets..."
                className="text-sm bg-transparent outline-none text-ink placeholder:text-ink-tertiary w-full"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-ink-tertiary hover:text-ink transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="relative">
              <Button
                variant={filterOpen || activeFilters.length > 0 ? "primary" : "secondary"}
                size="sm"
                leftIcon={<Filter className="w-3.5 h-3.5" />}
                onClick={() => { setFilterOpen((v) => !v); setTagsOpen(false); }}
              >
                Filter {activeFilters.length > 0 && `(${activeFilters.length})`}
              </Button>
              {filterOpen && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-canvas-50 border border-border rounded-xl shadow-lg p-2 min-w-36 space-y-0.5">
                  {FILTER_OPTIONS.map((f) => (
                    <button
                      key={f}
                      onClick={() => toggleFilter(f)}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-xs rounded-lg font-medium transition-colors",
                        activeFilters.includes(f) ? "bg-gold-50 text-gold" : "text-ink-secondary hover:bg-canvas-100 hover:text-ink",
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <Button
                variant={tagsOpen || activeTags.length > 0 ? "primary" : "secondary"}
                size="sm"
                leftIcon={<Tag className="w-3.5 h-3.5" />}
                onClick={() => { setTagsOpen((v) => !v); setFilterOpen(false); }}
              >
                Tags {activeTags.length > 0 && `(${activeTags.length})`}
              </Button>
              {tagsOpen && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-canvas-50 border border-border rounded-xl shadow-lg p-2 min-w-40 space-y-0.5">
                  {TAG_OPTIONS.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-xs rounded-lg font-medium transition-colors",
                        activeTags.includes(t) ? "bg-gold-50 text-gold" : "text-ink-secondary hover:bg-canvas-100 hover:text-ink",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {hasActiveFilters && (
              <button
                onClick={() => { setActiveFilters([]); setActiveTags([]); }}
                className="text-xs text-ink-tertiary hover:text-ink transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>

          {/* Active filter pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 text-2xs font-medium px-2 py-1 rounded-full bg-gold-50 text-gold">
                  {f}
                  <button onClick={() => toggleFilter(f)}><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
              {activeTags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 text-2xs font-medium px-2 py-1 rounded-full bg-violet-50 text-violet-600">
                  #{t}
                  <button onClick={() => toggleTag(t)}><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
            </div>
          )}

          {/* Folder breadcrumb */}
          {activeFolder !== "All Files" && (
            <div className="flex items-center gap-2 text-xs text-ink-secondary">
              <button onClick={() => setActiveFolder("All Files")} className="hover:text-ink transition-colors">
                All Files
              </button>
              <span>/</span>
              <span className="text-ink font-medium">{activeFolder}</span>
            </div>
          )}

          {/* Live asset grid */}
          {children}
        </div>
      </div>
    </div>
  );
}

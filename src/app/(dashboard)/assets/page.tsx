import type { Metadata } from "next";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { AssetUploadButton } from "@/components/assets/AssetUploadButton";
import { AssetGrid } from "@/components/assets/AssetGrid";
import { WORKSPACES } from "@/lib/workspaces";
import { FolderOpen, Search, Filter, Tag } from "lucide-react";

export const metadata: Metadata = { title: "Asset Library" };

const FOLDERS = [
  "All Files",
  "Album Artwork",
  "Video Assets",
  "Photos",
  "Press",
  "Audio",
  "Templates",
];

const LIL_TONY = WORKSPACES.find((w) => w.slug === "lil-tony")!;

export default function AssetsPage() {
  return (
    <div className="min-h-screen">
      <TopBar
        title={`Welcome to ${LIL_TONY.artistName}'s Vault`}
        subtitle="Central media archive"
        actions={<AssetUploadButton workspaceSlug="lil-tony" />}
      />

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Folder sidebar */}
        <aside className="w-48 border-r border-border bg-canvas-50 p-3 flex-shrink-0">
          <p className="text-label mb-2">Folders</p>
          <ul className="space-y-0.5">
            {FOLDERS.map((folder, i) => (
              <li key={folder}>
                <button
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    i === 0
                      ? "bg-gold-50 text-gold"
                      : "text-ink-secondary hover:bg-canvas-100 hover:text-ink"
                  }`}
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-canvas-100 border border-border rounded-lg px-3 py-2 flex-1 max-w-sm focus-within:ring-1 focus-within:ring-white/20 focus-within:border-border-strong transition-all">
              <Search className="w-4 h-4 text-ink-tertiary" />
              <input
                placeholder="Search assets..."
                className="text-sm bg-transparent outline-none text-ink placeholder:text-ink-tertiary w-full"
              />
            </div>
            <Button variant="secondary" size="sm" leftIcon={<Filter className="w-3.5 h-3.5" />}>
              Filter
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Tag className="w-3.5 h-3.5" />}>
              Tags
            </Button>
          </div>

          {/* Live asset list from database */}
          <AssetGrid workspaceSlug="lil-tony" />
        </div>
      </div>
    </div>
  );
}

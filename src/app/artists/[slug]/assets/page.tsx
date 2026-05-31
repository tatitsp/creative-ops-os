import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { AssetGrid } from "@/components/assets/AssetGrid";
import { Button } from "@/components/ui/Button";
import { Upload, FolderOpen, Search, Filter, Tag } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Asset Library` : "Asset Library" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({
    slug: w.slug,
  }));
}

const FOLDERS = [
  "All Files",
  "Album Artwork",
  "Video Assets",
  "Photos",
  "Press",
  "Audio",
  "Templates",
];

export default async function ArtistAssetsPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  return (
    <>
      <TopBar
        title={`Welcome to ${ws.artistName}'s Vault`}
        subtitle="Central media archive"
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Upload className="w-3.5 h-3.5" />}
          >
            Upload assets
          </Button>
        }
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
            <div className="flex items-center gap-2 bg-canvas-100 border border-border rounded-lg px-3 py-2 flex-1 max-w-sm">
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

          {/* Live asset list from database, scoped to this artist's workspace */}
          <AssetGrid workspaceSlug={slug} />
        </div>
      </div>
    </>
  );
}

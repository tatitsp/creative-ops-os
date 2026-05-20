import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { CAAM1K_ASSETS } from "@/lib/mock-artist2";
import { Button } from "@/components/ui/Button";
import { formatFileSize, formatRelativeTime } from "@/lib/utils";
import {
  Upload,
  FolderOpen,
  Image as ImageIcon,
  Film,
  FileText,
  Music,
  Search,
  Filter,
  MoreHorizontal,
  Tag,
} from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Asset Library` : "Asset Library" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

const FILE_ICON: Record<string, React.ReactNode> = {
  image:    <ImageIcon className="w-5 h-5 text-rose-400" />,
  video:    <Film className="w-5 h-5 text-gold" />,
  audio:    <Music className="w-5 h-5 text-emerald-400" />,
  document: <FileText className="w-5 h-5 text-sky-400" />,
  design:   <ImageIcon className="w-5 h-5 text-pink-400" />,
};

const FOLDERS = ["All Files", "Album Artwork", "Video Assets", "Photos", "Press", "Audio", "Templates"];

export default async function ArtistAssetsPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  return (
    <>
      <TopBar
        title="Asset Library"
        subtitle={`${CAAM1K_ASSETS.length} files · ${ws.artistName}`}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Upload className="w-3.5 h-3.5" />}>
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

        {/* Main */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-canvas-100 border border-border rounded-lg px-3 py-2 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-ink-tertiary" />
              <input
                placeholder="Search assets..."
                className="text-sm bg-transparent outline-none text-ink placeholder:text-ink-tertiary w-full"
              />
            </div>
            <Button variant="secondary" size="sm" leftIcon={<Filter className="w-3.5 h-3.5" />}>Filter</Button>
            <Button variant="secondary" size="sm" leftIcon={<Tag className="w-3.5 h-3.5" />}>Tags</Button>
          </div>

          <div className="card divide-y divide-border">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-2.5 text-label">
              <span className="w-8" />
              <span>Name</span>
              <span className="hidden md:block w-24">Uploaded by</span>
              <span className="hidden lg:block w-28">Date</span>
              <span className="w-20 text-right">Size</span>
              <span className="w-8" />
            </div>

            {CAAM1K_ASSETS.map((asset) => {
              const icon = FILE_ICON[asset.fileType] ?? <FileText className="w-5 h-5 text-ink-tertiary" />;
              return (
                <div
                  key={asset.id}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-3 hover:bg-canvas-50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-canvas-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {asset.thumbnailUrl ? (
                      <Image
                        src={asset.thumbnailUrl}
                        alt={asset.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{asset.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {asset.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-2xs px-1.5 py-0.5 rounded-full bg-canvas-100 text-ink-tertiary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="hidden md:block text-xs text-ink-secondary w-24 truncate">
                    {asset.uploader}
                  </span>
                  <span className="hidden lg:block text-xs text-ink-tertiary w-28">
                    {formatRelativeTime(asset.createdAt)}
                  </span>
                  <span className="text-xs text-ink-tertiary w-20 text-right">
                    {formatFileSize(asset.size)}
                  </span>
                  <button className="w-8 flex justify-end">
                    <MoreHorizontal className="w-4 h-4 text-ink-tertiary" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

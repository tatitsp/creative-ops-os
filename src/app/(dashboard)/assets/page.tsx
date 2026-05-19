import type { Metadata } from "next";
import Image from "next/image";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { MOCK_USERS, COVERS, ARTIST_PHOTO } from "@/lib/mock-data";
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
  LayoutGrid,
  List,
  MoreHorizontal,
  Tag,
} from "lucide-react";

export const metadata: Metadata = { title: "Asset Library" };

// Mock assets — replace with real DB query
const MOCK_ASSETS = [
  {
    id: "a1",
    name: "MrsKey_cover_art_final.jpg",
    fileType: "image",
    mimeType: "image/jpeg",
    size: 4800000,
    thumbnailUrl: COVERS.mrsKey,
    tags: ["cover art", "Mrs.Key", "album", "2026"],
    uploader: MOCK_USERS[5],
    createdAt: "2026-03-01T10:00:00Z",
    folder: "Album Artwork",
  },
  {
    id: "a2",
    name: "REPENT_cover_art_final.jpg",
    fileType: "image",
    mimeType: "image/jpeg",
    size: 4600000,
    thumbnailUrl: COVERS.repent,
    tags: ["cover art", "REPENT!", "album", "2026"],
    uploader: MOCK_USERS[5],
    createdAt: "2026-01-15T10:00:00Z",
    folder: "Album Artwork",
  },
  {
    id: "a3",
    name: "Ecclesiastes_single_cover.jpg",
    fileType: "image",
    mimeType: "image/jpeg",
    size: 3900000,
    thumbnailUrl: COVERS.ecclesiastes,
    tags: ["cover art", "Ecclesiastes", "single", "2026"],
    uploader: MOCK_USERS[5],
    createdAt: "2026-04-10T09:00:00Z",
    folder: "Album Artwork",
  },
  {
    id: "a4",
    name: "DISCERNMENT_cover_art.jpg",
    fileType: "image",
    mimeType: "image/jpeg",
    size: 4200000,
    thumbnailUrl: COVERS.discernment,
    tags: ["cover art", "DISCERNMENT", "collab", "Hariroc", "2025"],
    uploader: MOCK_USERS[5],
    createdAt: "2025-10-01T10:00:00Z",
    folder: "Album Artwork",
  },
  {
    id: "a5",
    name: "TkeyVsTony_cover_art.jpg",
    fileType: "image",
    mimeType: "image/jpeg",
    size: 5100000,
    thumbnailUrl: COVERS.tkeyVsTony,
    tags: ["cover art", "Tkey vs Tony", "album", "2025"],
    uploader: MOCK_USERS[5],
    createdAt: "2025-06-01T10:00:00Z",
    folder: "Album Artwork",
  },
  {
    id: "a6",
    name: "LilTonyOfficial_artist_photo.jpg",
    fileType: "image",
    mimeType: "image/jpeg",
    size: 6200000,
    thumbnailUrl: ARTIST_PHOTO,
    tags: ["artist photo", "press kit", "promo"],
    uploader: MOCK_USERS[4],
    createdAt: "2026-04-20T14:00:00Z",
    folder: "Photos",
  },
  {
    id: "a7",
    name: "3AM_visualizer_v2_final.mp4",
    fileType: "video",
    mimeType: "video/mp4",
    size: 182000000,
    tags: ["visualizer", "3 AM", "Mrs.Key", "video"],
    uploader: MOCK_USERS[2],
    createdAt: "2026-05-18T11:45:00Z",
    folder: "Video Assets",
  },
  {
    id: "a8",
    name: "artist_photoshoot_press_selects.zip",
    fileType: "archive",
    mimeType: "application/zip",
    size: 560000000,
    tags: ["photos", "press", "selects", "hi-res"],
    uploader: MOCK_USERS[4],
    createdAt: "2026-05-17T18:00:00Z",
    folder: "Photos",
  },
  {
    id: "a9",
    name: "press_kit_bio_MrsKey_update.docx",
    fileType: "document",
    mimeType: "application/docx",
    size: 52000,
    tags: ["press kit", "bio", "Mrs.Key"],
    uploader: MOCK_USERS[1],
    createdAt: "2026-05-16T14:00:00Z",
    folder: "Press",
  },
  {
    id: "a10",
    name: "3AM_master_final.wav",
    fileType: "audio",
    mimeType: "audio/wav",
    size: 92000000,
    tags: ["audio", "master", "3 AM", "Mrs.Key"],
    uploader: MOCK_USERS[0],
    createdAt: "2026-02-28T09:00:00Z",
    folder: "Audio",
  },
  {
    id: "a11",
    name: "social_templates_2026.psd",
    fileType: "design",
    mimeType: "image/psd",
    size: 24000000,
    tags: ["template", "instagram", "design", "2026"],
    uploader: MOCK_USERS[5],
    createdAt: "2026-05-14T16:30:00Z",
    folder: "Templates",
  },
];

const FILE_ICON: Record<string, React.ReactNode> = {
  image: <ImageIcon className="w-5 h-5 text-rose-400" />,
  video: <Film className="w-5 h-5 text-gold" />,
  audio: <Music className="w-5 h-5 text-emerald-400" />,
  document: <FileText className="w-5 h-5 text-sky-400" />,
  archive: <FolderOpen className="w-5 h-5 text-amber-400" />,
  design: <ImageIcon className="w-5 h-5 text-pink-400" />,
};

const FOLDERS = ["All Files", "Album Artwork", "Video Assets", "Photos", "Press", "Audio", "Templates"];

export default function AssetsPage() {
  return (
    <div className="min-h-screen">
      <TopBar
        title="Asset Library"
        subtitle={`${MOCK_ASSETS.length} files · Central media archive`}
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
          {/* Search + filter */}
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

          {/* File list */}
          <div className="card divide-y divide-border">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-2.5 text-label">
              <span className="w-8" />
              <span>Name</span>
              <span className="hidden md:block w-32">Uploaded by</span>
              <span className="hidden lg:block w-28">Date</span>
              <span className="w-20 text-right">Size</span>
              <span className="w-8" />
            </div>

            {MOCK_ASSETS.map((asset) => {
              const icon = FILE_ICON[asset.fileType] ?? <FileText className="w-5 h-5 text-ink-tertiary" />;
              const hasThumbnail = "thumbnailUrl" in asset && asset.thumbnailUrl;

              return (
                <div
                  key={asset.id}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-3 hover:bg-canvas-50 transition-colors cursor-pointer"
                >
                  {/* Thumbnail or icon */}
                  <div className="w-8 h-8 rounded-lg bg-canvas-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {hasThumbnail ? (
                      <Image
                        src={(asset as typeof asset & { thumbnailUrl: string }).thumbnailUrl}
                        alt={asset.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      icon
                    )}
                  </div>

                  {/* Name + tags */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{asset.name}</p>
                    <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                      {asset.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-2xs px-1.5 py-0.5 rounded-full bg-canvas-100 text-ink-tertiary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Uploader */}
                  <div className="hidden md:flex items-center gap-2 w-32">
                    <Avatar user={asset.uploader} size="xs" />
                    <span className="text-xs text-ink-secondary truncate">{asset.uploader.name.split(" ")[0]}</span>
                  </div>

                  {/* Date */}
                  <span className="hidden lg:block text-xs text-ink-tertiary w-28">
                    {formatRelativeTime(asset.createdAt)}
                  </span>

                  {/* Size */}
                  <span className="text-xs text-ink-tertiary w-20 text-right">
                    {formatFileSize(asset.size)}
                  </span>

                  {/* Actions */}
                  <button className="w-8 flex justify-end">
                    <MoreHorizontal className="w-4 h-4 text-ink-tertiary" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

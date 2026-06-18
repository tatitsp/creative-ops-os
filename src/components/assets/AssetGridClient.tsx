"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Avatar } from "@/components/ui/Avatar";
import { formatFileSize, formatRelativeTime } from "@/lib/utils";
import {
  FolderOpen,
  Image as ImageIcon,
  Film,
  FileText,
  Music,
  MoreHorizontal,
  Package,
  Trash2,
  Download,
} from "lucide-react";
import type { UserStatus } from "@/types";

const FILE_ICON: Record<string, React.ReactNode> = {
  image:    <ImageIcon  className="w-5 h-5 text-rose-400" />,
  video:    <Film       className="w-5 h-5 text-gold" />,
  audio:    <Music      className="w-5 h-5 text-emerald-400" />,
  document: <FileText   className="w-5 h-5 text-sky-400" />,
  archive:  <FolderOpen className="w-5 h-5 text-amber-400" />,
  design:   <ImageIcon  className="w-5 h-5 text-pink-400" />,
};

export interface AssetRow {
  id: string;
  name: string;
  url: string;
  fileType: string;
  size: number;
  tags: string[];
  thumbnailUrl: string | null;
  createdAt: string;
  uploader: {
    name: string | null;
    email: string;
    image: string | null;
    status: string;
  };
}

interface Props {
  workspaceSlug: string;
  assets: AssetRow[];
}

function AssetRow({
  asset,
  workspaceSlug,
  onDeleted,
}: {
  asset: AssetRow;
  workspaceSlug: string;
  onDeleted: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function handleDelete() {
    if (!confirm(`Delete "${asset.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    setOpen(false);
    try {
      const res = await fetch(
        `/api/workspaces/${workspaceSlug}/assets/${asset.id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        onDeleted(asset.id);
      } else {
        alert("Failed to delete asset.");
        setDeleting(false);
      }
    } catch {
      alert("Failed to delete asset.");
      setDeleting(false);
    }
  }

  function handleDownload() {
    setOpen(false);
    window.open(asset.url, "_blank", "noopener,noreferrer");
  }

  const icon = FILE_ICON[asset.fileType] ?? <FileText className="w-5 h-5 text-ink-tertiary" />;
  const previewUrl =
    asset.thumbnailUrl ?? (asset.fileType === "image" ? asset.url : null);
  const uploaderUser = {
    name: asset.uploader.name ?? asset.uploader.email ?? "Unknown",
    image: asset.uploader.image ?? undefined,
    status: (asset.uploader.status ?? "ACTIVE") as UserStatus,
  };

  return (
    <div
      className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-3 hover:bg-canvas-50 transition-colors ${deleting ? "opacity-40 pointer-events-none" : ""}`}
    >
      {/* Thumbnail or icon */}
      <div className="w-8 h-8 rounded-lg bg-canvas-100 flex items-center justify-center overflow-hidden flex-shrink-0">
        {previewUrl ? (
          <Image
            src={previewUrl}
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
        <Avatar user={uploaderUser} size="xs" />
        <span className="text-xs text-ink-secondary truncate">
          {uploaderUser.name.split(" ")[0]}
        </span>
      </div>

      {/* Date */}
      <span className="hidden lg:block text-xs text-ink-tertiary w-28">
        {formatRelativeTime(asset.createdAt)}
      </span>

      {/* Size */}
      <span className="text-xs text-ink-tertiary w-20 text-right">
        {formatFileSize(asset.size)}
      </span>

      {/* Three-dot menu */}
      <div className="relative w-8 flex justify-end" ref={menuRef}>
        <button
          className="p-1 rounded hover:bg-canvas-100 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Asset options"
        >
          <MoreHorizontal className="w-4 h-4 text-ink-tertiary" />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-canvas-50 border border-border rounded-xl shadow-lg z-30 py-1 overflow-hidden">
            <button
              onClick={handleDownload}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-ink hover:bg-canvas-100 transition-colors text-left"
            >
              <Download className="w-3.5 h-3.5 text-ink-secondary" />
              Download
            </button>
            <div className="my-1 border-t border-border" />
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function AssetGridClient({ workspaceSlug, assets: initialAssets }: Props) {
  const [assets, setAssets] = useState(initialAssets);

  function handleDeleted(id: string) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }

  if (assets.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-2xl bg-canvas-100 flex items-center justify-center mb-3">
          <Package className="w-6 h-6 text-ink-tertiary" />
        </div>
        <p className="text-sm font-semibold text-ink">No assets yet</p>
        <p className="text-xs text-ink-tertiary mt-1 max-w-xs">
          Upload your first file using the button above — photos, videos, audio
          masters, and design files all land here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="card divide-y divide-border">
      {/* Column headers */}
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-2.5 text-label">
        <span className="w-8" />
        <span>Name</span>
        <span className="hidden md:block w-32">Uploaded by</span>
        <span className="hidden lg:block w-28">Date</span>
        <span className="w-20 text-right">Size</span>
        <span className="w-8" />
      </div>

      {assets.map((asset) => (
        <AssetRow
          key={asset.id}
          asset={asset}
          workspaceSlug={workspaceSlug}
          onDeleted={handleDeleted}
        />
      ))}
    </div>
  );
}

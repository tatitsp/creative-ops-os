// Server component — fetches real assets from Prisma, filtered by workspace slug.
// Images are served directly from the GCS public URL stored on the Asset record.

import { prisma } from "@/lib/prisma";
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

interface Props {
  workspaceSlug: string;
}

export async function AssetGrid({ workspaceSlug }: Props) {
  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
    select: {
      assets: {
        where: { isArchived: false },
        include: {
          uploader: {
            select: { name: true, image: true, email: true, status: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const assets = workspace?.assets ?? [];

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

      {assets.map((asset) => {
        const icon = FILE_ICON[asset.fileType] ?? (
          <FileText className="w-5 h-5 text-ink-tertiary" />
        );

        // Use dedicated thumbnail if available; for images the primary GCS url
        // is itself displayable. For all other types, fall back to the file icon.
        const previewUrl =
          asset.thumbnailUrl ??
          (asset.fileType === "image" ? asset.url : null);

        const uploaderUser = {
          name: asset.uploader.name ?? asset.uploader.email ?? "Unknown",
          image: asset.uploader.image ?? undefined,
          status: (asset.uploader.status ?? "ACTIVE") as UserStatus,
        };

        return (
          <div
            key={asset.id}
            className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-3 hover:bg-canvas-50 transition-colors cursor-pointer"
          >
            {/* Thumbnail or file-type icon */}
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
              {formatRelativeTime(asset.createdAt.toISOString())}
            </span>

            {/* Size */}
            <span className="text-xs text-ink-tertiary w-20 text-right">
              {formatFileSize(asset.size)}
            </span>

            {/* Row actions */}
            <button className="w-8 flex justify-end">
              <MoreHorizontal className="w-4 h-4 text-ink-tertiary" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

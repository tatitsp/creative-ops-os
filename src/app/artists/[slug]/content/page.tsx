import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { MIRIAM_CONTENT } from "@/lib/mock-artist2";
import { Film, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Content` : "Content" };
}

export async function generateStaticParams() {
  return WORKSPACES.map((w) => ({ slug: w.slug }));
}

const PHASE_STYLES: Record<string, string> = {
  PLANNING: "bg-canvas-100 text-ink-tertiary",
  DRAFT: "bg-canvas-200 text-ink-secondary",
  PRODUCTION: "bg-gold-50 text-gold",
  REVIEW: "bg-amber-50 text-amber-600",
  APPROVED: "bg-emerald-50 text-emerald-600",
  POSTED: "bg-canvas-100 text-ink-tertiary",
};

const TYPE_LABELS: Record<string, string> = {
  REEL: "Reel",
  STORY: "Story",
  CAROUSEL: "Carousel",
  PHOTO: "Photo",
  VIDEO: "Video",
};

export default async function ArtistContentPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  return (
    <>
      <TopBar title="Content" subtitle={ws.artistName} />

      <div className="p-6 animate-in max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-subheading">Content Pipeline</h2>
          <span className="text-xs text-ink-tertiary">{MIRIAM_CONTENT.length} items</span>
        </div>

        <div className="space-y-2">
          {MIRIAM_CONTENT.map((item) => (
            <div key={item.id} className="card p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-canvas-100 flex items-center justify-center flex-shrink-0">
                <Film className="w-4 h-4 text-ink-tertiary" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xs text-ink-tertiary">
                    {TYPE_LABELS[item.type] ?? item.type}
                  </span>
                  <span className="text-2xs text-ink-tertiary">·</span>
                  <span className="flex items-center gap-1 text-2xs text-ink-tertiary">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(item.scheduledAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {item.platforms.map((p) => (
                  <span key={p} className="text-2xs px-1.5 py-0.5 rounded bg-canvas-100 text-ink-tertiary capitalize">
                    {p}
                  </span>
                ))}
                <span className={cn(
                  "text-2xs font-semibold px-2 py-0.5 rounded-full",
                  PHASE_STYLES[item.phase] ?? "bg-canvas-100 text-ink-tertiary",
                )}>
                  {item.phase}
                </span>
              </div>
            </div>
          ))}
        </div>

        {MIRIAM_CONTENT.length === 0 && (
          <div className="text-center py-16 text-ink-tertiary">
            <Film className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No content items yet.</p>
          </div>
        )}
      </div>
    </>
  );
}

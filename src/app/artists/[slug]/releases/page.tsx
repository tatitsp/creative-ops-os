import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { CAAM1K_RELEASES, CAAM1K_CAMPAIGNS, CAAM1K_TOP_TRACKS } from "@/lib/mock-artist2";
import { CalendarDays, ChevronRight, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Releases` : "Releases" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

const STATUS_STYLES: Record<string, string> = {
  PLANNING: "bg-canvas-100 text-ink-tertiary",
  PRODUCTION: "bg-gold-50 text-gold",
  ACTIVE: "bg-emerald-50 text-emerald-600",
  POSTED: "bg-canvas-100 text-ink-secondary",
  ANALYTICS: "bg-blue-50 text-blue-600",
  COMPLETE: "bg-canvas-100 text-ink-tertiary",
};

export default async function ArtistReleasesPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  return (
    <>
      <TopBar title={`${ws.artistName} | Command`} subtitle="Every release. One room." />

      <div className="p-6 space-y-6 animate-in max-w-4xl">
        {/* Releases */}
        <section>
          <h2 className="text-subheading mb-3">Discography</h2>
          <div className="space-y-3">
            {CAAM1K_RELEASES.map((release) => (
              <div key={release.id} className="card p-5 flex items-center gap-5">
                {/* Cover */}
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-canvas-100">
                  {release.coverImage ? (
                    <Image
                      src={release.coverImage}
                      alt={release.title}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music2 className="w-5 h-5 text-ink-tertiary" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-ink">{release.title}</p>
                    <span className="text-2xs text-ink-tertiary">· {release.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-2xs font-semibold px-2 py-0.5 rounded-full",
                      STATUS_STYLES[release.status] ?? "bg-canvas-100 text-ink-tertiary",
                    )}>
                      {release.status}
                    </span>
                    <span className="flex items-center gap-1 text-2xs text-ink-tertiary">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(release.releaseDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-ink">{release.tracklist.length}</p>
                  <p className="text-2xs text-ink-tertiary">tracks</p>
                </div>

                <ChevronRight className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* Top tracks */}
        <section>
          <h2 className="text-subheading mb-3">Top Tracks</h2>
          <div className="card divide-y divide-border">
            {CAAM1K_TOP_TRACKS.map((track, i) => (
              <div key={track.title} className="flex items-center gap-4 px-5 py-3.5">
                <span className="text-xs font-bold text-ink-tertiary w-4 text-right flex-shrink-0">{i + 1}</span>
                <p className="flex-1 text-sm font-medium text-ink">{track.title}</p>
                <span className="text-xs text-ink-tertiary">{track.streams} streams</span>
              </div>
            ))}
          </div>
        </section>

        {/* Campaigns */}
        <section>
          <h2 className="text-subheading mb-3">Campaigns</h2>
          <div className="space-y-3">
            {CAAM1K_CAMPAIGNS.map((c) => (
              <div key={c.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{c.name}</p>
                    <p className="text-2xs text-ink-tertiary mt-0.5">
                      {c.completedTasks} / {c.taskCount} tasks
                    </p>
                  </div>
                  <span className={cn(
                    "text-2xs font-semibold px-2 py-0.5 rounded-full",
                    STATUS_STYLES[c.phase] ?? "bg-canvas-100 text-ink-tertiary",
                  )}>
                    {c.phase}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-canvas-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold transition-all"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                <p className="text-2xs text-ink-tertiary mt-1.5 text-right">{c.progress}%</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

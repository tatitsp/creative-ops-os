import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { MIRIAM_RELEASES, MIRIAM_CAMPAIGNS } from "@/lib/mock-artist2";
import { Disc3, CalendarDays, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Releases` : "Releases" };
}

export async function generateStaticParams() {
  return WORKSPACES.map((w) => ({ slug: w.slug }));
}

const STATUS_STYLES: Record<string, string> = {
  PLANNING: "bg-canvas-100 text-ink-tertiary",
  PRODUCTION: "bg-gold-50 text-gold",
  ACTIVE: "bg-emerald-50 text-emerald-600",
  COMPLETE: "bg-canvas-100 text-ink-tertiary",
};

export default async function ArtistReleasesPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  return (
    <>
      <TopBar title="Releases" subtitle={ws.artistName} />

      <div className="p-6 space-y-6 animate-in max-w-4xl">
        {/* Releases */}
        <section>
          <h2 className="text-subheading mb-3">Projects</h2>
          <div className="space-y-3">
            {MIRIAM_RELEASES.map((release) => (
              <div key={release.id} className="card p-5 flex items-center gap-5">
                {/* Color swatch */}
                <div
                  className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: release.coverColor }}
                >
                  <Disc3 className="w-6 h-6 text-white/60" />
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
                      {new Date(release.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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

        {/* Campaigns */}
        <section>
          <h2 className="text-subheading mb-3">Campaigns</h2>
          <div className="space-y-3">
            {MIRIAM_CAMPAIGNS.map((c) => (
              <div key={c.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{c.name}</p>
                    <p className="text-2xs text-ink-tertiary mt-0.5">{c.completedTasks} / {c.taskCount} tasks</p>
                  </div>
                  <span className={cn(
                    "text-2xs font-semibold px-2 py-0.5 rounded-full",
                    STATUS_STYLES[c.status] ?? "bg-canvas-100 text-ink-tertiary",
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
                <p className="text-2xs text-ink-tertiary mt-1.5 text-right">{c.progress}% complete</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

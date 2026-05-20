import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { CAAM1K_PHOTO, CAAM1K_COVER, CAAM1K_TOP_TRACKS, CAAM1K_ANALYTICS, CAAM1K_RELEASES } from "@/lib/mock-artist2";
import { MapPin, Headphones, TrendingUp, Disc3 } from "lucide-react";
import { formatNumber } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Artist Portal` : "Artist Portal" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

export default async function ArtistPortalPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  const latestRelease = CAAM1K_RELEASES[0];

  return (
    <>
      <TopBar title="Artist Portal" subtitle={`${ws.artistName} · Overview`} />

      <div className="p-6 space-y-6 animate-in max-w-5xl">
        {/* Hero */}
        <div className="card p-6 flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-canvas-100">
            <Image
              src={CAAM1K_PHOTO}
              alt={ws.artistName}
              width={96}
              height={96}
              className="w-full h-full object-cover object-top"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-ink tracking-tight">{ws.artistName}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-ink-tertiary" />
              <p className="text-sm text-ink-secondary">{ws.location}</p>
            </div>
            <p className="text-sm text-ink-tertiary mt-1">{ws.genre}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-3xl font-black text-gold">{ws.monthlyListeners}</p>
            <div className="flex items-center gap-1 justify-end mt-1">
              <Headphones className="w-3.5 h-3.5 text-ink-tertiary" />
              <p className="text-xs text-ink-tertiary">monthly listeners</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Latest release */}
          <div className="card p-5">
            <h2 className="text-subheading mb-4">Latest Release</h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-canvas-100">
                <Image
                  src={CAAM1K_COVER}
                  alt={latestRelease.title}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{latestRelease.title}</p>
                <p className="text-xs text-ink-tertiary">{latestRelease.type} · {new Date(latestRelease.releaseDate).getFullYear()}</p>
                <p className="text-xs text-ink-tertiary mt-1">{latestRelease.tracklist.length} tracks</p>
                <span className="inline-block mt-2 text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                  {latestRelease.status}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-label mb-2">Tracklist</p>
              <ol className="space-y-1">
                {latestRelease.tracklist.map((track, i) => (
                  <li key={track} className="flex items-center gap-2 text-xs">
                    <span className="text-ink-tertiary w-4 text-right flex-shrink-0">{i + 1}</span>
                    <span className="text-ink-secondary">{track}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Top tracks */}
          <div className="card p-5">
            <h2 className="text-subheading mb-4">Top Tracks</h2>
            <div className="space-y-4 mb-6">
              {CAAM1K_TOP_TRACKS.map((track, i) => (
                <div key={track.title} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-ink-tertiary w-4 text-right flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{track.title}</p>
                    <div className="mt-1 h-1 bg-canvas-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full"
                        style={{ width: `${100 - i * 17}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-ink-tertiary flex-shrink-0">{track.streams}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <h2 className="text-subheading mb-3">Platform Reach</h2>
              <div className="grid grid-cols-2 gap-3">
                {CAAM1K_ANALYTICS.slice(0, 4).map((a) => (
                  <div key={a.platform} className="bg-canvas-50 rounded-xl p-3">
                    <p className="text-2xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1 capitalize">
                      {a.platform}
                    </p>
                    <p className="text-sm font-black text-ink">
                      {a.platform === "spotify"
                        ? ws.monthlyListeners
                        : formatNumber(a.followers)}
                    </p>
                    <p className="text-2xs text-emerald-500">+{a.followersGrowth}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="card p-5">
          <h2 className="text-subheading mb-3">Bio</h2>
          <p className="text-sm text-ink-secondary leading-relaxed max-w-2xl">
            Hailing out of Fort Worth, TX, Caam1k blends raw emotion with street wisdom and biblical truth.
            Gritty, reflective, and unapologetically real. His debut album{" "}
            <span className="text-ink font-medium">Eastside Evangelist</span> (2026) has earned over 1.4M combined
            streams across its top tracks, establishing him as a rising voice in Trap Gospel and Christian Hip-Hop.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div>
              <p className="text-xl font-black text-ink">55,787</p>
              <p className="text-2xs text-ink-tertiary">Spotify listeners</p>
            </div>
            <div>
              <p className="text-xl font-black text-ink">1.4M+</p>
              <p className="text-2xs text-ink-tertiary">combined streams</p>
            </div>
            <div>
              <p className="text-xl font-black text-ink">3</p>
              <p className="text-2xs text-ink-tertiary">active campaigns</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

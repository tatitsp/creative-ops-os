import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WORKSPACES } from "@/lib/workspaces";
import { DashboardHero, type DockCard } from "@/components/dashboard/DashboardHero";
import {
  CAAM1K_ANALYTICS,
  CAAM1K_CAMPAIGNS,
  CAAM1K_RELEASES,
  CAAM1K_PHOTO,
} from "@/lib/mock-artist2";
import { Disc3, FolderKanban, Film, BarChart2, Users, CheckSquare } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Dashboard` : "Dashboard" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

export default async function ArtistDashboardPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  const activeCampaigns = CAAM1K_CAMPAIGNS.filter((c) => c.status === "ACTIVE");
  const planningCampaigns = CAAM1K_CAMPAIGNS.filter((c) => c.status === "PLANNING");
  const activeRelease = CAAM1K_RELEASES.find((r) => r.status === "ACTIVE");
  const spotifyStats = CAAM1K_ANALYTICS.find((a) => a.platform === "spotify");

  const DOCK_CARDS: DockCard[] = [
    {
      href: `${ws.href.replace("/dashboard", "")}/releases`,
      label: "Drops",
      status: activeRelease
        ? `${CAAM1K_RELEASES.filter((r) => r.status === "ACTIVE").length} active · ${activeRelease.title}`
        : "No active releases",
      icon: <Disc3 className="w-5 h-5 text-gold" />,
    },
    {
      href: `${ws.href.replace("/dashboard", "")}/projects`,
      label: "Campaigns",
      status: `${activeCampaigns.length} active campaign${activeCampaigns.length !== 1 ? "s" : ""} · ${planningCampaigns.length} in planning`,
      icon: <FolderKanban className="w-5 h-5 text-sky-500" />,
    },
    {
      href: `${ws.href.replace("/dashboard", "")}/content`,
      label: "Content",
      status: "5 pieces in pipeline",
      icon: <Film className="w-5 h-5 text-emerald-500" />,
    },
    {
      href: `${ws.href.replace("/dashboard", "")}/analytics`,
      label: "Analytics",
      status: spotifyStats
        ? `${ws.monthlyListeners} monthly listeners · +${spotifyStats.followersGrowth}%`
        : "View platform stats",
      icon: <BarChart2 className="w-5 h-5 text-amber-400" />,
    },
    {
      href: `${ws.href.replace("/dashboard", "")}/team`,
      label: "Team",
      status: "Shared team · 6 members",
      icon: <Users className="w-5 h-5 text-rose-500" />,
    },
    {
      href: `${ws.href.replace("/dashboard", "")}/approvals`,
      label: "Approvals",
      status: "No pending items",
      icon: <CheckSquare className="w-5 h-5 text-gold" />,
    },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHero
        cards={DOCK_CARDS}
        artistName={ws.artistName}
        artistPhoto={CAAM1K_PHOTO}
        artistPortalHref={`/artists/${slug}/artist-portal`}
        imagePosition="50% 35%"
      />
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/navigation/TopBar";
import { WORKSPACES } from "@/lib/workspaces";
import { CAAM1K_TEAM } from "@/lib/mock-artist2";
import { Avatar } from "@/components/ui/Avatar";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  return { title: ws ? `${ws.artistName} — Team` : "Team" };
}

export async function generateStaticParams() {
  return WORKSPACES.filter((w) => w.slug !== "lil-tony").map((w) => ({ slug: w.slug }));
}

export default async function ArtistTeamPage({ params }: Props) {
  const { slug } = await params;
  const ws = WORKSPACES.find((w) => w.slug === slug);
  if (!ws) notFound();

  return (
    <>
      <TopBar title="Team" subtitle={ws.artistName} />

      <div className="p-6 animate-in max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-subheading">Team Members</h2>
          <span className="text-xs text-ink-tertiary">{CAAM1K_TEAM.length} members</span>
        </div>

        <div className="space-y-2">
          {CAAM1K_TEAM.map((member) => (
            <div key={member.id} className="card p-4 flex items-center gap-4">
              <Avatar
                user={{
                  name: member.name,
                  image: member.image,
                  status: member.status,
                }}
                size="md"
                showStatus
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">{member.name}</p>
                <p className="text-xs text-ink-tertiary">{member.role}</p>
              </div>
              <p className="text-xs text-ink-tertiary">{member.email}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

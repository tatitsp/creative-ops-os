import { notFound } from "next/navigation";
import { WorkspaceSidebar } from "@/components/navigation/WorkspaceSidebar";
import { SidebarAwareMain } from "@/components/navigation/SidebarAwareMain";
// import { CopilotPanel } from "@/components/copilot/CopilotPanel";
import { WORKSPACES } from "@/lib/workspaces";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function ArtistWorkspaceLayout({ children, params }: Props) {
  const { slug } = await params;
  const workspace = WORKSPACES.find((w) => w.slug === slug);

  if (!workspace) notFound();

  return (
    <div className="min-h-screen bg-canvas">
      <WorkspaceSidebar
        artistName={workspace.artistName}
        artistPhoto={workspace.photo}
        genre={workspace.genre}
        basePath={`/artists/${slug}`}
      />
      <SidebarAwareMain>{children}</SidebarAwareMain>
      {/* <CopilotPanel /> */}
    </div>
  );
}

// Director's Vision Studio — private workspace for the Creative Ops Director.
// Fetches moodboard images server-side from the "director-studio" GCS workspace,
// then hands off to the client component for all interactivity.

import type { Metadata } from "next";
import { TopBar } from "@/components/navigation/TopBar";
import { VisionStudio } from "@/components/director/VisionStudio";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Vision Studio · Director" };

export default async function DirectorStudioPage() {
  // Fetch only image assets from the director's private workspace.
  // Returns empty array if the workspace hasn't been created yet (pre-first-upload).
  const workspace = await prisma.workspace.findUnique({
    where: { slug: "director-studio" },
    select: {
      assets: {
        where: { isArchived: false, fileType: "image" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          url: true,
          thumbnailUrl: true,
        },
      },
    },
  });

  const moodboardImages = workspace?.assets ?? [];

  return (
    <div className="min-h-screen">
      <TopBar
        title="Director's Vision Studio"
        subtitle="Private workspace · Creative Ops Director"
      />
      <VisionStudio initialImages={moodboardImages} />
    </div>
  );
}

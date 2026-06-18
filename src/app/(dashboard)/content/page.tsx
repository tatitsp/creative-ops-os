import type { Metadata } from "next";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { ContentPageClient } from "@/components/content/ContentPageClient";
import { getDashboardWorkspace } from "@/lib/workspace-context";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Content" };
export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const workspace = await getDashboardWorkspace();

  let items: any[] = [];
  if (workspace) {
    items = await prisma.contentItem.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        caption: true,
        phase: true,
        type: true,
        platforms: true,
        scheduledAt: true,
        priority: true,
        isOrganic: true,
        campaign: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, image: true, role: true, status: true } },
      },
    });
  }

  const total = items.length;
  const subtitle = workspace
    ? `${workspace.name} · ${total} piece${total !== 1 ? "s" : ""} tracked`
    : "Content pipeline";

  return (
    <div className="min-h-screen">
      <TopBar
        title="Content"
        subtitle={subtitle}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">Organic content</Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              New content
            </Button>
          </div>
        }
      />
      <ContentPageClient
        workspaceSlug={workspace?.slug ?? ""}
        initialItems={items}
      />
    </div>
  );
}

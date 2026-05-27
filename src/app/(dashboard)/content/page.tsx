import type { Metadata } from "next";
import { TopBar } from "@/components/navigation/TopBar";
import { Button } from "@/components/ui/Button";
import { ContentPageClient } from "@/components/content/ContentPageClient";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Content" };

export default function ContentPage() {
  return (
    <div className="min-h-screen">
      <TopBar
        title="Content Pipeline"
        subtitle="Elijah rollout · 6 pieces tracked"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">Organic content</Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              New content
            </Button>
          </div>
        }
      />
      <ContentPageClient />
    </div>
  );
}

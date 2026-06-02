import type { Metadata } from "next";
import { ProjectsPageClient } from "./ProjectsPageClient";

export const metadata: Metadata = { title: "Campaigns" };

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}

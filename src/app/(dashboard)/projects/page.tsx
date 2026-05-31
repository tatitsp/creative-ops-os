import type { Metadata } from "next";
import { ProjectsPageClient } from "./ProjectsPageClient";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}

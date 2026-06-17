import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarAwareMain } from "@/components/navigation/SidebarAwareMain";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.email) redirect("/sign-in");
  if (!session.user.isAdmin && session.user.workspaceSlugs.length === 0) {
    redirect("/access-pending");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <SidebarAwareMain>{children}</SidebarAwareMain>
    </div>
  );
}

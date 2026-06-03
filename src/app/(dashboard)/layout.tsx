import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarAwareMain } from "@/components/navigation/SidebarAwareMain";
// import { CopilotPanel } from "@/components/copilot/CopilotPanel";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <SidebarAwareMain>{children}</SidebarAwareMain>
      {/* <CopilotPanel /> */}
    </div>
  );
}

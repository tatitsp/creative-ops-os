import { Sidebar } from "@/components/navigation/Sidebar";
// import { CopilotPanel } from "@/components/copilot/CopilotPanel";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <main className="pl-60 min-h-screen">
        {children}
      </main>
      {/* <CopilotPanel /> */}
    </div>
  );
}

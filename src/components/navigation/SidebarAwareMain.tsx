"use client";

import { useState, useEffect } from "react";
import { useSidebar } from "@/lib/sidebar-store";
import { cn } from "@/lib/utils";

export function SidebarAwareMain({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { isCollapsed } = useSidebar();

  useEffect(() => setMounted(true), []);

  return (
    <main
      className={cn(
        "min-h-screen transition-[padding] duration-300",
        mounted && isCollapsed ? "md:pl-16" : "md:pl-60",
      )}
    >
      {children}
    </main>
  );
}

"use client";

import { ChevronDown } from "lucide-react";
import { useDemoRole, DEMO_ROLES } from "@/lib/demo-role-store";

export function RoleSwitcher() {
  const { role, setRole } = useDemoRole();

  return (
    <div className="px-3 py-2.5 border-t border-[#1A1A1A]">
      <p className="text-[10px] font-bold text-[#555555] uppercase tracking-widest mb-1.5 px-1">
        Preview As
      </p>
      <div className="relative">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as typeof role)}
          className="w-full appearance-none bg-[#111111] border border-[#2A2A2A] rounded-lg pl-3 pr-7 py-2 text-xs font-medium text-white outline-none focus:border-[#444444] cursor-pointer transition-colors hover:border-[#333333]"
        >
          {DEMO_ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#555555] pointer-events-none" />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import type { AuthenticatedCmsAdmin } from "@/lib/auth";

interface DashboardShellProps {
  admin: AuthenticatedCmsAdmin;
  children: React.ReactNode;
}

export function DashboardShell({ admin, children }: DashboardShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950">
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={`lg:block ${isMobileSidebarOpen ? "block" : "hidden"}`}>
        <Sidebar
          admin={admin}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      <main
        className={`min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-[280px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

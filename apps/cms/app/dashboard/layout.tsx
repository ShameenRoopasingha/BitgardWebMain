/**
 * =============================================================================
 * BITGARD CMS - DASHBOARD LAYOUT
 * =============================================================================
 * 
 * The layout wrapper for all dashboard pages.
 * Includes sidebar navigation and header.
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface DashboardLayoutProps {
    children: React.ReactNode;
}

// -----------------------------------------------------------------------------
// Dashboard Layout Component
// -----------------------------------------------------------------------------

/**
 * DashboardLayout - Main layout wrapper for dashboard pages
 * 
 * Layout structure:
 * - Fixed sidebar on the left
 * - Main content area on the right
 * - Responsive behavior for mobile
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
    // State for sidebar collapse (mobile)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <div
                className={`
          lg:block
          ${isMobileSidebarOpen ? "block" : "hidden"}
        `}
            >
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
            </div>

            {/* Main Content Area */}
            <main
                className={`
          min-h-screen
          transition-all duration-300
          ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-[280px]"}
        `}
            >
                {children}
            </main>
        </div>
    );
}

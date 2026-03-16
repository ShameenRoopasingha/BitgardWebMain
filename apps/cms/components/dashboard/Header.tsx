/**
 * =============================================================================
 * BITGARD CMS - HEADER COMPONENT
 * =============================================================================
 * 
 * The header bar for the CMS dashboard pages.
 * 
 * Features:
 * - Page title and breadcrumbs
 * - Search functionality
 * - Notifications
 * - Quick actions
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

"use client";

import { FiSearch, FiBell, FiPlus, FiMenu } from "react-icons/fi";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface DashboardHeaderProps {
    /** Current page title */
    title: string;
    /** Optional subtitle or description */
    subtitle?: string;
    /** Quick action button config */
    action?: {
        label: string;
        onClick: () => void;
    };
    /** Mobile menu toggle callback */
    onMenuToggle?: () => void;
}

// -----------------------------------------------------------------------------
// Dashboard Header Component
// -----------------------------------------------------------------------------

/**
 * DashboardHeader - Top header bar for dashboard pages
 */
export function DashboardHeader({
    title,
    subtitle,
    action,
    onMenuToggle,
}: DashboardHeaderProps) {
    return (
        <header className="h-16 bg-background/50 border-b border-border flex items-center justify-between px-6">
            {/* ------------------------------------------------------------- */}
            {/* Left Section - Title & Mobile Menu */}
            {/* ------------------------------------------------------------- */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                {onMenuToggle && (
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                        aria-label="Toggle menu"
                    >
                        <FiMenu className="w-5 h-5" />
                    </button>
                )}

                {/* Page Title */}
                <div>
                    <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    )}
                </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Right Section - Actions */}
            {/* ------------------------------------------------------------- */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border border-input">
                    <FiSearch className="w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-48"
                    />
                    <kbd className="hidden lg:inline-flex text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        ⌘K
                    </kbd>
                </div>

                {/* Notifications */}
                <button
                    className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    aria-label="Notifications"
                >
                    <FiBell className="w-5 h-5" />
                    {/* Notification badge */}
                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                </button>

                {/* Quick Action Button */}
                {action && (
                    <button
                        onClick={action.onClick}
                        className="btn btn-primary"
                    >
                        <FiPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">{action.label}</span>
                    </button>
                )}
            </div>
        </header>
    );
}

export default DashboardHeader;

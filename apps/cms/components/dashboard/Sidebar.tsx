/**
 * =============================================================================
 * BITGARD CMS - SIDEBAR COMPONENT
 * =============================================================================
 * 
 * The main navigation sidebar for the CMS dashboard.
 * 
 * Features:
 * - Logo and branding
 * - Navigation links with icons
 * - Active state highlighting
 * - Collapsible on mobile
 * - User profile section
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    FiHome,
    FiBox,
    FiBriefcase,
    FiUsers,
    FiMessageSquare,
    FiFileText,
    FiMail,
    FiSettings,
    FiLogOut,
    FiChevronLeft,
} from "react-icons/fi";

// -----------------------------------------------------------------------------
// Navigation Configuration
// -----------------------------------------------------------------------------

/**
 * Main navigation items for the sidebar
 */
const NAV_ITEMS = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: FiHome,
    },
    {
        label: "Products",
        href: "/dashboard/products",
        icon: FiBox,
    },
    {
        label: "Services",
        href: "/dashboard/services",
        icon: FiBriefcase,
    },
    {
        label: "Team",
        href: "/dashboard/team",
        icon: FiUsers,
    },
    {
        label: "Testimonials",
        href: "/dashboard/testimonials",
        icon: FiMessageSquare,
    },
    {
        label: "Blog",
        href: "/dashboard/blog",
        icon: FiFileText,
    },
    {
        label: "Contacts",
        href: "/dashboard/contacts",
        icon: FiMail,
    },
    {
        label: "Settings",
        href: "/dashboard/settings",
        icon: FiSettings,
    },
] as const;

// -----------------------------------------------------------------------------
// Sidebar Component
// -----------------------------------------------------------------------------

interface SidebarProps {
    /** Whether the sidebar is collapsed (mobile) */
    isCollapsed?: boolean;
    /** Callback when collapse toggle is clicked */
    onToggleCollapse?: () => void;
}

/**
 * Sidebar - Main navigation sidebar for the CMS
 */
export function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
    const pathname = usePathname();

    /**
     * Check if a nav item is active based on current path
     */
    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    };

    return (
        <aside
            className={`
        fixed left-0 top-0 h-screen
        bg-card border-r border-border
        flex flex-col
        transition-all duration-300
        ${isCollapsed ? "w-20" : "w-[280px]"}
        z-50
      `}
        >
            {/* ------------------------------------------------------------- */}
            {/* Logo Section */}
            {/* ------------------------------------------------------------- */}
            <div className="flex items-center justify-between p-6 border-b border-border">
                <Link href="/dashboard" className="flex items-center gap-3">
                    {/* Logo */}
                    <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                            src="/logo.png"
                            alt="Bitgard Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Brand Name (hidden when collapsed) */}
                    {!isCollapsed && (
                        <div>
                            <span className="text-lg font-bold text-foreground">Bitgard</span>
                            <span className="block text-xs text-muted-foreground">CMS</span>
                        </div>
                    )}
                </Link>

                {/* Collapse Toggle */}
                {onToggleCollapse && (
                    <button
                        onClick={onToggleCollapse}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <FiChevronLeft
                            className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
                        />
                    </button>
                )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Navigation Links */}
            {/* ------------------------------------------------------------- */}
            <nav className="flex-1 overflow-y-auto py-6 px-3">
                <ul className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${active
                                            ? "text-primary-400 bg-primary-500/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        }
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    {/* Active indicator */}
                                    {active && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r" />
                                    )}

                                    <Icon className="w-5 h-5 flex-shrink-0" />

                                    {!isCollapsed && (
                                        <span className="font-medium">{item.label}</span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* ------------------------------------------------------------- */}
            {/* User Section */}
            {/* ------------------------------------------------------------- */}
            <div className="p-4 border-t border-border">
                <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-400 font-semibold">A</span>
                    </div>

                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">Admin</p>
                            <p className="text-xs text-muted-foreground truncate">admin@bitgard.com</p>
                        </div>
                    )}

                    {/* Logout Button */}
                    <button
                        className={`
              p-2 text-muted-foreground hover:text-destructive hover:bg-muted/50 rounded-lg
              transition-colors
              ${isCollapsed ? "" : "flex-shrink-0"}
            `}
                        title="Logout"
                        aria-label="Logout"
                    >
                        <FiLogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;

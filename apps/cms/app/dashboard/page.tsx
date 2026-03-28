/**
 * =============================================================================
 * BITGARD CMS - DASHBOARD HOME PAGE
 * =============================================================================
 *
 * The main dashboard home page showing real data from the database:
 * - Overview statistics (counts from all tables)
 * - Recent activity (latest records across all entities)
 * - Quick actions (links to management pages)
 *
 * @author Bitgard Development Team
 * @version 2.0.0
 */

import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/Header";
import { getDashboardStats, getRecentActivity } from "@/lib/actions";
import {
    FiBox,
    FiBriefcase,
    FiUsers,
    FiMail,
    FiTrendingUp,
    FiEye,
    FiMessageSquare,
    FiFileText,
} from "react-icons/fi";

// -----------------------------------------------------------------------------
// Helper: relative time
// -----------------------------------------------------------------------------

function timeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
}

// -----------------------------------------------------------------------------
// Activity icon mapping
// -----------------------------------------------------------------------------

const ACTIVITY_ICONS: Record<string, typeof FiBox> = {
    contact: FiMail,
    product: FiBox,
    team: FiUsers,
    blog: FiFileText,
};

const ACTIVITY_COLORS: Record<string, string> = {
    contact: "bg-orange-500/20 text-orange-400",
    product: "bg-blue-500/20 text-blue-400",
    team: "bg-green-500/20 text-green-400",
    blog: "bg-purple-500/20 text-purple-400",
};

// -----------------------------------------------------------------------------
// Dashboard Home Component
// -----------------------------------------------------------------------------

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const [stats, recentActivity] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
    ]);

    const STATS = [
        {
            label: "Products",
            value: stats.productCount.toString(),
            icon: FiBox,
            color: "bg-blue-500/20 text-blue-400",
            href: "/dashboard/products",
        },
        {
            label: "Services",
            value: stats.serviceCount.toString(),
            icon: FiBriefcase,
            color: "bg-purple-500/20 text-purple-400",
            href: "/dashboard/services",
        },
        {
            label: "Team Members",
            value: stats.teamCount.toString(),
            icon: FiUsers,
            color: "bg-green-500/20 text-green-400",
            href: "/dashboard/team",
        },
        {
            label: "Contacts",
            value: stats.contactCount.toString(),
            detail: stats.unreadContactCount > 0 ? `${stats.unreadContactCount} unread` : "All read",
            icon: FiMail,
            color: "bg-orange-500/20 text-orange-400",
            href: "/dashboard/contacts",
        },
        {
            label: "Testimonials",
            value: stats.testimonialCount.toString(),
            icon: FiMessageSquare,
            color: "bg-pink-500/20 text-pink-400",
            href: "/dashboard/testimonials",
        },
        {
            label: "Blog Posts",
            value: stats.blogPostCount.toString(),
            detail: `${stats.publishedBlogCount} published`,
            icon: FiFileText,
            color: "bg-cyan-500/20 text-cyan-400",
            href: "/dashboard/blog",
        },
    ];

    // Serialize activity dates for rendering
    const activities = recentActivity.map((a) => ({
        ...a,
        timeLabel: timeAgo(new Date(a.time)),
    }));

    return (
        <div className="min-h-screen">
            {/* Header */}
            <DashboardHeader
                title="Dashboard"
                subtitle="Welcome back! Here's what's happening"
            />

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {STATS.map((stat) => (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="dashboard-card flex items-start justify-between hover:border-primary-500/30 transition-colors"
                        >
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                                {stat.detail && (
                                    <p className="text-sm text-muted-foreground mt-1">{stat.detail}</p>
                                )}
                            </div>
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 dashboard-card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-foreground">
                                Recent Activity
                            </h2>
                        </div>

                        {activities.length === 0 ? (
                            <div className="text-center py-8">
                                <FiTrendingUp className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                                <p className="text-muted-foreground">No activity yet. Start adding content!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activities.map((activity) => {
                                    const IconComp = ACTIVITY_ICONS[activity.type] || FiTrendingUp;
                                    const colorClass = ACTIVITY_COLORS[activity.type] || "bg-primary-500/20 text-primary-400";
                                    return (
                                        <div
                                            key={activity.id}
                                            className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                                                <IconComp className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground">
                                                    {activity.action}
                                                </p>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {activity.details}
                                                </p>
                                            </div>
                                            <span className="text-xs text-muted-foreground flex-shrink-0">
                                                {activity.timeLabel}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="dashboard-card">
                        <h2 className="text-lg font-semibold text-foreground mb-6">
                            Quick Actions
                        </h2>

                        <div className="space-y-3">
                            <Link
                                href="/dashboard/products"
                                className="w-full flex items-center gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors text-left"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <FiBox className="w-5 h-5 text-blue-400" />
                                </div>
                                <span className="text-sm font-medium text-foreground">
                                    Manage Products
                                </span>
                            </Link>

                            <Link
                                href="/dashboard/services"
                                className="w-full flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors text-left"
                            >
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                    <FiBriefcase className="w-5 h-5 text-purple-400" />
                                </div>
                                <span className="text-sm font-medium text-white">
                                    Manage Services
                                </span>
                            </Link>

                            <Link
                                href="/dashboard/team"
                                className="w-full flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors text-left"
                            >
                                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <FiUsers className="w-5 h-5 text-green-400" />
                                </div>
                                <span className="text-sm font-medium text-white">
                                    Manage Team
                                </span>
                            </Link>

                            <Link
                                href="/dashboard/contacts"
                                className="w-full flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors text-left"
                            >
                                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                    <FiMail className="w-5 h-5 text-orange-400" />
                                </div>
                                <span className="text-sm font-medium text-white">
                                    View Contacts
                                </span>
                            </Link>

                            <a
                                href="http://localhost:3000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors text-left"
                            >
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                    <FiEye className="w-5 h-5 text-cyan-400" />
                                </div>
                                <span className="text-sm font-medium text-white">
                                    Preview Website
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

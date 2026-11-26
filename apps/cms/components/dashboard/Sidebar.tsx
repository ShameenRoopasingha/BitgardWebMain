"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
  FiKey,
} from "react-icons/fi";
import type { AuthenticatedCmsAdmin } from "@/lib/auth";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: FiHome, superAdminOnly: false },
  { label: "Vigil Licenses", href: "/dashboard/licenses", icon: FiKey, superAdminOnly: true },
  { label: "Products", href: "/dashboard/products", icon: FiBox, superAdminOnly: false },
  { label: "Services", href: "/dashboard/services", icon: FiBriefcase, superAdminOnly: false },
  { label: "Team", href: "/dashboard/team", icon: FiUsers, superAdminOnly: false },
  { label: "Testimonials", href: "/dashboard/testimonials", icon: FiMessageSquare, superAdminOnly: false },
  { label: "Blog", href: "/dashboard/blog", icon: FiFileText, superAdminOnly: false },
  { label: "Contacts", href: "/dashboard/contacts", icon: FiMail, superAdminOnly: false },
  { label: "Settings", href: "/dashboard/settings", icon: FiSettings, superAdminOnly: false },
] as const;

interface SidebarProps {
  admin: AuthenticatedCmsAdmin;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  admin,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.superAdminOnly || admin.role === "SUPER_ADMIN"
  );

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Signed out");
      router.push("/auth/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    } finally {
      setLoggingOut(false);
    }
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
      <div className="flex items-center justify-between p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Bitgard Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {!isCollapsed && (
            <div>
              <span className="text-lg font-bold text-foreground">Bitgard</span>
              <span className="block text-xs text-muted-foreground">CMS</span>
            </div>
          )}
        </Link>

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

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${
                      active
                        ? "text-primary-400 bg-primary-500/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r" />
                  )}
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-primary-400 font-semibold">
              {(admin.name || admin.email).charAt(0).toUpperCase()}
            </span>
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{admin.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {admin.email} • {admin.role}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            disabled={loggingOut}
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

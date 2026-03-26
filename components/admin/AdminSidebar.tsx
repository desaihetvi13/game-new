"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Gamepad2,
  Palette,
  DollarSign,
  Users,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/games", label: "Games", icon: Gamepad2 },
  { href: "/admin/branding", label: "Branding", icon: Palette },
  { href: "/admin/ads", label: "Ads", icon: DollarSign },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 bg-surface-800 border-r border-white/5 flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Title */}
      <div className="px-5 py-4 border-b border-white/5">
        <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">
          Admin Panel
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Back to Site */}
      <div className="p-3 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-white/30 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}

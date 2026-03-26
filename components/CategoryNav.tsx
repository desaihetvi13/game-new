"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, CATEGORIES } from "@/lib/utils";
import { Gamepad2 } from "lucide-react";

export default function CategoryNav() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <div className="sticky top-16 z-40 bg-surface-900/95 backdrop-blur-md border-b border-white/5">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
              isActive("/")
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            <Gamepad2 className="w-4 h-4" />
            All Games
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/category/${encodeURIComponent(cat.toLowerCase())}`}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                isActive(`/category/${cat.toLowerCase()}`)
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

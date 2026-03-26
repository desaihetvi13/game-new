"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Gamepad2, Menu, X, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-surface-900/95 backdrop-blur-md border-b border-white/5">
      <div className="w-full px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-lg shadow-primary/30">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight hidden sm:block">
            Game<span className="text-primary-400">Portal</span>
          </span>
        </Link>

        {/* Search Bar (desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative">
          <input
            type="text"
            placeholder="Search games..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface-800 border border-white/10 rounded-full px-5 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-primary transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/login"
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary-300 hover:text-white border border-primary/30 hover:border-primary px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:block">Sign In</span>
          </Link>

          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200"
          >
            Admin
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <form onSubmit={handleSearch} className="md:hidden px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search games..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full bg-surface-800 border border-white/10 rounded-full px-5 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-primary transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </header>
  );
}

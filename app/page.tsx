import { getFeaturedGames, getPopularGames } from "@/lib/games";
import GameCard from "@/components/GameCard";
import { Zap, Trophy, Gamepad2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GamePortal – Play Free HTML5 Games Online",
};

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams?: {
    search?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const searchQuery = searchParams?.search?.trim() || "";
  const featuredGames = await getFeaturedGames(6);
  const popularGames = await getPopularGames(24, searchQuery);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8 space-y-12 mb-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-900 via-surface-800 to-surface-900 p-10 md:p-16 mb-4 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-4 right-4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-4 left-4 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 mb-4">
            <Zap className="w-3.5 h-3.5 text-primary-300" />
            <span className="text-primary-300 text-xs font-semibold tracking-wide uppercase">
              100% Free • No Downloads
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Play <span className="gradient-text">Awesome Games</span>
            <br />Instantly in Your Browser
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-6">
            Discover hundreds of HTML5 games — action, puzzle, racing and more.
            Jump in and start playing right now.
          </p>
          <Link
            href="#popular"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105"
          >
            <Gamepad2 className="w-5 h-5" />
            Browse Games
          </Link>
        </div>
      </section>

      {/* Featured Games */}
      {featuredGames.length > 0 && !searchQuery && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="text-white font-bold text-xl">Featured Games</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Popular/Search Results */}
      <section id="popular">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-5 h-5 text-primary-400" />
          <h2 className="text-white font-bold text-xl">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Games"}
          </h2>
        </div>
        {popularGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Gamepad2 className="w-16 h-16 text-white/10 mb-4" />
            <h3 className="text-white/40 text-lg font-medium mb-2">
              {searchQuery ? "No matching games found" : "No games yet"}
            </h3>
            <p className="text-white/30 text-sm mb-6">
              {searchQuery
                ? "Try another keyword (title, category, developer)."
                : "Head to the admin panel to upload your first HTML5 game."}
            </p>
            {searchQuery ? (
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary-300 border border-primary/30 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
              >
                Clear Search
              </Link>
            ) : (
              <Link
                href="/admin/games"
                className="inline-flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary-300 border border-primary/30 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
              >
                Upload a Game
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {popularGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

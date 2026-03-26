import { listGames } from "@/lib/games";
import GameCard from "@/components/GameCard";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/utils";
import type { Metadata } from "next";
import { Gamepad2 } from "lucide-react";
import Link from "next/link";

interface Props {
  params: { name: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = decodeURIComponent(params.name);
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  return {
    title: `${displayName} Games`,
    description: `Play free ${displayName} games online — no download required.`,
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ name: cat.toLowerCase() }));
}

export default async function CategoryPage({ params }: Props) {
  const name = decodeURIComponent(params.name);
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);

  // Find matching category (case-insensitive)
  const matchedCategory = CATEGORIES.find(
    (c) => c.toLowerCase() === name.toLowerCase()
  );
  if (!matchedCategory) notFound();

  const games = await listGames(matchedCategory);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{displayName} Games</h1>
        <p className="text-white/50">
          {games.length} {games.length === 1 ? "game" : "games"} available
        </p>
      </div>

      {games.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Gamepad2 className="w-16 h-16 text-white/10 mb-4" />
          <h3 className="text-white/40 text-lg font-medium mb-2">
            No {displayName} games yet
          </h3>
          <p className="text-white/30 text-sm mb-6">
            Check back soon or explore another category.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary-300 border border-primary/30 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
          >
            Back to All Games
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}

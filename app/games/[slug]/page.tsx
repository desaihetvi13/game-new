import { getGame, listGames } from "@/lib/games";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import GameCard from "@/components/GameCard";
import GamePlayer from "@/components/GamePlayer";
import GameActions from "@/components/GameActions";
import { Star, Gamepad2, Clock } from "lucide-react";

interface Props {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = await getGame(params.slug);
  if (!game) return { title: "Game not found" };
  return {
    title: game.title,
    description: game.description || `Play ${game.title} online for free — no download required.`,
    openGraph: {
      title: game.title,
      description: game.description,
      images: [game.thumbnail],
    },
  };
}

export default async function GamePage({ params }: Props) {
  const game = await getGame(params.slug);
  if (!game) notFound();

  const related = (await listGames(game.category))
    .filter((g) => g.slug !== game.slug)
    .slice(0, 6);

  const gameUrl = game.game_url.startsWith("http")
    ? game.game_url
    : `${game.game_url}`;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
        {/* Left: Game Player + Info */}
        <div className="space-y-6">
          {/* Game Player */}
          <GamePlayer slug={game.slug} src={gameUrl} title={game.title} />

          {/* Game Info */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-white">{game.title}</h1>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="bg-primary/20 text-primary-300 text-xs px-2.5 py-0.5 rounded-full border border-primary/20 font-medium">
                    {game.category}
                  </span>
                  {game.developer && (
                    <span className="text-white/40 text-sm">by {game.developer}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-3 py-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-300 font-semibold text-sm">
                    {game.rating.toFixed(1)} ({game.rating_count})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                  <Gamepad2 className="w-4 h-4 text-white/40" />
                  <span className="text-white/60 text-sm">{game.plays.toLocaleString()} plays</span>
                </div>
              </div>
            </div>

            {game.description && (
              <p className="text-white/60 text-sm leading-relaxed">{game.description}</p>
            )}

            <GameActions
              slug={game.slug}
              title={game.title}
              initialAverageRating={game.rating}
              initialRatingCount={game.rating_count}
            />
            <div className="flex items-center gap-2 text-white/30 text-sm">
                <Clock className="w-3.5 h-3.5" />
                Added {new Date(game.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Right: Related Games */}
        {related.length > 0 && (
          <aside className="space-y-4">
            <h2 className="text-white font-bold text-lg">More {game.category} Games</h2>
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-3">
              {related.map((g) => (
                <GameCard key={g.slug} game={g} />
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

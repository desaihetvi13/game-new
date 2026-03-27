"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Play, Star } from "lucide-react";
import { formatPlays } from "@/lib/utils";
import type { Game } from "@/lib/games";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const initialThumbnail = useMemo(
    () => (game.thumbnail?.trim() ? game.thumbnail : "/placeholder-game.svg"),
    [game.thumbnail],
  );
  const [thumbnailSrc, setThumbnailSrc] = useState(initialThumbnail);

  return (
    <Link href={`/games/${game.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-card border border-white/5 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/40">
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-800">
          <Image
            src={thumbnailSrc}
            alt={game.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => {
              if (thumbnailSrc !== "/placeholder-game.svg") {
                setThumbnailSrc("/placeholder-game.svg");
              }
            }}
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </div>
              <span className="text-white font-semibold text-sm tracking-wide">PLAY NOW</span>
            </div>
          </div>
          {/* Featured badge */}
          {game.featured === 1 && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
              FEATURED
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
            {game.category}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm leading-tight truncate group-hover:text-primary-300 transition-colors">
            {game.title}
          </h3>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-white/60">{game.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-white/40">{formatPlays(game.plays)} plays</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

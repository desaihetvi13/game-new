import { getPrisma } from "@/lib/prisma";
import { createGameSchema, updateGameSchema } from "@/lib/validators";

export interface Game {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  game_url: string;
  developer: string;
  rating: number;
  plays: number;
  featured: number;
  active: number;
  created_at: string;
  updated_at: string;
}

export type GameInput = Omit<Game, "id" | "created_at" | "updated_at">;

function toGame(entity: {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  gameUrl: string;
  developer: string;
  rating: number;
  plays: number;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Game {
  return {
    id: entity.id,
    slug: entity.slug,
    title: entity.title,
    description: entity.description,
    category: entity.category,
    thumbnail: entity.thumbnail,
    game_url: entity.gameUrl,
    developer: entity.developer,
    rating: entity.rating,
    plays: entity.plays,
    featured: entity.featured ? 1 : 0,
    active: entity.active ? 1 : 0,
    created_at: entity.createdAt.toISOString(),
    updated_at: entity.updatedAt.toISOString(),
  };
}

function isConnectionError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("can't reach database server") ||
    message.includes("database server") ||
    message.includes("connection") ||
    message.includes("p1001") ||
    message.includes("p1000") ||
    message.includes("p1012") ||
    message.includes("environment variable not found")
  );
}

export async function listGames(category?: string): Promise<Game[]> {
  try {
    const prisma = getPrisma();
    const games = await prisma.game.findMany({
      where: {
        active: true,
        ...(category && category !== "all" ? { category } : {}),
      },
      orderBy: [{ featured: "desc" }, { plays: "desc" }],
    });
    return games.map(toGame);
  } catch (error) {
    if (isConnectionError(error)) return [];
    throw error;
  }
}

export async function getFeaturedGames(limit = 6): Promise<Game[]> {
  try {
    const prisma = getPrisma();
    const games = await prisma.game.findMany({
      where: { active: true, featured: true },
      orderBy: { plays: "desc" },
      take: limit,
    });
    return games.map(toGame);
  } catch (error) {
    if (isConnectionError(error)) return [];
    throw error;
  }
}

export async function getPopularGames(limit = 12): Promise<Game[]> {
  try {
    const prisma = getPrisma();
    const games = await prisma.game.findMany({
      where: { active: true },
      orderBy: { plays: "desc" },
      take: limit,
    });
    return games.map(toGame);
  } catch (error) {
    if (isConnectionError(error)) return [];
    throw error;
  }
}

export async function getGame(slug: string): Promise<Game | undefined> {
  try {
    const prisma = getPrisma();
    const game = await prisma.game.findFirst({ where: { slug, active: true } });
    return game ? toGame(game) : undefined;
  } catch (error) {
    if (isConnectionError(error)) return undefined;
    throw error;
  }
}

export async function getGameAdmin(slug: string): Promise<Game | undefined> {
  try {
    const prisma = getPrisma();
    const game = await prisma.game.findUnique({ where: { slug } });
    return game ? toGame(game) : undefined;
  } catch (error) {
    if (isConnectionError(error)) return undefined;
    throw error;
  }
}

export async function listAllGames(): Promise<Game[]> {
  try {
    const prisma = getPrisma();
    const games = await prisma.game.findMany({
      orderBy: { createdAt: "desc" },
    });
    return games.map(toGame);
  } catch (error) {
    if (isConnectionError(error)) return [];
    throw error;
  }
}

export async function createGame(data: Omit<GameInput, "plays" | "active">): Promise<Game> {
  const parsed = createGameSchema.parse(data);
  const prisma = getPrisma();
  const created = await prisma.game.create({
    data: {
      slug: parsed.slug,
      title: parsed.title,
      description: parsed.description,
      category: parsed.category,
      thumbnail: parsed.thumbnail,
      gameUrl: parsed.game_url,
      developer: parsed.developer,
      rating: parsed.rating,
      featured: Boolean(parsed.featured),
      plays: 0,
      active: true,
    },
  });
  return toGame(created);
}

export async function updateGame(slug: string, data: Partial<GameInput>): Promise<void> {
  const parsed = updateGameSchema.parse(data);
  const prisma = getPrisma();
  await prisma.game.update({
    where: { slug },
    data: {
      ...(parsed.title !== undefined ? { title: parsed.title } : {}),
      ...(parsed.description !== undefined ? { description: parsed.description } : {}),
      ...(parsed.category !== undefined ? { category: parsed.category } : {}),
      ...(parsed.thumbnail !== undefined ? { thumbnail: parsed.thumbnail } : {}),
      ...(parsed.game_url !== undefined ? { gameUrl: parsed.game_url } : {}),
      ...(parsed.developer !== undefined ? { developer: parsed.developer } : {}),
      ...(parsed.rating !== undefined ? { rating: parsed.rating } : {}),
      ...(parsed.featured !== undefined ? { featured: Boolean(parsed.featured) } : {}),
      ...(parsed.slug !== undefined ? { slug: parsed.slug } : {}),
    },
  });
}

export async function deleteGame(slug: string): Promise<void> {
  const prisma = getPrisma();
  await prisma.game.update({
    where: { slug },
    data: { active: false },
  });
}

export async function hardDeleteGame(slug: string): Promise<void> {
  const prisma = getPrisma();
  await prisma.game.delete({ where: { slug } });
}

export async function incrementPlays(slug: string): Promise<void> {
  const prisma = getPrisma();
  await prisma.game.update({
    where: { slug },
    data: { plays: { increment: 1 } },
  });
}

export async function getCategories(): Promise<string[]> {
  try {
    const prisma = getPrisma();
    const rows = await prisma.game.findMany({
      where: { active: true },
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    });
    return rows.map((r: { category: string }) => r.category);
  } catch (error) {
    if (isConnectionError(error)) return [];
    throw error;
  }
}

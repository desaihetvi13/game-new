import { z } from "zod";

const safeText = z.string().trim().max(500).optional().default("");
const safeUrl = z.string().trim().url().or(z.string().trim().startsWith("/"));
const safeThumbnail = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : "/placeholder-game.svg"));

export const createGameSchema = z.object({
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(2).max(120),
  description: safeText,
  category: z.string().trim().min(2).max(40),
  thumbnail: safeThumbnail,
  game_url: safeUrl,
  developer: z.string().trim().max(100).optional().default(""),
  rating: z.number().min(0).max(5),
  featured: z.coerce.number().int().min(0).max(1).optional().default(0),
});

export const updateGameSchema = createGameSchema.partial();

export const brandingSchema = z.object({
  logoUrl: z.string().trim().url().or(z.string().trim().startsWith("/")),
  siteName: z.string().trim().min(1).max(60),
  primaryColor: z.string().trim().regex(/^#([0-9A-Fa-f]{3}){1,2}$/),
  tagline: z.string().trim().max(140),
});

export const adsSchema = z.object({
  enabled: z.boolean(),
  publisherId: z.string().trim().max(64),
  leaderboardSlotId: z.string().trim().max(64),
  sidebarSlotId: z.string().trim().max(64),
  interstitialSlotId: z.string().trim().max(64),
});

export const gameBugReportSchema = z.object({
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  message: z.string().trim().min(8).max(1200),
  pageUrl: z.string().trim().url().optional().or(z.literal("")),
});

export const gameRatingSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
});

export const gameProgressSchema = z.object({
  elapsedSec: z.coerce.number().int().min(0).max(864000),
  progressPct: z.coerce.number().int().min(0).max(100).optional(),
  state: z.unknown().optional(),
});

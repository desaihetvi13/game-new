import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CATEGORIES = [
  "Action",
  "Puzzle",
  "Racing",
  "Sports",
  "Strategy",
  "Adventure",
  "Arcade",
  ".io",
  "Multiplayer",
  "Shooting",
  "RPG",
  "Casual",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatPlays(plays: number): string {
  if (plays >= 1_000_000) return `${(plays / 1_000_000).toFixed(1)}M`;
  if (plays >= 1_000) return `${(plays / 1_000).toFixed(1)}K`;
  return plays.toString();
}

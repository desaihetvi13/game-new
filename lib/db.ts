import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import os from "os";

// Vercel serverless filesystems are not writable in the project directory.
// Use /tmp in production (Vercel) so SQLite can create/read the DB.
const DB_PATH =
  process.env.VERCEL === "1"
    ? path.join(os.tmpdir(), "game-portal.db")
    : path.join(process.cwd(), "data", "game-portal.db");

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  // Avoid "database is locked" errors under concurrent requests.
  _db.pragma("busy_timeout = 5000");
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  // Create tables
  _db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Action',
      thumbnail TEXT DEFAULT '/placeholder-game.png',
      game_url TEXT NOT NULL,
      developer TEXT DEFAULT '',
      rating REAL DEFAULT 4.0,
      plays INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      name TEXT,
      image TEXT,
      role TEXT DEFAULT 'user',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Default branding
    INSERT OR IGNORE INTO config (key, value) VALUES
      ('branding', '{"logoUrl":"/logo.svg","siteName":"GamePortal","primaryColor":"#7c3aed","tagline":"Play Free HTML5 Games Online"}'),
      ('ads', '{"enabled":false,"publisherId":"","leaderboardSlotId":"","sidebarSlotId":"","interstitialSlotId":""}');
  `);

  return _db;
}

import { NextRequest, NextResponse } from "next/server";
import { createGame } from "@/lib/games";
import { slugify } from "@/lib/utils";
import { uploadBufferToS3 } from "@/lib/storage";
import { requireAdmin } from "@/lib/authz";
import { z } from "zod";
import { env } from "@/lib/env";

// Dynamic import to avoid bundling issues
const AdmZip = require("adm-zip");

export const maxDuration = 60;

const uploadSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional().default(""),
  category: z.string().trim().min(2).max(40).optional().default("Action"),
  developer: z.string().trim().max(100).optional().default(""),
  thumbnail: z.string().trim().optional().default(""),
});

function getContentType(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "html":
      return "text/html; charset=utf-8";
    case "js":
      return "application/javascript; charset=utf-8";
    case "css":
      return "text/css; charset=utf-8";
    case "json":
      return "application/json; charset=utf-8";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "webp":
      return "image/webp";
    case "wasm":
      return "application/wasm";
    default:
      return "application/octet-stream";
  }
}

function sanitizeEntryName(name: string) {
  return name.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\.\./g, "").trim();
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof formData.get("title") !== "string") {
      return NextResponse.json({ error: "File and title are required" }, { status: 400 });
    }

    if (!file.name.endsWith(".zip")) {
      return NextResponse.json({ error: "Only ZIP files are accepted" }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
    }

    const payload = uploadSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      developer: formData.get("developer"),
      thumbnail: formData.get("thumbnail"),
    });

    const slug = slugify(payload.title) + "-" + Date.now().toString(36);
    const prefix = `games-content/${slug}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries().filter((entry: { isDirectory: boolean }) => !entry.isDirectory);
    let hasIndex = false;

    for (const entry of entries) {
      const safeName = sanitizeEntryName(entry.entryName);
      if (!safeName) continue;
      if (safeName.toLowerCase() === "index.html") {
        hasIndex = true;
      }
      const entryData = entry.getData() as Buffer;
      await uploadBufferToS3(`${prefix}/${safeName}`, entryData, getContentType(safeName));
    }

    if (!hasIndex) {
      return NextResponse.json({ error: "ZIP must contain index.html at root level" }, { status: 400 });
    }

    const gameUrl = `https://${env.AWS_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${prefix}/index.html`;
    const thumbUrl = payload.thumbnail || "/placeholder-game.png";

    const game = await createGame({
      slug,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      thumbnail: thumbUrl,
      game_url: gameUrl,
      developer: payload.developer,
      rating: 4.0,
      featured: 0,
    });

    return NextResponse.json({ game, slug }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

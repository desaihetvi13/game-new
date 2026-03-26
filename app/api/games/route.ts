import { NextRequest, NextResponse } from "next/server";
import { listGames, createGame } from "@/lib/games";
import { getCategories } from "@/lib/games";
import { createGameSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authz";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const games = await listGames(category);
    const categories = await getCategories();
    return NextResponse.json({ games, categories });
  } catch {
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const payload = createGameSchema.parse(body);
    const game = await createGame(payload);
    return NextResponse.json({ game }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
  }
}

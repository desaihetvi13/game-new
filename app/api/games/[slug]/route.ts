import { NextRequest, NextResponse } from "next/server";
import { getGameAdmin, updateGame, hardDeleteGame, incrementPlays } from "@/lib/games";
import { updateGameSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authz";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const game = await getGameAdmin(params.slug);
    if (!game) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const referer = request.headers.get("referer") || "";
    if (referer.includes("/games/")) {
      await incrementPlays(params.slug);
    }

    return NextResponse.json({ game });
  } catch {
    return NextResponse.json({ error: "Failed to fetch game" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const payload = updateGameSchema.parse(body);
    await updateGame(params.slug, payload);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await hardDeleteGame(params.slug);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete game" }, { status: 500 });
  }
}

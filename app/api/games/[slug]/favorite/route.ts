import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/current-user";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ isFavorite: false, requiresAuth: true });
    }

    const prisma = getPrisma();
    const game = await prisma.game.findUnique({
      where: { slug: params.slug },
      select: { id: true, active: true },
    });
    if (!game || !game.active) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const favorite = await prisma.favorite.findUnique({
      where: { userId_gameId: { userId: user.id, gameId: game.id } },
      select: { id: true },
    });

    return NextResponse.json({ isFavorite: Boolean(favorite) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch favorite" }, { status: 500 });
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const prisma = getPrisma();
    const game = await prisma.game.findUnique({
      where: { slug: params.slug },
      select: { id: true, active: true },
    });
    if (!game || !game.active) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    await prisma.favorite.upsert({
      where: { userId_gameId: { userId: user.id, gameId: game.id } },
      update: {},
      create: {
        userId: user.id,
        gameId: game.id,
      },
    });

    return NextResponse.json({ success: true, isFavorite: true });
  } catch {
    return NextResponse.json({ error: "Failed to save favorite" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const prisma = getPrisma();
    const game = await prisma.game.findUnique({
      where: { slug: params.slug },
      select: { id: true, active: true },
    });
    if (!game || !game.active) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    await prisma.favorite.deleteMany({
      where: { userId: user.id, gameId: game.id },
    });

    return NextResponse.json({ success: true, isFavorite: false });
  } catch {
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}

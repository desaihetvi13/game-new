import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/current-user";
import { gameRatingSchema } from "@/lib/validators";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const prisma = getPrisma();
    const game = await prisma.game.findUnique({
      where: { slug: params.slug },
      select: { id: true, rating: true, ratingCount: true, active: true },
    });
    if (!game || !game.active) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const user = await getCurrentDbUser();
    const userRating = user
      ? await prisma.gameRating.findUnique({
          where: { userId_gameId: { userId: user.id, gameId: game.id } },
          select: { rating: true },
        })
      : null;

    return NextResponse.json({
      averageRating: game.rating,
      ratingCount: game.ratingCount,
      userRating: userRating?.rating ?? null,
      requiresAuth: !user,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch rating" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const body = await request.json();
    const payload = gameRatingSchema.parse(body);
    const prisma = getPrisma();

    const game = await prisma.game.findUnique({
      where: { slug: params.slug },
      select: { id: true, active: true },
    });
    if (!game || !game.active) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      const existing = await tx.gameRating.findUnique({
        where: { userId_gameId: { userId: user.id, gameId: game.id } },
      });

      if (!existing) {
        await tx.gameRating.create({
          data: {
            userId: user.id,
            gameId: game.id,
            rating: payload.rating,
          },
        });
      } else if (existing.rating !== payload.rating) {
        await tx.gameRating.update({
          where: { id: existing.id },
          data: { rating: payload.rating },
        });
      }

      const aggregates = await tx.gameRating.aggregate({
        where: { gameId: game.id },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.game.update({
        where: { id: game.id },
        data: {
          rating: Number((aggregates._avg.rating ?? 0).toFixed(2)),
          ratingCount: aggregates._count.rating,
        },
      });
    });

    const updated = await prisma.game.findUnique({
      where: { id: game.id },
      select: { rating: true, ratingCount: true },
    });

    return NextResponse.json({
      success: true,
      averageRating: updated?.rating ?? 0,
      ratingCount: updated?.ratingCount ?? 0,
      userRating: payload.rating,
    });
  } catch {
    return NextResponse.json({ error: "Failed to save rating" }, { status: 500 });
  }
}

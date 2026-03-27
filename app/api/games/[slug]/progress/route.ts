import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/current-user";
import { gameProgressSchema } from "@/lib/validators";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ progress: null });
    }

    const prisma = getPrisma();
    const game = await prisma.game.findUnique({
      where: { slug: params.slug },
      select: { id: true, active: true },
    });
    if (!game || !game.active) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const progress = await prisma.gameProgress.findUnique({
      where: { userId_gameId: { userId: user.id, gameId: game.id } },
    });

    return NextResponse.json({ progress });
  } catch {
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const payload = gameProgressSchema.parse(body);
    const prisma = getPrisma();

    const game = await prisma.game.findUnique({
      where: { slug: params.slug },
      select: { id: true, active: true },
    });
    if (!game || !game.active) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const progress = await prisma.gameProgress.upsert({
      where: { userId_gameId: { userId: user.id, gameId: game.id } },
      update: {
        elapsedSec: payload.elapsedSec,
        progressPct: payload.progressPct,
        stateJson:
          payload.state === undefined ? Prisma.JsonNull : (payload.state as Prisma.InputJsonValue),
      },
      create: {
        userId: user.id,
        gameId: game.id,
        elapsedSec: payload.elapsedSec,
        progressPct: payload.progressPct,
        stateJson:
          payload.state === undefined ? Prisma.JsonNull : (payload.state as Prisma.InputJsonValue),
      },
    });

    return NextResponse.json({ progress });
  } catch {
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
  }
}

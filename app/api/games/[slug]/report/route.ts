import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/current-user";
import { gameBugReportSchema } from "@/lib/validators";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const payload = gameBugReportSchema.parse(body);

    const prisma = getPrisma();
    const game = await prisma.game.findUnique({
      where: { slug: params.slug },
      select: { id: true, active: true },
    });
    if (!game || !game.active) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const user = await getCurrentDbUser();

    await prisma.gameBugReport.create({
      data: {
        gameId: game.id,
        userId: user?.id ?? null,
        email: payload.email || user?.email || null,
        message: payload.message,
        pageUrl: payload.pageUrl || null,
        userAgent: request.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to submit bug report" }, { status: 500 });
  }
}

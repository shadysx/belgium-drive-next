import { withAuth } from "@/lib/api-middleware";
import { Leaderboards } from "@/lib/interfaces/leaderboards.interface";
import { getUserTotalXP } from "@/lib/utils/getUserTotalXP";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return withAuth(request, async (session) => {
    const prisma = new PrismaClient();

    const users = await prisma.user.findMany({
      include: {
        level: true,
      },
    });

    const levels = await prisma.level.findMany();

    const leaderboard: Leaderboards = {
      global: users
        .map((user) => ({
          id: user.id,
          name: user.name,
          xp: getUserTotalXP(user, levels),
          level: user.level?.level ?? 0,
          isCurrentUser: user.id === session.userId,
        }))
        .sort((a, b) => b.xp - a.xp),
      monthly: [],
      weekly: [],
    };

    return NextResponse.json(leaderboard);
  });
}

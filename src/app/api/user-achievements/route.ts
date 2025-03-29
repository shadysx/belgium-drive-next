import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/api-middleware";
import { initializeUserAchievements } from "@/lib/utils/initializeUserAchievements";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    return withAuth(request, async (session) => {
      const userAchievements = await prisma.userAchievement.findMany({
        where: {
          userId: session.userId,
        },
        include: {
          achievement: true,
        },
        orderBy: {
          achievement: {
            order: "asc",
          },
        },
      });

      return NextResponse.json(userAchievements, { status: 200 });
    });
  } catch {
    return NextResponse.json(
      { error: "Error fetching achievements" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    return withAuth(request, async (session) => {
      await initializeUserAchievements(session.userId, prisma);
      return NextResponse.json(
        { message: "Achievements initialized" },
        { status: 200 }
      );
    });
  } catch {
    return NextResponse.json(
      { message: "Error initializing achievements" },
      { status: 500 }
    );
  }
}

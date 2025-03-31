import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/api-middleware";
import { UserInfo } from "@/lib/interfaces/user-info.interface";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  console.log("request");
  return withAuth(request, async (session) => {
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      include: {
        level: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const nextLevel = await prisma.level.findFirst({
      where: {
        level: user.level!.level + 1,
      },
    });

    const userInfo: UserInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      level: user.level?.level ?? 0,
      currentLvlXP: user.currentLvlXP ?? 0,
      xpRequiredToLevelUp: nextLevel?.xpRequired ?? 0,
    };
    
    return NextResponse.json(userInfo, { status: 200 });
  });
}

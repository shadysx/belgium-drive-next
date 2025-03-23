import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/api-middleware";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    const themesWithQuestions = await prisma.theme.findMany({
      include: {
        questions: true,
      },
    });

    console.log(themesWithQuestions);
    return NextResponse.json(themesWithQuestions);
  });
}

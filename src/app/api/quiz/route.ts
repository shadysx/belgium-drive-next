import { withAuth } from "@/lib/api-middleware";
import { QuizRequest } from "@/lib/interfaces/dto/quiz-request.interface";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    return withAuth(request, async () => {
      const results: QuizRequest = await request.json();
      const questions = await prisma.quizQuestion.findMany({
        take: results.length,
        where: results.theme
          ? {
              themes: {
                some: {
                  theme: { name: results.theme },
                },
              },
            }
          : undefined,
      });

      return NextResponse.json(questions);
    });
  } catch {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

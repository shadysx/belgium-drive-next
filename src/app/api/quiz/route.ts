import { withAuth } from "@/lib/api-middleware";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

interface QuizRequest {
  length: number;
  theme?: string;
}

export async function POST(request: NextRequest) {
  try {
    return withAuth(request, async () => {
      const results: QuizRequest = await request.json();
      console.log("results", results);
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
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

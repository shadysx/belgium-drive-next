import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { QuizSubmission } from "@/lib/interfaces/dto/quiz-submission.interface";
import { withAuth } from "@/lib/api-middleware";
import { updateProgressAndAchievementsAfterQuiz } from "@/lib/utils/updateProgressAndAchievementsAfterQuiz";
import { QuizType } from "@/lib/enums/quiz-type.enum";
import { ProgressData } from "@/lib/interfaces/dto/progress-data.interface";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    return withAuth(request, async (session) => {
      const results: QuizSubmission = await request.json();

      const questions = await prisma.quizQuestion.findMany({
        where: {
          id: {
            in: results.quizSubmissionElements.map(
              (element) => element.questionId
            ),
          },
        },
      });

      let score = 0;

      results.quizSubmissionElements.forEach(async (element) => {
        const question = questions.find(
          (question) => question.id === element.questionId
        );
        if (!question) {
          throw new Error("Question not found");
        }
        const isCorrect = element.userAnswerIndex === question.answerIndex;
        if (question.isSerious && results.type === QuizType.SIMULATION) {
          if (isCorrect) score++;
          else score -= 5;
        } else {
          if (isCorrect) score++;
        }
      });

      const quizResult = await prisma.quizResult.create({
        data: {
          type: results.type,
          score: score,
          userId: session.userId,
          quizResultElements: {
            create: results.quizSubmissionElements.map((element) => ({
              question: {
                connect: {
                  id: element.questionId,
                },
              },
              userAnswerIndex: element.userAnswerIndex,
            })),
          },
        },
        include: {
          quizResultElements: {
            include: {
              question: true,
            },
          },
        },
      });

      const progressData: ProgressData =
        await updateProgressAndAchievementsAfterQuiz(
          session.userId,
          quizResult,
          prisma
        );

      return NextResponse.json(
        {
          ...quizResult,
          progressData,
        },
        { status: 200 }
      );
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process quiz results" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    return withAuth(request, async (session) => {
      const { searchParams } = new URL(request.url);
      const limit = Number(searchParams.get("limit")) || 10;
      const cursor = searchParams.get("cursor");

      const paginationOptions = {
        take: limit + 1,
        ...(cursor && {
          skip: 1,
          cursor: { id: cursor },
        }),
      };

      const results = await prisma.quizResult.findMany({
        where: { userId: session.userId },
        include: {
          quizResultElements: {
            include: { question: true },
          },
        },
        orderBy: { createdAt: "desc" },
        ...paginationOptions,
      });

      const hasMore = results.length > limit;
      const nextCursor = hasMore ? results[limit - 1].id : undefined;
      const paginatedResults = results.slice(0, limit);

      return NextResponse.json({
        results: paginatedResults,
        nextCursor,
        hasMore,
      });
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch quiz results" },
      { status: 500 }
    );
  }
}

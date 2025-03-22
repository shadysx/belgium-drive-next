import { withAuth } from "@/lib/api-middleware";
import { NextRequest, NextResponse } from "next/server";
// import { QuizResult } from "@/lib/interfaces/quiz-result.interface";
import { PrismaClient } from "@prisma/client";
import { QuizResult } from "@/lib/interfaces/quiz-result.interface";
import { QuizResultElement } from "@/lib/interfaces/quiz-result-element.interface";
import { Stats } from "@/lib/interfaces/stats.interface";

interface StatsAcc {
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  totalQuizDone: number;
  successQuizElementRatio: number;
}

export async function GET(request: NextRequest) {
  return withAuth(request, async (session) => {
    const prisma = new PrismaClient();

    const quizResults = await prisma.quizResult.findMany({
      where: {
        userId: session.userId,
      },
      include: {
        quizResultElements: {
          include: {
            question: true,
          },
        },
      },
    });

    const rawStats = quizResults.reduce(
      (acc: StatsAcc, quizResult: QuizResult) => {
        const correctAnswers = quizResult.quizResultElements.filter(
          (element: QuizResultElement) =>
            element.userAnswerIndex === element.question.answerIndex
        ).length;

        return {
          totalQuestionsAnswered:
            acc.totalQuestionsAnswered + quizResult.quizResultElements.length,
          totalCorrectAnswers: acc.totalCorrectAnswers + correctAnswers,
          totalQuizDone: acc.totalQuizDone + 1,
          successQuizElementRatio: 0,
        };
      },
      {
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        totalQuizDone: 0,
        successQuizElementRatio: 0,
      }
    );

    const stats: Stats = {
      totalQuestionsAnswered: rawStats.totalQuestionsAnswered,
      totalQuizDone: rawStats.totalQuizDone,
      successQuizElementRatio:
        (rawStats.totalCorrectAnswers / rawStats.totalQuestionsAnswered) * 100,
    };

    return NextResponse.json(stats);
  });
}

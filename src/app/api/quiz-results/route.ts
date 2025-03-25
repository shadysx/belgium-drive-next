import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { QuizSubmission } from "@/lib/interfaces/dto/quiz-submission.interface";
import { withAuth } from "@/lib/api-middleware";
import { updateAchievementsAfterQuiz } from "@/lib/utils/updateAchievementsAfterQuiz";

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
        if (question.isSerious) {
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

      const completedUserAchievements = await updateAchievementsAfterQuiz(
        session.userId,
        quizResult,
        prisma
      );

      return NextResponse.json(
        {
          ...quizResult,
          completedUserAchievements,
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
      const results = await prisma.quizResult.findMany({
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
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(results);
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch quiz results" },
      { status: 500 }
    );
  }
}

import { PrismaClient } from "@prisma/client";
import { AchievementType } from "../enums/achievement-type";
import { QuizResult } from "@/lib/interfaces/quiz-result.interface";

export async function updateAchievementsAfterQuiz(
  userId: string,
  quizResult: QuizResult,
  prisma: PrismaClient
) {
  const correctAnswers = quizResult.quizResultElements.filter(
    (element) => element.question.answerIndex === element.userAnswerIndex
  ).length;

  await prisma.$transaction([
    prisma.userAchievement.updateMany({
      where: {
        userId,
        achievementId: AchievementType.FIVE_COMPLETED_QUIZZES,
        completed: false,
      },
      data: {
        currentProgress: { increment: 1 },
      },
    }),
    prisma.userAchievement.updateMany({
      where: {
        userId,
        achievementId: AchievementType.HUNDRED_QUESTIONS_ANSWERED,
      },
      data: {
        currentProgress: { increment: correctAnswers },
      },
    }),
    prisma.userAchievement.updateMany({
      where: {
        userId,
        achievementId: AchievementType.TWO_HUNDRED_FIFTY_QUESTIONS_ANSWERED,
      },
      data: {
        currentProgress: { increment: correctAnswers },
      },
    }),
    prisma.userAchievement.updateMany({
      where: {
        userId,
        achievementId: AchievementType.FIVE_HUNDRED_QUESTIONS_ANSWERED,
      },
      data: {
        currentProgress: { increment: correctAnswers },
      },
    }),
    prisma.userAchievement.updateMany({
      where: {
        userId,
        achievementId: AchievementType.ONE_THOUSAND_QUESTIONS_ANSWERED,
      },
      data: {
        currentProgress: { increment: correctAnswers },
      },
    }),
  ]);

  // Check if the user has completed any achievements
  const userAchievements = await prisma.userAchievement.findMany({
    where: {
      userId,
      completed: false,
    },
    include: {
      achievement: true,
    },
  });
  const completedUserAchievements = userAchievements.filter(
    (userAchievement) =>
      userAchievement.completed !== true &&
      userAchievement.currentProgress >= userAchievement.achievement.maxProgress
  );

  if (completedUserAchievements.length > 0) {
    await prisma.$transaction([
      prisma.userAchievement.updateMany({
        where: { id: { in: completedUserAchievements.map((a) => a.id) } },
        data: { completed: true, completedAt: new Date() },
      }),
    ]);
    return completedUserAchievements;
  }
}

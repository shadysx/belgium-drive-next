import { PrismaClient } from "@prisma/client";
import { QuizResult } from "@/lib/interfaces/quiz-result.interface";
import { calculateXPAndLevel } from "./calculateXPAndLevel";
import { updateAchievements } from "./updateAchievementsProgress";
import { getCompletedAchievements } from "./getCompletedAchievements";

export async function updateProgressAndAchievementsAfterQuiz(
  userId: string,
  quizResult: QuizResult,
  prisma: PrismaClient
) {
  const correctAnswers = quizResult.quizResultElements.filter(
    (element) => element.question.answerIndex === element.userAnswerIndex
  ).length;

  await updateAchievements(userId, correctAnswers, prisma);

  const completedUserAchievements = await getCompletedAchievements(
    userId,
    prisma
  );

  const xpGained = completedUserAchievements?.reduce((acc, userAchievement) => {
    return acc + userAchievement.achievement.xp;
  }, 0);

  if (xpGained === 0) {
    return [];
  }

  const transactionOperations = [];

  const { newXP, newLevelId } = await calculateXPAndLevel(
    prisma,
    userId,
    xpGained
  );

  transactionOperations.push(
    prisma.user.update({
      where: { id: userId },
      data: {
        currentLvlXP: newXP,
        level: {
          connect: {
            id: newLevelId,
          },
        },
      },
    })
  );

  if (completedUserAchievements.length > 0) {
    transactionOperations.push(
      prisma.userAchievement.updateMany({
        where: { id: { in: completedUserAchievements.map((a) => a.id) } },
        data: { completed: true, completedAt: new Date() },
      })
    );
  }

  if (transactionOperations.length > 0) {
    await prisma.$transaction(transactionOperations);
  }

  return completedUserAchievements;
}

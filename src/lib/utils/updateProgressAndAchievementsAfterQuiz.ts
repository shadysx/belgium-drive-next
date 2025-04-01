import { PrismaClient } from "@prisma/client";
import { QuizResult } from "@/lib/interfaces/quiz-result.interface";
import { calculateXPAndLevel } from "./calculateXPAndLevel";
import { updateAchievementsProgress } from "./updateAchievementsProgress";
import { getCompletedAchievements } from "./getCompletedAchievements";
import { ProgressData } from "../interfaces/dto/progress-data.interface";

export async function updateProgressAndAchievementsAfterQuiz(
  userId: string,
  quizResult: QuizResult,
  prisma: PrismaClient
) {
  const correctAnswers = quizResult.quizResultElements.filter(
    (element) => element.question.answerIndex === element.userAnswerIndex
  ).length;

  await updateAchievementsProgress(userId, correctAnswers, prisma);

  const completedUserAchievements = await getCompletedAchievements(
    userId,
    prisma
  );

  const xpGained = completedUserAchievements?.reduce((acc, userAchievement) => {
    return acc + userAchievement.achievement.xp;
  }, 25);

  const transactionOperations = [];

  const data = await calculateXPAndLevel(prisma, userId, xpGained);

  transactionOperations.push(
    prisma.user.update({
      where: { id: userId },
      data: {
        currentLvlXP: data.newXP,
        level: {
          connect: {
            id: data.newLevelId,
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

  const progressData: ProgressData = {
    previousXP: data.previousXP,
    xpGained: data.xpGained,
    previousLevel: data.previousLevel,
    newLevel: data.newLevel,
    newXP: data.newXP,
    completedUserAchievements,
  };

  return progressData;
}

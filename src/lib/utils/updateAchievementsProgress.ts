import { PrismaClient } from "@prisma/client";
import { AchievementType } from "../enums/achievement-type";

export async function updateAchievementsProgress(
  userId: string,
  correctAnswers: number,
  prisma: PrismaClient
) {
  const achievementUpdates = [
    { type: AchievementType.FIVE_COMPLETED_QUIZZES, increment: 1 },
    {
      type: AchievementType.HUNDRED_QUESTIONS_ANSWERED,
      increment: correctAnswers,
    },
    {
      type: AchievementType.TWO_HUNDRED_FIFTY_QUESTIONS_ANSWERED,
      increment: correctAnswers,
    },
    {
      type: AchievementType.FIVE_HUNDRED_QUESTIONS_ANSWERED,
      increment: correctAnswers,
    },
    {
      type: AchievementType.ONE_THOUSAND_QUESTIONS_ANSWERED,
      increment: correctAnswers,
    },
  ];

  return prisma.$transaction(
    achievementUpdates.map(({ type, increment }) =>
      prisma.userAchievement.updateMany({
        where: { userId, achievementId: type, completed: false },
        data: { currentProgress: { increment } },
      })
    )
  );
}

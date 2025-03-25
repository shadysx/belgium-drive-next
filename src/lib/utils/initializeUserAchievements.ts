import { PrismaClient } from "@prisma/client";

export async function initializeUserAchievements(
  userId: string,
  prisma: PrismaClient
) {
  const achievements = await prisma.achievement.findMany();

  const existingUserAchievements = await prisma.userAchievement.findMany({
    where: {
      userId: userId,
    },
    select: {
      achievementId: true,
    },
  });

  const existingAchievementIds = existingUserAchievements.map(
    (ua) => ua.achievementId
  );

  const newAchievements = achievements.filter(
    (achievement) => !existingAchievementIds.includes(achievement.id)
  );

  if (newAchievements.length > 0) {
    await prisma.userAchievement.createMany({
      data: newAchievements.map((achievement) => ({
        userId,
        achievementId: achievement.id,
        currentProgress: 0,
        completed: false,
      })),
    });
  }
}

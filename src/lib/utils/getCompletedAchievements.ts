import { PrismaClient } from "@prisma/client";

export async function getCompletedAchievements(
  userId: string,
  prisma: PrismaClient
) {
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId, completed: false },
    include: { achievement: true },
  });

  return userAchievements.filter(
    (ua) => !ua.completed && ua.currentProgress >= ua.achievement.maxProgress
  );
}

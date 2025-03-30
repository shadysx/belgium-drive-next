import { PrismaClient } from "@prisma/client";

export const calculateXPAndLevel = async (
  prisma: PrismaClient,
  userId: string,
  xpGained: number
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      currentLvlXP: true,
      level: true,
    },
  });
  const currentXP = user!.currentLvlXP!;
  const currentLevel = user!.level!;

  const nextLevel = await prisma.level.findUnique({
    where: {
      level: currentLevel.level + 1,
    },
  });

  if (!nextLevel) {
    return {
      newXP: currentXP + xpGained,
      newLevelId: currentLevel.id,
    };
  }

  const totalXP = xpGained + currentXP;
  const isLevelUp = totalXP >= nextLevel.xpRequired;

  return {
    newXP: isLevelUp ? totalXP - nextLevel.xpRequired : totalXP,
    newLevelId: isLevelUp ? nextLevel.id : currentLevel.id,
  };
};

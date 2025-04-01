import { Level, PrismaClient } from "@prisma/client";

const findNextLevel = (levels: Level[], currentLevel: number): Level | null => {
  return levels.find((level) => level.level === currentLevel + 1) || null;
};

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

  if (!user || user.currentLvlXP == null || user.level == null) {
    throw new Error(`User ${userId} not found or missing XP/level data`);
  }

  const previousLevel = user.level.level;
  const currentXP = user.currentLvlXP;
  const currentLevel = user.level;

  let xpToDistribute = xpGained;

  const levels = await prisma.level.findMany({
    orderBy: {
      level: "asc",
    },
  });

  const nextLevel = findNextLevel(levels, currentLevel.level);

  if (!nextLevel) {
    return {
      newXP: currentXP + xpGained,
      newLevelId: currentLevel.id,
      previousXP: currentXP,
      xpGained: xpGained,
      previousLevel: previousLevel,
    };
  }

  let tempXP = currentXP;
  let tempLevel: Level | null = currentLevel;
  let isMaxLevel = false;
  const isLevelUp = xpToDistribute + tempXP >= tempLevel.xpRequired;

  if (isLevelUp) {
    while (tempLevel && xpToDistribute + tempXP >= tempLevel.xpRequired) {
      xpToDistribute -= tempLevel.xpRequired - tempXP;
      tempXP = 0;
      tempLevel = findNextLevel(levels, tempLevel.level);
      if (!tempLevel) {
        isMaxLevel = true;
      }
    }
  } else {
    xpToDistribute = xpToDistribute + currentXP;
  }

  const maxLevel = await prisma.level.findFirst({
    orderBy: {
      level: "desc",
    },
  });

  return {
    previousXP: currentXP,
    xpGained: xpGained,
    previousLevel: previousLevel,
    newLevel: isMaxLevel ? maxLevel?.level : tempLevel?.level,
    newXP: xpToDistribute,
    newLevelId: isMaxLevel ? maxLevel?.id : tempLevel?.id,
  };
};

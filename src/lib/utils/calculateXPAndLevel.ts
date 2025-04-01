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
  const totalXP = xpGained + currentXP;
  let xpToDistribute = xpGained;

  const levels = await prisma.level.findMany({
    orderBy: {
      level: "asc",
    },
  });

  let nextLevel = findNextLevel(levels, currentLevel.level);

  if (!nextLevel) {
    return {
      newXP: currentXP + xpGained,
      newLevelId: currentLevel.id,
      previousXP: currentXP,
      xpGained: xpGained,
      previousLevel: previousLevel,
    };
  }

  const isLevelUp = totalXP >= nextLevel.xpRequired;

  console.log("nextLevelXPRequired before loop", nextLevel.xpRequired);
  console.log("currentLevel before loop", currentLevel);
  console.log("xpToDistribute before loop", xpToDistribute);
  console.log("isLevelUp after before loop", isLevelUp);

  while (nextLevel && xpToDistribute + currentXP >= nextLevel.xpRequired) {
    xpToDistribute -= nextLevel!.xpRequired - currentXP;
    currentLevel.level++;
    nextLevel = findNextLevel(levels, currentLevel.level);
  }

  console.log("--------------------------------");
  console.log("nextLevelXPRequired after loop", nextLevel?.xpRequired);
  console.log("currentLevel after loop", currentLevel);
  console.log("xpToDistribute after loop", xpToDistribute);

  const newLevel = levels.find((level) => level.level === currentLevel.level)!;

  console.log("here previousLevel", user.level.level);

  return {
    previousXP: currentXP,
    xpGained: xpGained,
    previousLevel: previousLevel,
    newLevel: newLevel.level,
    newXP: isLevelUp ? xpToDistribute : totalXP,
    newLevelId: newLevel.id,
  };
};

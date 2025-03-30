import { Level, User } from "@prisma/client";

export function getUserTotalXP(user: User, levels: Level[]) {
  const currentLevel = user.levelId;
  const currentLevelIndex = levels.findIndex(
    (level) => level.id === currentLevel
  );

  const totalXPFromLevels = levels
    .slice(0, currentLevelIndex + 1)
    .reduce((acc, level) => acc + level.xpRequired, 0);

  const totalXP = totalXPFromLevels + (user?.currentLvlXP ?? 0);

  return totalXP;
}

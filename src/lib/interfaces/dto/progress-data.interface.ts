import { UserAchievement } from "../user-achievement.interface";

export interface ProgressData {
  previousXP: number;
  xpGained: number;
  previousLevel: number;
  newLevel?: number;
  newXP: number;
  completedUserAchievements: UserAchievement[];
}

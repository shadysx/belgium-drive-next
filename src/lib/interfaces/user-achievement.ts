import { Achievement } from "@prisma/client";

export interface UserAchievement {
  id: string;
  userId: string;
  currentProgress: number;
  completed: boolean;
  completedAt: Date;
  achievement: Achievement;
}

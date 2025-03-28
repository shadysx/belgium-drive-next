import { QuizType } from "@/lib/enums/quiz-type.enum";
import { QuizResultElement } from "@/lib/interfaces/quiz-result-element.interface";
import { UserAchievement } from "@/lib/interfaces/user-achievement";

export interface QuizResultDto {
  id: string;
  userId: string;
  type: QuizType;
  score: number;
  quizResultElements: QuizResultElement[];
  createdAt: string | Date;
  updatedAt: string | Date;
  completedUserAchievements?: UserAchievement[];
}

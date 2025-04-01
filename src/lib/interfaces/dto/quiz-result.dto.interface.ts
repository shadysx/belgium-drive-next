import { QuizType } from "@/lib/enums/quiz-type.enum";
import { QuizResultElement } from "@/lib/interfaces/quiz-result-element.interface";
import { ProgressData } from "./progress-data.interface";

export interface QuizResultDto {
  id: string;
  userId: string;
  type: QuizType;
  score: number;
  quizResultElements: QuizResultElement[];
  createdAt: string | Date;
  updatedAt: string | Date;
  progressData: ProgressData;
}

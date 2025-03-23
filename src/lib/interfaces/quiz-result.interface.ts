import { QuizType } from "@/lib/enums/quiz-type.enum";
import { QuizResultElement } from "./quiz-result-element.interface";

export interface QuizResult {
  id: string;
  userId: string;
  type: QuizType;
  score: number;
  quizResultElements: QuizResultElement[];
  createdAt: string;
  updatedAt: string;
}

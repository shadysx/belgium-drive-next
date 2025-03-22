import { QuizQuestion } from "./quiz-question.interface";

export interface QuizResultElement {
  id: string;
  question: QuizQuestion;
  userAnswerIndex: number | null;
}

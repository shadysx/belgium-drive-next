import { Question } from "./question.interface";

export interface QuizResultElement {
  id: string;
  question: Question;
  userAnswerIndex: number | null;
}

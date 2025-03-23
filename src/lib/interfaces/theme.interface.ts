import { QuizQuestion } from "./quiz-question.interface";

export interface Theme {
  id: string;
  name: string;
}

export interface ThemeWithQuestions extends Theme {
  questions: QuizQuestion[];
}

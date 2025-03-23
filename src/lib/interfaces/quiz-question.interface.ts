import { Theme } from "./theme.interface";

export interface QuizQuestion {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  answers: string[];
  answerIndex: number;
  explanation: string;
  createdAt: string | Date;
  isSerious: boolean;
  themes?: Theme[];
  thumbnailUrl: string;
}

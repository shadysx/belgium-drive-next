export interface QuizQuestion {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  answers: string[];
  answerIndex: number;
  category: string;
  explanation: string;
  createdAt: string;
  isSerious: boolean;
  thumbnailUrl: string;
}

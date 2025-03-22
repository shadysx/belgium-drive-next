import { QuizType } from "@/lib/enums/quiz-type.enum";
import { QuizSubmissionElement } from "@/lib/interfaces/dto/quiz-submission-element.interface";

export interface QuizSubmission {
  type: QuizType;
  quizSubmissionElements: QuizSubmissionElement[];
}

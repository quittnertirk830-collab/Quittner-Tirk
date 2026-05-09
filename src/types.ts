export type QuestionType = 'single' | 'multiple' | 'boolean';

export interface Question {
  id: string;
  type: QuestionType;
  category: string;
  text: string;
  options?: string[];
  correctAnswer: number | number[] | boolean;
  explanation?: string;
}

export type QuizMode = 'practice' | 'exam' | 'review';

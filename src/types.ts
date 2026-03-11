export type QuestionType = "rating" | "multiple_choice" | "text";

export interface Question {
  type: QuestionType;
  question: string;
  options?: string[];
  required?: boolean;
}

export interface Form {
  id: string;
  title: string;
  questions: Question[];
  created_at?: string;
}

export interface Answer {
  question: string;
  answer: string | number;
}

export interface Response {
  id: number;
  form_id: string;
  answers: Answer[];
  created_at: string;
}

// Типы данных приложения.

// Вопрос с вариантами ответа (нужно выбрать один вариант).
export interface ChoiceQuestion {
  id: number;
  type: 'choice';
  question: string;
  options: string[];
  correctAnswer: string;
}

// Вопрос с открытым текстовым ответом.
export interface TextQuestion {
  id: number;
  type: 'text';
  question: string;
  correctAnswers: string[];
}

export type Question = ChoiceQuestion | TextQuestion;

// Данные участника, которые он вводит перед началом теста.
export interface Participant {
  name: string;
  group: string;
}

// Один разобранный ответ (для показа результата и отправки в Telegram).
export interface AnswerDetail {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  type: Question['type'];
}

// Полный результат прохождения теста.
export interface TestResult {
  name: string;
  group: string;
  testTitle: string;
  total: number;
  score: number;
  percentage: number;
  submissionId: string;
  date: string;
  answers: AnswerDetail[];
}

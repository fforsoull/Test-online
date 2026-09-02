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
  // Если true — ответ проверяется преподавателем вручную (длинный/развёрнутый).
  // Такой вопрос НЕ влияет на автоматический балл, но ответ участника и
  // образец правильного ответа отправляются в Telegram.
  manualReview?: boolean;
}

export type Question = ChoiceQuestion | TextQuestion;

// Один тест (у сайта их может быть несколько).
export interface Test {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

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
  manualReview: boolean;
  type: Question['type'];
}

// Полный результат прохождения теста.
export interface TestResult {
  name: string;
  group: string;
  testTitle: string;
  total: number; // сколько вопросов проверяется автоматически
  score: number; // сколько из них правильных
  percentage: number; // процент по автоматически проверяемым
  manualCount: number; // сколько вопросов на ручной проверке
  submissionId: string;
  date: string;
  answers: AnswerDetail[];
}

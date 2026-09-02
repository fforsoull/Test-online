import type { Question, AnswerDetail, Participant, TestResult } from '../types';
import { TEST_TITLE } from '../data/questions';

// Нормализация текста для сравнения открытых ответов:
// - убираем пробелы по краям;
// - приводим к нижнему регистру;
// - схлопываем повторяющиеся пробелы в один;
// - букву «ё» приводим к «е» (частая опечатка).
export function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ');
}

// Проверяет один ответ на правильность.
export function isAnswerCorrect(question: Question, answer: string | undefined): boolean {
  if (!answer || answer.trim() === '') return false;

  if (question.type === 'choice') {
    return answer === question.correctAnswer;
  }

  // type === 'text'
  const normalized = normalize(answer);
  return question.correctAnswers.some((correct) => normalize(correct) === normalized);
}

// Возвращает «правильный ответ» в виде строки (для показа/отправки).
function correctAnswerText(question: Question): string {
  if (question.type === 'choice') return question.correctAnswer;
  return question.correctAnswers.join(' / ');
}

// Генерация короткого ID прохождения (8 символов).
function makeSubmissionId(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

// Формат даты: 02.09.2026 11:30
function formatDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

// Считает полный результат прохождения теста.
export function buildResult(
  questions: Question[],
  answers: Record<number, string>,
  participant: Participant
): TestResult {
  const details: AnswerDetail[] = questions.map((q) => {
    const userAnswer = answers[q.id] ?? '';
    const correct = isAnswerCorrect(q, userAnswer);
    return {
      question: q.question,
      userAnswer: userAnswer.trim() === '' ? '(нет ответа)' : userAnswer.trim(),
      correctAnswer: correctAnswerText(q),
      isCorrect: correct,
      type: q.type,
    };
  });

  const total = questions.length;
  const score = details.filter((d) => d.isCorrect).length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return {
    name: participant.name.trim(),
    group: participant.group.trim(),
    testTitle: TEST_TITLE,
    total,
    score,
    percentage,
    submissionId: makeSubmissionId(),
    date: formatDate(new Date()),
    answers: details,
  };
}

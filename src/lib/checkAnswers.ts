import type { Question, AnswerDetail, Participant, TestResult, Test } from '../types';

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

// Нужен ли вопросу ручной разбор (развёрнутый открытый ответ).
function isManual(question: Question): boolean {
  return question.type === 'text' && question.manualReview === true;
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
  test: Test,
  answers: Record<number, string>,
  participant: Participant
): TestResult {
  const details: AnswerDetail[] = test.questions.map((q) => {
    const userAnswer = answers[q.id] ?? '';
    const manual = isManual(q);
    // Вопросы на ручной проверке не считаем правильными/неправильными автоматически.
    const correct = manual ? false : isAnswerCorrect(q, userAnswer);
    return {
      question: q.question,
      userAnswer: userAnswer.trim() === '' ? '(нет ответа)' : userAnswer.trim(),
      correctAnswer: correctAnswerText(q),
      isCorrect: correct,
      manualReview: manual,
      type: q.type,
    };
  });

  // Автоматический балл считаем только по автоматически проверяемым вопросам.
  const autoChecked = details.filter((d) => !d.manualReview);
  const total = autoChecked.length;
  const score = autoChecked.filter((d) => d.isCorrect).length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const manualCount = details.length - autoChecked.length;

  return {
    name: participant.name.trim(),
    group: participant.group.trim(),
    testTitle: test.title,
    total,
    score,
    percentage,
    manualCount,
    submissionId: makeSubmissionId(),
    date: formatDate(new Date()),
    answers: details,
  };
}

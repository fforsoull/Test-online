import { useState } from 'react';
import type { Participant, TestResult, Test } from './types';
import { buildResult } from './lib/checkAnswers';
import Home from './components/Home';
import TestSelect from './components/TestSelect';
import StartForm from './components/StartForm';
import ProgressBar from './components/ProgressBar';
import QuestionCard from './components/QuestionCard';
import ConfirmModal from './components/ConfirmModal';
import Result, { type SendStatus } from './components/Result';
import Footer from './components/Footer';

// Экраны приложения.
type Screen = 'home' | 'select' | 'start' | 'quiz' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [participant, setParticipant] = useState<Participant>({ name: '', group: '' });

  // Ответы: ключ — id вопроса, значение — ответ пользователя.
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState<TestResult | null>(null);
  const [sendStatus, setSendStatus] = useState<SendStatus>('sending');

  const questions = selectedTest?.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  // Есть ли ответ на текущий вопрос (для блокировки кнопки «Далее»).
  const currentAnswered =
    !!currentQuestion && (answers[currentQuestion.id] ?? '').trim() !== '';

  // --- Переходы между экранами ---

  const handleStart = () => setScreen('select');

  const handleSelectTest = (test: Test) => {
    setSelectedTest(test);
    setAnswers({});
    setCurrentIndex(0);
    setScreen('start');
  };

  const handleParticipantSubmit = (p: Participant) => {
    setParticipant(p);
    setAnswers({});
    setCurrentIndex(0);
    setScreen('quiz');
  };

  const handleAnswerChange = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (isLast) {
      setShowConfirm(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      setScreen('start');
    } else {
      setCurrentIndex((i) => i - 1);
    }
  };

  // --- Отправка результата в Telegram ---

  const sendToTelegram = async (data: TestResult) => {
    setSendStatus('sending');
    try {
      const res = await fetch('/api/telegram-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Ошибка отправки');
      setSendStatus('sent');
    } catch {
      setSendStatus('error');
    }
  };

  // Подтверждение завершения теста (защита от двойного нажатия — submitting).
  const handleConfirmFinish = async () => {
    if (submitting || !selectedTest) return;
    setSubmitting(true);

    const computed = buildResult(selectedTest, answers, participant);
    setResult(computed);
    setShowConfirm(false);
    setScreen('result');

    await sendToTelegram(computed);
    setSubmitting(false);
  };

  const handleRetrySend = () => {
    if (result) sendToTelegram(result);
  };

  const handleRestart = () => {
    setSelectedTest(null);
    setParticipant({ name: '', group: '' });
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setSendStatus('sending');
    setScreen('home');
  };

  // --- Отрисовка ---

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-8 sm:py-12">
        {screen === 'home' && <Home onStart={handleStart} />}

        {screen === 'select' && (
          <TestSelect onSelect={handleSelectTest} onBack={() => setScreen('home')} />
        )}

        {screen === 'start' && (
          <StartForm
            onSubmit={handleParticipantSubmit}
            onBack={() => setScreen('select')}
          />
        )}

        {screen === 'quiz' && currentQuestion && (
          <div>
            <ProgressBar current={currentIndex + 1} total={questions.length} />

            <QuestionCard
              question={currentQuestion}
              answer={answers[currentQuestion.id] ?? ''}
              onChange={handleAnswerChange}
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleBack}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Назад
              </button>
              <button
                onClick={handleNext}
                disabled={!currentAnswered}
                className="flex-1 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {isLast ? 'Завершить тест' : 'Далее'}
              </button>
            </div>

            {!currentAnswered && (
              <p className="mt-3 text-center text-sm text-slate-400">
                Ответьте на вопрос, чтобы продолжить
              </p>
            )}
          </div>
        )}

        {screen === 'result' && result && (
          <Result
            result={result}
            sendStatus={sendStatus}
            onRetry={handleRetrySend}
            onRestart={handleRestart}
          />
        )}
      </main>

      <Footer />

      {showConfirm && (
        <ConfirmModal
          onConfirm={handleConfirmFinish}
          onCancel={() => setShowConfirm(false)}
          submitting={submitting}
        />
      )}
    </div>
  );
}

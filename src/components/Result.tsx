import type { TestResult } from '../types';

export type SendStatus = 'sending' | 'sent' | 'error';

interface Props {
  result: TestResult;
  sendStatus: SendStatus;
  onRetry: () => void;
  onRestart: () => void;
}

export default function Result({ result, sendStatus, onRetry, onRestart }: Props) {
  const wrong = result.total - result.score;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-slate-900">Тест завершён</h2>
      <p className="mt-1 text-sm text-slate-500">Ваш результат</p>

      <div className="mt-6">
        <div className="text-5xl font-bold text-brand-600">
          {result.score} / {result.total}
        </div>
        <div className="mt-1 text-2xl font-semibold text-slate-700">{result.percentage}%</div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xl font-bold text-slate-900">{result.total}</div>
          <div className="text-xs text-slate-500">Вопросов</div>
        </div>
        <div className="rounded-xl bg-green-50 p-3">
          <div className="text-xl font-bold text-green-600">{result.score}</div>
          <div className="text-xs text-slate-500">Правильных</div>
        </div>
        <div className="rounded-xl bg-red-50 p-3">
          <div className="text-xl font-bold text-red-600">{wrong}</div>
          <div className="text-xs text-slate-500">Неправильных</div>
        </div>
      </div>

      {/* Статус отправки результата в Telegram */}
      <div className="mt-6">
        {sendStatus === 'sending' && (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
            Отправка результата…
          </div>
        )}
        {sendStatus === 'sent' && (
          <div className="rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
            ✓ Результат успешно отправлен
          </div>
        )}
        {sendStatus === 'error' && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Не удалось отправить результат. Попробуйте ещё раз.</p>
            <button
              onClick={onRetry}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Отправить ещё раз
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onRestart}
        className="mt-6 w-full rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Пройти тест ещё раз
      </button>
    </div>
  );
}

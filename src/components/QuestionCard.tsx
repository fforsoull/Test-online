import type { Question } from '../types';

interface Props {
  question: Question;
  answer: string;
  onChange: (value: string) => void;
}

export default function QuestionCard({ question, answer, onChange }: Props) {
  const manual = question.type === 'text' && question.manualReview === true;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
        Вопрос
      </span>
      <h2 className="mt-2 whitespace-pre-line text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
        {question.question}
      </h2>

      {question.type === 'choice' ? (
        <div className="mt-6 space-y-3">
          {question.options.map((option) => {
            const selected = answer === option;
            return (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                  selected
                    ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
                    selected ? 'border-brand-600' : 'border-slate-300'
                  }`}
                >
                  {selected && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
                </span>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={selected}
                  onChange={() => onChange(option)}
                  className="sr-only"
                />
                <span className="whitespace-pre-line text-base text-slate-800">{option}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="mt-6">
          <textarea
            value={answer}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Введите свой ответ..."
            rows={5}
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          {manual && (
            <p className="mt-2 text-sm text-slate-400">
              Это развёрнутый вопрос — ваш ответ проверит преподаватель.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

import type { Test } from '../types';
import { tests } from '../data/questions';

interface Props {
  onSelect: (test: Test) => void;
  onBack: () => void;
}

export default function TestSelect({ onSelect, onBack }: Props) {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-slate-900">Выберите тест</h2>
      <p className="mt-2 text-center text-sm text-slate-500">
        Нажмите на нужный тест, чтобы начать
      </p>

      <div className="mt-6 space-y-4">
        {tests.map((test) => (
          <button
            key={test.id}
            onClick={() => onSelect(test)}
            className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-brand-500 hover:bg-brand-50 active:scale-[0.99]"
          >
            <span>
              <span className="block text-lg font-semibold text-slate-900">{test.title}</span>
              {test.description && (
                <span className="mt-0.5 block text-sm text-slate-500">{test.description}</span>
              )}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 flex-shrink-0 text-brand-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Назад
        </button>
      </div>
    </div>
  );
}

import { SITE_TITLE } from '../data/questions';

interface Props {
  onStart: () => void;
}

export default function Home({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {SITE_TITLE}
      </h1>
      <p className="mt-3 max-w-md text-base text-slate-500">
        Ответьте на вопросы и узнайте свой результат
      </p>

      <button
        onClick={onStart}
        className="mt-8 w-full max-w-xs rounded-xl bg-brand-600 px-6 py-4 text-lg font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700 active:scale-[0.99]"
      >
        Начать тест
      </button>
    </div>
  );
}

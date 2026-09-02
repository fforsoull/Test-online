import { useState } from 'react';
import type { Participant } from '../types';

interface Props {
  onSubmit: (participant: Participant) => void;
  onBack: () => void;
}

export default function StartForm({ onSubmit, onBack }: Props) {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') {
      setError('Пожалуйста, введите имя и фамилию');
      return;
    }
    setError('');
    onSubmit({ name: name.trim(), group: group.trim() });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900">Немного о вас</h2>
      <p className="mt-2 text-sm text-slate-500">
        Заполните данные перед началом теста
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Имя и фамилия <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите имя и фамилию"
            autoComplete="name"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label htmlFor="group" className="mb-1.5 block text-sm font-medium text-slate-700">
            Группа / курс
          </label>
          <input
            id="group"
            type="text"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            placeholder="Введите группу или курс (необязательно)"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700 active:scale-[0.99] sm:flex-1"
          >
            Начать тест
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            Назад
          </button>
        </div>
      </form>
    </div>
  );
}

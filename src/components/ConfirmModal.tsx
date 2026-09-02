interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  submitting: boolean;
}

export default function ConfirmModal({ onConfirm, onCancel, submitting }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-bold text-slate-900">Завершить тест?</h3>
        <p className="mt-2 text-sm text-slate-500">
          Вы ответили на все вопросы. После завершения изменить ответы будет нельзя.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="w-full rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
          >
            {submitting ? 'Отправка…' : 'Завершить'}
          </button>
          <button
            onClick={onCancel}
            disabled={submitting}
            className="w-full rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 sm:w-auto"
          >
            Продолжить тест
          </button>
        </div>
      </div>
    </div>
  );
}

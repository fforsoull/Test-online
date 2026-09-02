interface Props {
  current: number; // номер текущего вопроса (с 1)
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
        <span>
          Вопрос {current} из {total}
        </span>
        <span className="text-brand-600">{percent}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

interface ProgressBarProps {
  /** 0 – 100 */
  value: number;
  label?: string;
  tone?: 'brand' | 'emerald';
  className?: string;
}

export function ProgressBar({ value, label, tone = 'brand', className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className={className}>
      {label ? (
        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-500">{label}</span>
          <span className="tabular-nums text-slate-700">{clamped}%</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-900/5"
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out ${
            tone === 'brand' ? 'from-primary-600 to-accent-500' : 'from-emerald-500 to-teal-400'
          }`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

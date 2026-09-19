import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}

/** Friendly placeholder when a collection has no items yet. */
export function EmptyState({ icon: Icon, title, hint, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500 ring-1 ring-primary-100 dark:bg-primary-500/10 dark:text-primary-300 dark:ring-primary-500/20">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">{title}</h3>
      {hint ? <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">{hint}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

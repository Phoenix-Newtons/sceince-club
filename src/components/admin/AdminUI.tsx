import type { ReactNode } from 'react';

/** Shared card wrapper for admin panels. */
export function AdminCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-700/60 dark:bg-slate-900">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Row wrapper for admin list items. */
export function AdminRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200/70 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950/50">
      {children}
    </div>
  );
}

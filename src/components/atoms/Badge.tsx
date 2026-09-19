import type { ReactNode } from 'react';

export type BadgeTone = 'live' | 'upcoming' | 'open' | 'neutral' | 'progress' | 'review' | 'recruiting' | 'done';

const TONES: Record<BadgeTone, { badge: string; dot: string }> = {
  live: {
    badge: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
    dot: 'bg-rose-500',
  },
  upcoming: {
    badge:
      'bg-primary-50 text-primary-700 ring-primary-200 dark:bg-primary-500/10 dark:text-primary-300 dark:ring-primary-500/30',
    dot: 'bg-primary-500',
  },
  open: {
    badge:
      'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  neutral: {
    badge:
      'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
    dot: 'bg-slate-400',
  },
  progress: {
    badge:
      'bg-primary-50 text-primary-700 ring-primary-200 dark:bg-primary-500/10 dark:text-primary-300 dark:ring-primary-500/30',
    dot: 'bg-primary-500',
  },
  review: {
    badge:
      'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
    dot: 'bg-amber-500',
  },
  recruiting: {
    badge:
      'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  done: {
    badge:
      'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
    dot: 'bg-slate-400',
  },
};

interface BadgeProps {
  tone?: BadgeTone;
  /** Render a leading status dot */
  dot?: boolean;
  /** Animate the dot with a ping */
  pulse?: boolean;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', dot = false, pulse = false, className = '', children }: BadgeProps) {
  const t = TONES[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-slate-900/5 dark:ring-white/5 ${t.badge} ${className}`}
    >
      {dot ? (
        <span className="relative flex h-2 w-2">
          {pulse ? (
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${t.dot}`} />
          ) : null}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${t.dot}`} />
        </span>
      ) : null}
      {children}
    </span>
  );
}

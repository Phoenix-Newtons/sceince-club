import type { AccentColor } from '../types';

export interface AccentStyle {
  /** Classes for a soft circular icon wrapper */
  wrap: string;
}

/**
 * Semantic accent styles — every accent resolves to a soft tinted background,
 * a matching text colour and a hairline ring, so icon wrappers stay
 * consistent across cards, tiles and badges in both light and dark mode.
 */
export const ACCENTS: Record<AccentColor, AccentStyle> = {
  indigo: {
    wrap:
      'bg-primary-50 text-primary-600 ring-primary-100 dark:bg-primary-500/10 dark:text-primary-300 dark:ring-primary-500/20',
  },
  cyan: {
    wrap:
      'bg-cyan-50 text-cyan-600 ring-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/20',
  },
  violet: {
    wrap:
      'bg-violet-50 text-violet-600 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/20',
  },
  emerald: {
    wrap:
      'bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
  },
  amber: {
    wrap:
      'bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20',
  },
  rose: {
    wrap:
      'bg-rose-50 text-rose-600 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20',
  },
};

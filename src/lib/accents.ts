import type { AccentColor } from '../types';

export interface AccentStyle {
  /** Classes for a soft circular icon wrapper */
  wrap: string;
}

/**
 * Semantic accent styles — every accent resolves to a soft tinted background,
 * a matching text colour and a hairline ring, so icon wrappers stay
 * consistent across cards, tiles and badges.
 */
export const ACCENTS: Record<AccentColor, AccentStyle> = {
  indigo: { wrap: 'bg-primary-50 text-primary-600 ring-primary-100' },
  cyan: { wrap: 'bg-cyan-50 text-cyan-600 ring-cyan-100' },
  violet: { wrap: 'bg-violet-50 text-violet-600 ring-violet-100' },
  emerald: { wrap: 'bg-emerald-50 text-emerald-600 ring-emerald-100' },
  amber: { wrap: 'bg-amber-50 text-amber-600 ring-amber-100' },
  rose: { wrap: 'bg-rose-50 text-rose-600 ring-rose-100' },
};

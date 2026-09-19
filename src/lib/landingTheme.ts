/**
 * Shared design tokens for the Nucleus landing experience.
 *
 * The landing page is a deliberately dark, "deep-space" surface that lives
 * alongside the portal's light/dark theme. Keeping the palette in one module
 * lets React (Tailwind arbitrary values), Three.js (colour constants) and the
 * preloader stay perfectly in sync.
 */

export const LANDING_COLORS = {
  /** Pure matte black — deepest background layer. */
  black: '#000000',
  /** Deep cosmic obsidian — primary landing background. */
  obsidian: '#0B0F19',
  /** Slightly lifted obsidian used for bento surfaces. */
  surface: '#111827',

  /** Electric neon blue. */
  neonBlue: '#38BDF8',
  electricBlue: '#4F7CFF',
  /** Vibrant quantum violet. */
  quantum: '#8B5CF6',
  quantumSoft: '#A78BFA',
  /** Ambient accent used sparingly for data highlights. */
  mint: '#34D399',
  /** Neutral text ramp. */
  text: '#E5E9F2',
  textMuted: '#8A93A8',
} as const;

export type LandingColorKey = keyof typeof LANDING_COLORS;

/**
 * CSS custom properties injected into the landing root so Tailwind utilities
 * and inline styles can both reference the palette.
 */
export const landingCssVars = {
  '--landing-bg': LANDING_COLORS.obsidian,
  '--landing-surface': LANDING_COLORS.surface,
  '--landing-neon': LANDING_COLORS.neonBlue,
  '--landing-quantum': LANDING_COLORS.quantum,
  '--landing-ink': LANDING_COLORS.text,
  '--landing-ink-muted': LANDING_COLORS.textMuted,
} as const;

/**
 * Size of the 3D logo's render surface, in CSS pixels. The WebGL canvas is
 * always rasterised at this resolution and then CSS-scaled by the flight
 * controller, so the glyph stays crisp from full-screen down to the 40 px
 * header slot — and never triggers a canvas resize mid-flight.
 */
export const LOGO_RENDER_SIZE = 300;

/** Height of the fixed landing header, in px (kept in sync with Tailwind h-16). */
export const HEADER_HEIGHT = 64;

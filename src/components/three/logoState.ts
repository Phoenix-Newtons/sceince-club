/**
 * Live, mutable state pushed into the 3D logo without triggering React renders.
 *
 * Deliberately dependency-free: `NucleusOrb` (which lives in the main bundle)
 * imports *only* this module, so Three.js and React Three Fiber stay inside
 * the lazy `NucleusLogoCanvas` chunk.
 */
export interface NucleusLogoState {
  /** 0 – 1 loading progress; drives spin rate, aura and electron energy. */
  progress: number;
  /** 0 – 1 reveal energy: eases the logo "up" as the preloader releases. */
  energy: number;
  /** Damped pointer parallax in normalised device coords (-1 – 1). */
  pointerX: number;
  pointerY: number;
}

export const createLogoState = (): NucleusLogoState => ({
  progress: 0,
  energy: 0,
  pointerX: 0,
  pointerY: 0,
});

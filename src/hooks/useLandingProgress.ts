import { useEffect, useRef, useState } from 'react';

/**
 * Real loading progress for the landing experience.
 *
 * Instead of a fake timer we track the work the page actually has to do before
 * it is worth showing:
 *
 *  1. the code-split 3D logo chunk (React.lazy import)
 *  2. the landing data prefetches (`/api/stats`, `/api/notices`, `/api/facts`)
 *  3. web-font readiness (Inter + JetBrains Mono)
 *  4. the first WebGL frame (reported by the canvas via `onFirstFrame`)
 *
 * Every signal is a "task" with a weight; the returned percentage is the
 * weighted completion ratio, smoothed with a critically-damped tween so the
 * counter never jumps backwards or stalls. A hard ceiling timer guarantees the
 * preloader always resolves (e.g. when the API server is offline).
 */

export interface LandingTask {
  id: string;
  /** Relative weight in the 0–100 total. */
  weight: number;
}

export const LANDING_TASKS: LandingTask[] = [
  { id: 'three-chunk', weight: 34 },
  { id: 'first-frame', weight: 18 },
  { id: 'api:stats', weight: 14 },
  { id: 'api:notices', weight: 14 },
  { id: 'api:facts', weight: 12 },
  { id: 'fonts', weight: 8 },
];

const TOTAL_WEIGHT = LANDING_TASKS.reduce((sum, task) => sum + task.weight, 0);

/** Longest the preloader will wait for stragglers before forcing 100%. */
const MAX_WAIT_MS = 6000;
/** Minimum time the logo stays centre-stage, so the reveal never feels like a glitch. */
const MIN_STAY_MS = 1500;

export interface UseLandingProgressResult {
  /** 0 – 100, smoothed. */
  progress: number;
  /** Mark a tracked task as finished. Safe to call more than once. */
  complete: (id: string) => void;
  /** True once progress has reached 100 and the minimum stay has elapsed. */
  ready: boolean;
}

export function useLandingProgress({
  minStayMs = MIN_STAY_MS,
  maxWaitMs = MAX_WAIT_MS,
}: {
  minStayMs?: number;
  maxWaitMs?: number;
} = {}): UseLandingProgressResult {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  const done = useRef<Set<string>>(new Set());
  const target = useRef(0);
  const shown = useRef(0);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = performance.now();
    let raf = 0;

    const tick = () => {
      // Exponential ease toward the real target — fast when far, gentle when close.
      const delta = target.current - shown.current;
      shown.current += Math.abs(delta) < 0.15 ? delta : delta * 0.11;

      const elapsed = performance.now() - startedAt.current;
      const stalled = elapsed > maxWaitMs;
      const value = stalled ? 100 : shown.current;

      setProgress(value);

      if (value >= 99.9 && elapsed >= minStayMs) {
        setReady(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [maxWaitMs, minStayMs]);

  const complete = (id: string) => {
    if (done.current.has(id)) return;
    done.current.add(id);
    let weight = 0;
    for (const task of LANDING_TASKS) {
      if (done.current.has(task.id)) weight += task.weight;
    }
    target.current = Math.min(100, (weight / TOTAL_WEIGHT) * 100);
  };

  return { progress, complete, ready };
}

/** Prefetches the landing's public JSON endpoints and resolves either way. */
export async function prefetchLandingData(id: string): Promise<void> {
  try {
    await fetch(`/api/${id}`, { headers: { Accept: 'application/json' } });
  } catch {
    /* Offline is fine — the landing page renders its fallbacks. */
  }
}

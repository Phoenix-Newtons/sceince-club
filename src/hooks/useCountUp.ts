import { useEffect, useRef, useState } from 'react';

/**
 * Eased count-up for stat readouts. Starts when the element scrolls into view
 * (IntersectionObserver) and respects `prefers-reduced-motion` by jumping
 * straight to the final value.
 */
export function useCountUp(
  value: number | null | undefined,
  { duration = 1400 }: { duration?: number } = {},
): { ref: React.RefObject<HTMLElement | null>; display: string } {
  const ref = useRef<HTMLElement | null>(null);
  const [display, setDisplay] = useState('0');
  const started = useRef(false);

  useEffect(() => {
    if (value === null || value === undefined) return;
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplay(String(value));
      return;
    }

    let raf = 0;
    let start = 0;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const step = (now: number) => {
        if (!start) start = now;
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(String(Math.round(value * eased)));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [duration, value]);

  return { ref, display };
}

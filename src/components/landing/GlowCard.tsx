import { useCallback, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  /** Accent used for the cursor-following border glow, as a CSS colour. */
  glow?: string;
  /** Stagger delay for the reveal animation, in seconds. */
  delay?: number;
  as?: 'div' | 'article' | 'li' | 'section';
}

/**
 * Bento surface with cursor-proximity lighting.
 *
 * Pointer position is written straight to CSS custom properties on the
 * element (`--mx` / `--my`) — no React state, no re-render — and two layers
 * read them: an outer gradient *border* (a 1px ring masked to the edge) and
 * a soft inner wash. Both fall off with distance so cards only light up when
 * the cursor is genuinely near them.
 */
export function GlowCard({
  children,
  className = '',
  glow = '#38BDF8',
  delay = 0,
  as = 'div',
}: GlowCardProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const mx = event.clientX - rect.left;
      const my = event.clientY - rect.top;
      node.style.setProperty('--mx', `${mx}px`);
      node.style.setProperty('--my', `${my}px`);
      const distance = Math.hypot(mx - rect.width / 2, my - rect.height / 2);
      const proximity = Math.max(0, 1 - distance / (Math.hypot(rect.width, rect.height) / 1.35));
      node.style.setProperty('--proximity', proximity.toFixed(3));
      node.style.setProperty('--tilt-x', `${((my / rect.height) * 2 - 1) * -2.2}deg`);
      node.style.setProperty('--tilt-y', `${((mx / rect.width) * 2 - 1) * 2.6}deg`);
    },
    [],
  );

  const handleLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty('--proximity', '0');
    node.style.setProperty('--tilt-x', '0deg');
    node.style.setProperty('--tilt-y', '0deg');
  }, []);

  // `motion[as]` resolves to a union of components; widen it so the shared
  // pointer handlers and ref type-check for every permitted tag.
  const MotionTag = motion[as] as unknown as React.ComponentType<Record<string, unknown>>;

  return (
    <MotionTag
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      initial={reduced ? false : { opacity: 0, y: 26 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      style={
        {
          '--mx': '50%',
          '--my': '50%',
          '--proximity': 0,
          '--tilt-x': '0deg',
          '--tilt-y': '0deg',
          transform: reduced
            ? undefined
            : 'perspective(1000px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y))',
          transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        } as React.CSSProperties
      }
      className={`group relative isolate overflow-hidden rounded-[26px] bg-[#0E1424]/80 ring-1 ring-white/[0.07] transition-shadow duration-500 hover:shadow-[0_24px_60px_-24px_rgba(56,189,248,0.35)] ${className}`}
    >
      {/* Cursor-following gradient border (masked to a 1px ring) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[calc(var(--proximity)*1)] transition-opacity duration-300"
        style={{
          padding: 1,
          background: `radial-gradient(320px circle at var(--mx) var(--my), ${glow}, transparent 68%)`,
          mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />

      {/* Soft interior wash */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[calc(var(--proximity)*0.55)] transition-opacity duration-300"
        style={{
          background: `radial-gradient(360px circle at var(--mx) var(--my), ${glow}22, transparent 60%)`,
        }}
      />

      {/* Hairline sheen across the top edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-60"
      />

      <div className="relative h-full">{children}</div>
    </MotionTag>
  );
}

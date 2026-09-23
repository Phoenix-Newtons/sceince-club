import { useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

type MagneticProps<T extends ElementType> = {
  as?: T;
  /** How far the button travels toward the cursor, in px. */
  strength?: number;
  /** Radius around the button that "grabs" the cursor, in px. */
  radius?: number;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'className' | 'children'>;

/**
 * Magnetic CTA. The whole element drifts toward the pointer inside a capture
 * radius, the label drifts a little further (parallax), and a specular sheen
 * tracks the cursor. Springs do the easing, so release snaps back naturally.
 *
 * Polymorphic: render as <button> (default) or as a router <Link>/anchor.
 */
export function MagneticButton<T extends ElementType = 'button'>({
  as,
  strength = 14,
  radius = 90,
  children,
  className = '',
  ...rest
}: MagneticProps<T>) {
  const tag = as ?? 'button';
  const isButton = tag === 'button';
  // Widen the polymorphic tag: JSX props for an unresolved generic collapse
  // to `never`, so type the rendered element as a plain permissive component.
  const Component = tag as unknown as React.ComponentType<Record<string, unknown>>;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

  const labelX = useTransform(springX, (v) => v * 0.45);
  const labelY = useTransform(springY, (v) => v * 0.45);
  const sheenX = useTransform(springX, [-strength, strength], ['18%', '82%']);
  const sheenY = useTransform(springY, [-strength, strength], ['20%', '80%']);

  const handleMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);
    const falloff = Math.max(0, 1 - distance / (Math.max(rect.width, rect.height) / 2 + radius));
    x.set((dx / (Math.max(rect.width, rect.height) / 2 + radius)) * strength * (0.4 + falloff));
    y.set((dy / (Math.max(rect.width, rect.height) / 2 + radius)) * strength * (0.4 + falloff));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Component
      ref={ref}
      {...(isButton ? { type: 'button' } : null)}
      className={`group relative isolate inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-[box-shadow,background-color,border-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#38BDF8] ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onBlur={reset}
      {...rest}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(180px circle at var(--mx, 50%) var(--my, 50%), rgba(56,189,248,0.28), transparent 62%)',
          x: sheenX,
          y: sheenY,
        }}
      />
      <motion.span className="relative z-10 inline-flex items-center gap-2" style={{ x: labelX, y: labelY }}>
        {children}
      </motion.span>
    </Component>
  );
}

import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { createLogoState } from '../three/logoState';
import { LogoMark } from './LogoMark';
import { LOGO_RENDER_SIZE } from '../../lib/landingTheme';

/**
 * The Three.js logo is code-split behind a dynamic import. `loadLogoChunk`
 * memoises the promise so the preloader can prefetch it, measure real progress
 * against it, and `<Suspense>` can render the same promise later.
 */
let logoChunk: Promise<typeof import('../three/NucleusLogoCanvas')> | null = null;

export function loadLogoChunk(): Promise<typeof import('../three/NucleusLogoCanvas')> {
  if (!logoChunk) logoChunk = import('../three/NucleusLogoCanvas');
  return logoChunk;
}

const NucleusLogoCanvas = lazy(() => loadLogoChunk());

export type OrbPhase = 'loading' | 'flying' | 'docked';

interface Frame {
  x: number;
  y: number;
  scale: number;
}

/** Centre-of-viewport frame, sized responsively. */
function loadingFrame(): Frame {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0, scale: 1 };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const size = Math.min(Math.max(Math.min(vw, vh) * 0.74, 200), 420);
  return {
    x: (vw - LOGO_RENDER_SIZE) / 2,
    y: (vh - LOGO_RENDER_SIZE) / 2 - Math.min(24, vh * 0.03),
    scale: size / LOGO_RENDER_SIZE,
  };
}

/** Frame that parks the logo inside an element's box (the header slot). */
function dockedFrame(slot: HTMLElement | null): Frame | null {
  if (!slot) return null;
  const rect = slot.getBoundingClientRect();
  if (rect.width === 0) return null;
  return {
    x: rect.left + (rect.width - LOGO_RENDER_SIZE) / 2,
    y: rect.top + (rect.height - LOGO_RENDER_SIZE) / 2,
    scale: rect.width / LOGO_RENDER_SIZE,
  };
}

const FLIGHT_EASE = [0.66, 0, 0.16, 1] as const;

interface NucleusOrbProps {
  phase: OrbPhase;
  /** Element the logo flies into (the header's brand slot). */
  slotRef: React.RefObject<HTMLElement | null>;
  /** Called once the first WebGL frame is on screen. */
  onFirstFrame?: () => void;
  /** Called when the code-split Three.js chunk resolves. */
  onChunkReady?: () => void;
}

/**
 * The single, always-mounted 3D logo.
 *
 * It never unmounts between the preloader and the header — it *flies*. One
 * WebGL context, one scene: the canvas is rasterised at a fixed
 * `LOGO_RENDER_SIZE` and CSS-scaled from full-screen down to the 40 px header
 * slot, so the transition is seamless and there is no resize thrash mid-flight.
 */
export function NucleusOrb({ phase, slotRef, onFirstFrame, onChunkReady }: NucleusOrbProps) {
  const reduced = useReducedMotion();
  const stateRef = useRef(createLogoState());
  const [frame, setFrame] = useState<Frame>(loadingFrame);
  const [spin, setSpin] = useState<number | number[]>(0);
  const [chunkFailed, setChunkFailed] = useState(false);
  const hasFlown = useRef(false);
  const hasFlownSpun = useRef(false);

  /* --- keep the pointer-parallax state fed (damped, allocation-free) --- */
  useEffect(() => {
    if (phase !== 'loading') return;
    const onMove = (event: PointerEvent) => {
      stateRef.current.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      stateRef.current.pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [phase]);

  /* --- reveal energy: the logo "powers up" when loading completes --- */
  useEffect(() => {
    stateRef.current.energy = phase === 'loading' ? 0 : 1;
  }, [phase]);

  /* --- re-centre while loading, re-dock on resize afterwards --- */
  useEffect(() => {
    const sync = () => {
      if (phase === 'loading' || !hasFlown.current) {
        setFrame(loadingFrame());
        return;
      }
      const next = dockedFrame(slotRef.current);
      if (next) setFrame(next);
    };
    sync();
    window.addEventListener('resize', sync);
    window.addEventListener('scroll', sync, { passive: true });
    return () => {
      window.removeEventListener('resize', sync);
      window.removeEventListener('scroll', sync);
    };
  }, [phase, slotRef]);

  /* --- the flight itself --- */
  useEffect(() => {
    if (phase === 'loading') return;
    const attempt = () => {
      const next = dockedFrame(slotRef.current);
      if (!next) {
        // Header slot not laid out yet — try again next frame.
        requestAnimationFrame(attempt);
        return;
      }
      hasFlown.current = true;
      setFrame(next);
      if (!hasFlownSpun.current) {
        hasFlownSpun.current = true;
        setSpin(reduced ? 360 : [0, 205, 360]);
      }
    };
    attempt();
  }, [phase, reduced, slotRef]);

  const handleChunk = useCallback(() => {
    onChunkReady?.();
  }, [onChunkReady]);

  useEffect(() => {
    let alive = true;
    loadLogoChunk()
      .then(() => {
        if (alive) handleChunk();
      })
      .catch(() => {
        if (alive) setChunkFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [handleChunk]);

  const transition = useMemo(
    () =>
      reduced
        ? { duration: 0 }
        : {
            x: { duration: 1.25, ease: FLIGHT_EASE },
            y: { duration: 1.25, ease: FLIGHT_EASE },
            scale: { duration: 1.25, ease: FLIGHT_EASE },
            rotate: { duration: 1.4, ease: FLIGHT_EASE },
          },
    [reduced],
  );

  const docked = phase === 'docked';

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70]"
      style={{
        width: LOGO_RENDER_SIZE,
        height: LOGO_RENDER_SIZE,
        willChange: 'transform',
        transformOrigin: 'center center',
      }}
      animate={{ x: frame.x, y: frame.y, scale: frame.scale, rotate: spin }}
      transition={transition}
    >
      {/* Ambient bloom that travels with the logo, then fades once docked. */}
      <motion.div
        className="absolute inset-[-45%] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(56,189,248,0.22) 0%, rgba(139,92,246,0.16) 38%, rgba(11,15,25,0) 68%)',
          filter: 'blur(6px)',
        }}
        animate={{ opacity: docked ? 0.35 : 1, scale: docked ? 0.7 : 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />

      <div className="relative h-full w-full">
        <Suspense fallback={<LogoMark className="h-full w-full opacity-90" />}>
          {chunkFailed ? (
            <LogoMark className="h-full w-full" />
          ) : (
            <NucleusLogoCanvas
              stateRef={stateRef}
              reduced={Boolean(reduced)}
              compact={docked}
              onFirstFrame={onFirstFrame}
            />
          )}
        </Suspense>
      </div>
    </motion.div>
  );
}

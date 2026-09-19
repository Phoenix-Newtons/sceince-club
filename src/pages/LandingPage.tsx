import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { NucleusOrb, type OrbPhase } from '../components/landing/NucleusOrb';
import { PreloaderOverlay } from '../components/landing/Preloader';
import { LandingHeader } from '../components/landing/LandingHeader';
import { LandingHero } from '../components/landing/LandingHero';
import { BentoGrid } from '../components/landing/BentoGrid';
import { LandingCta } from '../components/landing/LandingCta';
import { Container } from '../components/atoms/Container';
import { useJoinModal } from '../context/JoinModalContext';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { prefetchLandingData, useLandingProgress } from '../hooks/useLandingProgress';
import { landingCssVars, LANDING_COLORS } from '../lib/landingTheme';

/**
 * The landing experience.
 *
 * Boot sequence:
 *  1. `useLandingProgress` tracks the real work — Three.js chunk, first WebGL
 *     frame, the three public API calls and web-font readiness.
 *  2. `NucleusOrb` mounts the 3D logo centre-screen; it *is* the loader
 *     (rings accelerate, aura expands with the counter).
 *  3. At 100% the overlay splits away and the very same canvas flies into the
 *     header slot — no remount, no second WebGL context.
 */
export function LandingPage() {
  const { open } = useJoinModal();
  const reduced = useReducedMotion();
  const slotRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<OrbPhase>('loading');

  const { progress, complete, ready } = useLandingProgress({
    // Reduced-motion users should never be held behind a loading animation.
    minStayMs: reduced ? 0 : 1500,
    maxWaitMs: reduced ? 2500 : 6000,
  });

  useLockBodyScroll(phase !== 'docked');

  /* Real signals: API prefetch + font readiness. */
  useEffect(() => {
    void prefetchLandingData('stats').then(() => complete('api:stats'));
    void prefetchLandingData('notices').then(() => complete('api:notices'));
    void prefetchLandingData('facts').then(() => complete('api:facts'));

    let alive = true;
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready
        .then(() => {
          if (alive) complete('fonts');
        })
        .catch(() => {
          if (alive) complete('fonts');
        });
    } else {
      complete('fonts');
    }
    return () => {
      alive = false;
    };
  }, [complete]);

  /* Ready → release the overlay and start the flight. */
  useEffect(() => {
    if (ready) setPhase('flying');
  }, [ready]);

  return (
    <div
      className="relative min-h-dvh overflow-x-clip text-white antialiased"
      style={{ backgroundColor: LANDING_COLORS.black, ...landingCssVars }}
    >
      <NucleusOrb
        phase={phase}
        slotRef={slotRef}
        onFirstFrame={() => complete('first-frame')}
        onChunkReady={() => complete('three-chunk')}
      />

      <PreloaderOverlay progress={progress} ready={ready} onDismissed={() => setPhase('docked')} />

      <LandingHeader ref={slotRef} hidden={phase === 'loading'} onJoin={open} />

      <motion.main
        id="main"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: phase === 'loading' ? 0 : 1 }}
        transition={{ duration: reduced ? 0 : 0.7, ease: 'easeOut' }}
        className="relative"
      >
        <LandingHero onJoin={open} active={phase !== 'loading'} />
        <BentoGrid onJoin={open} />
        <LandingCta onJoin={open} />

        <footer className="relative border-t border-white/[0.07] py-12">
          <Container className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/70">Nucleus</p>
              <p className="mt-1.5 text-xs text-white/35">
                BSSM Science Club · student-run research, observing and robotics.
              </p>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">
              © {new Date().getFullYear()} Nucleus — built by members
            </p>
          </Container>
        </footer>
      </motion.main>
    </div>
  );
}

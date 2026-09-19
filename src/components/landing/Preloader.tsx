import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LANDING_COLORS } from '../../lib/landingTheme';

const PHASES = [
  'Initialising core',
  'Calibrating optics',
  'Syncing lab telemetry',
  'Charging electron rings',
  'Opening the aperture',
];

interface PreloaderProps {
  /** 0 – 100 real loading progress. */
  progress: number;
  /** True when loading finished — triggers the split-and-reveal exit. */
  ready: boolean;
  /** Fired when the overlay has fully cleared, so the flight can finish. */
  onDismissed: () => void;
}

/**
 * Full-screen preloader. The 3D logo lives *above* this overlay (it is the
 * loader), so all that remains here is atmosphere: an obsidian stage that
 * splits in half and slides away the moment progress hits 100%.
 */
export function PreloaderOverlay({ progress, ready, onDismissed }: PreloaderProps) {
  const reduced = useReducedMotion();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const percent = Math.min(100, Math.round(progress));

  useEffect(() => {
    setPhaseIndex(Math.min(PHASES.length - 1, Math.floor((percent / 100) * PHASES.length)));
  }, [percent]);

  const halfTransition = reduced
    ? { duration: 0.25, ease: 'easeOut' as const }
    : { duration: 1.05, ease: [0.76, 0, 0.24, 1] as const };

  return (
    <>
    <AnimatePresence onExitComplete={onDismissed}>
      {!ready && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[60] overflow-hidden"
          style={{ backgroundColor: LANDING_COLORS.black }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 1, transition: { duration: 0 } }}
          aria-hidden="true"
        >
          {/* Top half */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2"
            style={{
              background: `linear-gradient(180deg, ${LANDING_COLORS.black} 0%, ${LANDING_COLORS.obsidian} 100%)`,
            }}
            exit={{ y: '-102%' }}
            transition={halfTransition}
          />
          {/* Bottom half */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{
              background: `linear-gradient(0deg, ${LANDING_COLORS.black} 0%, ${LANDING_COLORS.obsidian} 100%)`,
            }}
            exit={{ y: '102%' }}
            transition={halfTransition}
          />

          {/* Atmosphere: grid + ambient glows, clipped to the panels above */}
          <motion.div
            className="absolute inset-0"
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.5 }}
          >
            <div
              className="absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(56,189,248,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.35) 1px, transparent 1px)',
                backgroundSize: '72px 72px',
                maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 72%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 72%)',
              }}
            />
            <div className="absolute left-1/2 top-1/2 h-[62vmin] w-[62vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#38BDF8]/[0.09] blur-[110px]" />
            <div className="absolute left-1/2 top-[58%] h-[42vmin] w-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B5CF6]/[0.12] blur-[130px]" />
          </motion.div>

          {/* HUD: corner ticks */}
          <div className="absolute inset-0 hidden sm:block">
            {(['left-6 top-6', 'right-6 top-6', 'bottom-6 left-6', 'bottom-6 right-6'] as const).map((pos) => (
              <span
                key={pos}
                className={`absolute h-6 w-6 border-white/15 ${pos} ${
                  pos.includes('top') ? 'border-t' : 'border-b'
                } ${pos.includes('left') ? 'border-l' : 'border-r'}`}
              />
            ))}
          </div>

          {/* Readout */}
          <motion.div
            className="absolute inset-x-0 bottom-[14%] flex flex-col items-center gap-4 px-6"
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: reduced ? 0.15 : 0.4 }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.42em] text-white/45">
              {PHASES[phaseIndex]}
            </p>

            <p className="font-mono text-[clamp(2.25rem,7vw,3.75rem)] font-light leading-none tabular-nums text-white">
              {String(percent).padStart(3, '0')}
              <span className="ml-1 align-top text-[0.4em] text-[#38BDF8]">%</span>
            </p>

            <div className="h-px w-[min(22rem,72vw)] overflow-hidden bg-white/10">
              <motion.div
                className="h-full origin-left bg-gradient-to-r from-[#38BDF8] via-[#4F7CFF] to-[#A78BFA]"
                style={{ width: `${percent}%` }}
              />
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/30">
              Nucleus · BSSM Science Club
            </p>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>

      {/* Live progress for assistive tech — deliberately outside the
          aria-hidden stage so it stays in the accessibility tree. */}
      {!ready && (
        <div
          role="progressbar"
          aria-live="polite"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Loading Nucleus"
          className="sr-only"
        >
          {`${percent}%`}
        </div>
      )}
    </>
  );
}

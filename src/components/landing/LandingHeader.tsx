import { forwardRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { Container } from '../atoms/Container';
import { NAV_LINKS } from '../../data/navigation';
import { HEADER_HEIGHT } from '../../lib/landingTheme';

interface LandingHeaderProps {
  /** True while the preloader still owns the screen. */
  hidden: boolean;
  onJoin: () => void;
}

/**
 * Fixed landing header. Its brand area is an empty, measured slot — the 3D
 * Nucleus logo flies into it from the centre of the screen (see `NucleusOrb`).
 */
export const LandingHeader = forwardRef<HTMLDivElement, LandingHeaderProps>(function LandingHeader(
  { hidden, onJoin },
  slotRef,
) {
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawer(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawer]);

  return (
    <>
      <motion.header
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: -14 }}
        animate={{ opacity: hidden ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: hidden ? 0 : 0.15 }}
        style={{ height: HEADER_HEIGHT }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? 'border-b border-white/[0.08] bg-[#05070D]/80 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <Container className="flex h-full items-center justify-between gap-4">
          {/* Brand: the 3D logo docks here */}
          <Link to="/" className="flex items-center gap-3" aria-label="Nucleus — home">
            <span
              ref={slotRef}
              className="relative block h-10 w-10 shrink-0 rounded-full"
              aria-hidden="true"
            />
            <span className="leading-tight">
              <span className="block font-mono text-sm font-semibold uppercase tracking-[0.24em] text-white">
                Nucleus
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                BSSM Science Club
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_LINKS.filter((link) => link.to !== '/admin').map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group relative rounded-full px-4 py-2 text-sm font-medium text-white/60 transition-colors duration-200 hover:text-white"
              >
                {link.label}
                <span className="absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-[#38BDF8] to-[#A78BFA] transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <MagneticButton
              onClick={onJoin}
              strength={10}
              className="hidden h-10 px-5 text-sm text-white ring-1 ring-[#38BDF8]/40 bg-gradient-to-r from-[#38BDF8]/15 to-[#8B5CF6]/15 hover:ring-[#38BDF8]/80 sm:inline-flex"
            >
              Join the Club
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/70 ring-1 ring-white/10 transition-colors hover:text-white hover:ring-white/25 md:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </Container>
      </motion.header>

      <AnimatePresence>
        {drawer && (
          <motion.div
            className="fixed inset-0 z-[55] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawer(false)}
              className="absolute inset-0 h-full w-full bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="relative border-b border-white/10 bg-[#0B0F19]/95 px-6 pb-8 pt-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">Navigate</span>
                <button
                  type="button"
                  onClick={() => setDrawer(false)}
                  aria-label="Close menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/70 ring-1 ring-white/10"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <nav className="mt-5 flex flex-col" aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setDrawer(false)}
                    className="flex items-center justify-between border-b border-white/[0.06] py-3.5 text-base font-medium text-white/80"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
                  </Link>
                ))}
              </nav>
              <MagneticButton
                onClick={() => {
                  setDrawer(false);
                  onJoin();
                }}
                className="mt-6 h-12 w-full text-base text-white ring-1 ring-[#38BDF8]/40 bg-gradient-to-r from-[#38BDF8]/20 to-[#8B5CF6]/20"
              >
                Join the Club
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

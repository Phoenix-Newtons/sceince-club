import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Orbit } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { Container } from '../atoms/Container';

/** Closing call-to-action band with an orbiting accent sweep. */
export function LandingCta({ onJoin }: { onJoin: () => void }) {
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[58vmin] w-[58vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4F7CFF]/[0.12] blur-[130px]" />
      </div>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#0B1120]/70 px-6 py-14 text-center backdrop-blur-xl sm:px-12 sm:py-20"
        >
          {/* Orbiting sweep */}
          <motion.span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(56,189,248,0.16) 70deg, rgba(167,139,250,0.18) 130deg, transparent 210deg)',
            }}
            animate={reduced ? undefined : { rotate: 360 }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-px rounded-[31px] bg-[#070B14]/90"
            style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)' }}
          />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
              <Orbit className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
              Enrolment open · grades 9–12
            </span>

            <h2 className="mx-auto mt-7 max-w-3xl text-[clamp(2rem,6vw,3.75rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-white">
              Bring a question.{' '}
              <span className="bg-gradient-to-r from-[#7DD3FC] via-[#4F7CFF] to-[#C4B5FD] bg-clip-text text-transparent">
                We&apos;ll bring the lab.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/50">
              No prior experience required — just curiosity, and the willingness to write down what you
              actually measured.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton
                onClick={onJoin}
                className="h-14 px-9 text-base text-[#04121C] bg-gradient-to-r from-[#7DD3FC] via-[#38BDF8] to-[#4F7CFF] shadow-[0_18px_50px_-18px_rgba(56,189,248,0.85)]"
              >
                Join Nucleus
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </MagneticButton>
              <MagneticButton
                as="a"
                href="/events"
                className="h-14 px-9 text-base text-white/85 ring-1 ring-white/15 hover:text-white hover:ring-white/35"
              >
                See the calendar
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

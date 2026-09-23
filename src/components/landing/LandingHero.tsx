import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, FlaskConical, Orbit, Radio } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { Container } from '../atoms/Container';
import { LogoMark } from './LogoMark';
import type { Fact, Notice, Stats } from '../../types';
import { useApi } from '../../hooks/useApi';

const HEADLINE = 'NUCLEUS';

/**
 * Per-letter staggered reveal driven by an IntersectionObserver
 * (`whileInView`), so the wordmark animates the first time it enters the
 * viewport — including after the preloader releases the scroll lock.
 */
function GradientHeadline({ text, className = '' }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  const letters = text.split('');

  return (
    <span className={className} aria-hidden="true">
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          aria-hidden="true"
          className="inline-block will-change-transform"
          initial={reduced ? false : { opacity: 0, y: '0.45em', rotateX: 62, filter: 'blur(10px)' }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: reduced ? 0 : 0.9,
            delay: reduced ? 0 : index * 0.075,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            backgroundImage: 'linear-gradient(104deg, #EAF6FF 0%, #7DD3FC 26%, #4F7CFF 54%, #A78BFA 78%, #F0ABFC 100%)',
            backgroundSize: '220% 220%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            animation: reduced ? undefined : 'nucleus-gradient-drift 14s ease-in-out infinite',
          }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

function LivePill({ stats }: { stats: Stats | null }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34D399]" />
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
        {stats ? `${stats.members} members online · lab open` : 'Lab status · syncing'}
      </span>
    </span>
  );
}

interface LandingHeroProps {
  onJoin: () => void;
  /** Delay the hero entrance until the preloader has cleared. */
  active: boolean;
}

export function LandingHero({ onJoin, active }: LandingHeroProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const driftY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const fadeOut = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const { data: stats } = useApi<Stats>('/stats');
  const { data: notices } = useApi<Notice[]>('/notices');
  const { data: facts } = useApi<Fact[]>('/facts');

  const nextEvent = notices?.find((notice) => !notice.featured) ?? notices?.[0];
  const fact = facts?.[0];

  const [typedIndex, setTypedIndex] = useState(0);
  const taglines = ['Bench science', 'Deep-sky observing', 'Competition robotics', 'Open data'];

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setTypedIndex((i) => (i + 1) % taglines.length), 2600);
    return () => window.clearInterval(timer);
  }, [active, taglines.length]);

  const reveal = (delay: number) => ({
    initial: reduced || !active ? false : { opacity: 0, y: 28 },
    animate: { opacity: active ? 1 : 0, y: 0 },
    transition: { duration: reduced ? 0 : 0.85, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden pt-[calc(64px+6.5rem)] pb-24 sm:pb-32"
    >
      {/* Ambient cosmic field */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          style={{ y: driftY }}
          className="absolute left-1/2 top-[-18vh] h-[70vmin] w-[70vmin] -translate-x-1/2 rounded-full bg-[#38BDF8]/[0.10] blur-[130px]"
        />
        <div className="absolute right-[-10vw] top-[38vh] h-[46vmin] w-[46vmin] rounded-full bg-[#8B5CF6]/[0.14] blur-[140px]" />
        <div className="absolute left-[-12vw] bottom-[-10vh] h-[42vmin] w-[42vmin] rounded-full bg-[#4F7CFF]/[0.10] blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)',
            backgroundSize: '88px 88px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black, transparent 78%)',
          }}
        />
      </div>

      <Container className="relative">
        <motion.div style={{ opacity: fadeOut }} className="mx-auto max-w-4xl text-center">
          <motion.div {...reveal(0.05)} className="flex justify-center">
            <LivePill stats={stats} />
          </motion.div>

          <h1
            aria-label={HEADLINE}
            className="mt-8 text-[clamp(3.25rem,15vw,10.5rem)] font-extrabold leading-[0.86] tracking-[-0.045em]"
          >
            <GradientHeadline text={HEADLINE} />
          </h1>

          <motion.p
            {...reveal(0.5)}
            className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-relaxed text-white/60 sm:text-xl"
          >
            The BSSM Science Club — where student researchers run real experiments, publish open data and
            take ideas from a notebook sketch to a working instrument.
          </motion.p>

          <motion.div {...reveal(0.62)} className="mt-6 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-white/35">
            <span className="h-px w-10 bg-white/15" />
            <span className="relative h-5 overflow-hidden">
              <motion.span
                key={typedIndex}
                initial={reduced ? false : { y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center text-[#7DD3FC]"
              >
                {taglines[typedIndex]}
              </motion.span>
            </span>
            <span className="h-px w-10 bg-white/15" />
          </motion.div>

          <motion.div {...reveal(0.74)} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              onClick={onJoin}
              className="h-14 px-8 text-base text-[#04121C] bg-gradient-to-r from-[#7DD3FC] via-[#38BDF8] to-[#4F7CFF] shadow-[0_18px_50px_-18px_rgba(56,189,248,0.85)]"
            >
              <Radio className="h-4 w-4" aria-hidden="true" />
              Join the Club
            </MagneticButton>
            <MagneticButton
              as="a"
              href="/projects"
              className="h-14 px-8 text-base text-white/85 ring-1 ring-white/15 hover:text-white hover:ring-[#A78BFA]/50"
            >
              <FlaskConical className="h-4 w-4 text-[#A78BFA]" aria-hidden="true" />
              Explore Projects
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>
          </motion.div>

          {/* Instrument readout strip */}
          <motion.div
            {...reveal(0.86)}
            className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] sm:grid-cols-4"
          >
            {[
              { label: 'Members', value: stats?.members ?? null },
              { label: 'Live projects', value: stats?.projects ?? null },
              { label: 'Notices', value: stats?.notices ?? null },
              { label: 'Lab index', value: stats?.facts ?? null },
            ].map((item) => (
              <div key={item.label} className="bg-[#080C15]/70 px-4 py-5 text-center">
                <p className="font-mono text-2xl font-light tabular-nums text-white">
                  {item.value === null ? <span className="text-white/25">··</span> : item.value}
                </p>
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>

      {/* Floating context chips */}
      <motion.div
        initial={reduced || !active ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: active ? 1 : 0, y: 0 }}
        transition={{ duration: 0.8, delay: reduced ? 0 : 1 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center gap-4 px-6 lg:flex"
      >
        {nextEvent ? (
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md">
            <Orbit className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
            <span className="text-xs font-medium text-white/70">
              Next: {nextEvent.title} · {nextEvent.dateLabel}
            </span>
          </span>
        ) : null}
        {fact ? (
          <span className="flex max-w-md items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A78BFA]" />
            <span className="truncate text-xs font-medium text-white/55">{fact.fact}</span>
          </span>
        ) : null}
      </motion.div>

      {/* Decorative mark, visible if WebGL is unavailable */}
      <noscript>
        <LogoMark className="mx-auto h-24 w-24" />
      </noscript>
    </section>
  );
}

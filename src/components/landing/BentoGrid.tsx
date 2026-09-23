import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  CalendarCheck2,
  FlaskConical,
  Microscope,
  Orbit,
  Satellite,
  Telescope,
} from 'lucide-react';
import { GlowCard } from './GlowCard';
import { MagneticButton } from './MagneticButton';
import { Container } from '../atoms/Container';
import { useCountUp } from '../../hooks/useCountUp';
import { useApi } from '../../hooks/useApi';
import type { Fact, Notice, Project, Stats } from '../../types';

const ACCENTS = {
  neon: '#38BDF8',
  quantum: '#A78BFA',
  blue: '#4F7CFF',
  mint: '#34D399',
} as const;

/* ------------------------------------------------------------------ *
 * Small building blocks
 * ------------------------------------------------------------------ */

function CardLabel({ children, tone = ACCENTS.neon }: { children: React.ReactNode; tone?: string }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tone }} />
      {children}
    </p>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-4 text-xl font-bold tracking-tight text-white sm:text-2xl">{children}</h3>;
}

function CardBody({ children }: { children: React.ReactNode }) {
  return <p className="mt-2.5 text-sm leading-relaxed text-white/50">{children}</p>;
}

function Metric({
  value,
  label,
  suffix,
  tone = '#FFFFFF',
}: {
  value: number | null;
  label: string;
  suffix?: string;
  tone?: string;
}) {
  const { ref, display } = useCountUp(value);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="min-w-0">
      <p className="font-mono text-3xl font-light tabular-nums" style={{ color: tone }}>
        {value === null ? '··' : display}
        {suffix ? <span className="ml-0.5 text-base text-white/35">{suffix}</span> : null}
      </p>
      <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">{label}</p>
    </div>
  );
}

/** SVG telemetry trace — deterministic pseudo-data so it renders without I/O. */
function TelemetryTrace({ tone = ACCENTS.neon }: { tone?: string }) {
  const reduced = useReducedMotion();
  const points = [8, 22, 15, 34, 27, 46, 38, 58, 49, 66, 57, 72, 64, 84];
  const width = 240;
  const height = 72;
  const step = width / (points.length - 1);
  const path = points
    .map((value, index) => `${index === 0 ? 'M' : 'L'}${(index * step).toFixed(1)},${(height - (value / 100) * height).toFixed(1)}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-5 h-[72px] w-full" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id="telemetry-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.32" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${width},${height} L0,${height} Z`} fill="url(#telemetry-fill)" />
      <motion.path
        d={path}
        fill="none"
        stroke={tone}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0, opacity: 0.2 }}
        whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduced ? 0 : 1.8, ease: 'easeInOut' }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Grid
 * ------------------------------------------------------------------ */

interface BentoGridProps {
  onJoin: () => void;
}

export function BentoGrid({ onJoin }: BentoGridProps) {
  const { data: stats } = useApi<Stats>('/stats');
  const { data: projects } = useApi<Project[]>('/projects');
  const { data: notices } = useApi<Notice[]>('/notices');
  const { data: facts } = useApi<Fact[]>('/facts');

  const liveProjects = (projects ?? []).slice(0, 3);
  const registrations = (notices ?? []).filter((notice) => notice.status === 'registration' || notice.seatsLeft !== undefined).slice(0, 3);
  const fact = facts?.[1] ?? facts?.[0];

  return (
    <section className="relative isolate py-24 sm:py-32" aria-labelledby="bento-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-[12%] h-[38vmin] w-[38vmin] rounded-full bg-[#4F7CFF]/[0.09] blur-[140px]" />
        <div className="absolute bottom-[6%] right-[4%] h-[42vmin] w-[42vmin] rounded-full bg-[#8B5CF6]/[0.10] blur-[150px]" />
      </div>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <CardLabel tone={ACCENTS.quantum}>The club, at a glance</CardLabel>
          <h2
            id="bento-heading"
            className="mt-4 text-[clamp(2rem,5.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white"
          >
            Six instruments.{' '}
            <span className="bg-gradient-to-r from-[#7DD3FC] via-[#4F7CFF] to-[#A78BFA] bg-clip-text text-transparent">
              One mission.
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/50">
            Every Nucleus programme runs on real equipment, real data and real peer review. Hover any panel to
            bring it into focus.
          </p>
        </motion.div>

        <div className="mt-12 grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-4 md:grid-cols-6">
          {/* 1 — Upcoming projects (wide) */}
          <GlowCard
            className="p-6 sm:p-8 md:col-span-4"
            glow={ACCENTS.neon}
            as="article"
            delay={0}
          >
            <CardLabel tone={ACCENTS.neon}>Upcoming projects</CardLabel>
            <CardTitle>Bench-to-orbit builds, in progress</CardTitle>
            <CardBody>
              {liveProjects.length > 0
                ? `${liveProjects.length} of ${(projects ?? []).length} active builds are recruiting right now — from a photometry rig to a competition rover.`
                : 'Active builds are published here as teams open recruitment — from a photometry rig to a competition rover.'}
            </CardBody>

            <ul className="mt-6 space-y-2.5">
              {(liveProjects.length > 0
                ? liveProjects
                : [
                    { id: 'p1', title: 'Exoplanet transit photometry rig', categoryLabel: 'Space', progress: 68 },
                    { id: 'p2', title: 'Autonomous creek-survey rover', categoryLabel: 'Robotics', progress: 42 },
                    { id: 'p3', title: 'Low-cost spectrometer, gen 3', categoryLabel: 'Eco', progress: 24 },
                  ]
              ).map((project, index) => (
                <li
                  key={project.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors duration-300 hover:border-[#38BDF8]/30 hover:bg-white/[0.04]"
                >
                  <span className="font-mono text-[10px] tabular-nums text-white/30">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white/90">{project.title}</span>
                    <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                      <motion.span
                        className="block h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#A78BFA]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${project.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: 0.15 * index, ease: 'easeOut' }}
                      />
                    </span>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                    {project.categoryLabel ?? 'Lab'} · {project.progress}%
                  </span>
                </li>
              ))}
            </ul>

            <MagneticButton
              as="a"
              href="/projects"
              strength={9}
              className="mt-7 h-11 px-5 text-sm text-white ring-1 ring-white/15 hover:ring-[#38BDF8]/60"
            >
              All projects
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>
          </GlowCard>

          {/* 2 — Astronaut-database style stats */}
          <GlowCard className="p-6 sm:p-8 md:col-span-2" glow={ACCENTS.quantum} as="article" delay={0.08}>
            <CardLabel tone={ACCENTS.quantum}>Telemetry</CardLabel>
            <CardTitle>Club telemetry</CardTitle>
            <CardBody>Live counters from the Nucleus registry.</CardBody>

            <div className="mt-7 grid grid-cols-2 gap-y-7">
              <Metric value={stats?.members ?? null} label="Members" tone="#FFFFFF" />
              <Metric value={stats?.projects ?? null} label="Projects" tone={ACCENTS.neon} />
              <Metric value={stats?.notices ?? null} label="Notices" tone={ACCENTS.blue} />
              <Metric value={stats?.facts ?? null} label="Lab facts" tone={ACCENTS.quantum} />
            </div>

            <TelemetryTrace tone={ACCENTS.neon} />
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              Registry sync · nominal
            </p>
          </GlowCard>

          {/* 3 — Research lab */}
          <GlowCard className="p-6 sm:p-8 md:col-span-2" glow={ACCENTS.blue} as="article" delay={0.04}>
            <CardLabel tone={ACCENTS.blue}>Research lab</CardLabel>
            <CardTitle>Wet lab, optics bench, makerspace</CardTitle>
            <CardBody>
              Fume hoods, a 10&quot; Dobsonian, 3D printers and a microcontroller wall — booked in 90-minute
              slots by any member.
            </CardBody>

            <div className="mt-6 flex flex-wrap gap-2">
              {['Titration', 'Photometry', 'PCB etching', 'Microscopy', 'CAD/CAM'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <Microscope className="h-4 w-4 shrink-0 text-[#4F7CFF]" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-white/50">
                Lab induction runs the first Thursday of every month, 15:30, Lab 2.
              </p>
            </div>
          </GlowCard>

          {/* 4 — Event registration */}
          <GlowCard className="p-6 sm:p-8 md:col-span-2" glow={ACCENTS.mint} as="article" delay={0.1}>
            <CardLabel tone={ACCENTS.mint}>Event registration</CardLabel>
            <CardTitle>Claim a seat</CardTitle>
            <CardBody>Star parties, lectures and regional competitions — registration closes 48 h before doors.</CardBody>

            <ul className="mt-6 space-y-3">
              {(registrations.length > 0
                ? registrations
                : [
                    { id: 'n1', title: 'Ridge star party · Perseids', dateLabel: 'Fri 14 Aug', seatsLeft: 12 },
                    { id: 'n2', title: 'Regional robotics qualifier', dateLabel: 'Sat 06 Sep', seatsLeft: 4 },
                    { id: 'n3', title: 'Guest lecture: exoplanet atmospheres', dateLabel: 'Thu 18 Sep', seatsLeft: 26 },
                  ]
              ).map((notice) => (
                <li key={notice.id} className="flex items-start gap-3">
                  <CalendarCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-[#34D399]" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white/85">{notice.title}</span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                      {notice.dateLabel}
                      {notice.seatsLeft !== undefined ? ` · ${notice.seatsLeft} seats left` : ''}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <MagneticButton
              onClick={onJoin}
              strength={9}
              className="mt-7 h-11 px-5 text-sm text-[#04121C] bg-gradient-to-r from-[#6EE7B7] to-[#34D399]"
            >
              Register now
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>
          </GlowCard>

          {/* 5 — Observatories / deep sky */}
          <GlowCard className="p-6 sm:p-8 md:col-span-2" glow={ACCENTS.neon} as="article" delay={0.14}>
            <CardLabel tone={ACCENTS.neon}>Deep sky</CardLabel>
            <CardTitle>Ridge observatory</CardTitle>
            <CardBody>
              Shared photometry rig tracking exoplanet transits, plus a student-built spectrograph pointed at
              emission nebulae.
            </CardBody>

            <div className="mt-7 flex items-end gap-4">
              <Satellite className="h-10 w-10 text-[#38BDF8]" aria-hidden="true" />
              <div className="flex-1">
                <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  <span>Seeing</span>
                  <span>Transparency</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {[
                    { label: 'seeing', width: 82 },
                    { label: 'transparency', width: 64 },
                  ].map((bar) => (
                    <span key={bar.label} className="block h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                      <motion.span
                        className="block h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#4F7CFF]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${bar.width}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              <Telescope className="h-3.5 w-3.5" aria-hidden="true" />
              Next window · new moon
            </p>
          </GlowCard>

          {/* 6 — Did you know (wide) */}
          <GlowCard className="p-6 sm:p-8 md:col-span-4" glow={ACCENTS.quantum} as="article" delay={0.18}>
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-[min(100%,22rem)]">
                <CardLabel tone={ACCENTS.quantum}>Did you know</CardLabel>
                <CardTitle>University-level, weekly</CardTitle>
                <blockquote className="mt-4 text-lg font-medium leading-relaxed text-white/80">
                  “{fact?.fact ?? 'A neutron star is so dense that a sugar-cube of its material would weigh about a billion tons on Earth.'}”
                </blockquote>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                  {fact?.topic ? `${fact.topic} · published by members` : 'Astrophysics · published by members'}
                </p>
              </div>

              <div className="flex flex-col items-start gap-3">
                <FlaskConical className="h-8 w-8 text-[#A78BFA]" aria-hidden="true" />
                <MagneticButton
                  as="a"
                  href="/about"
                  strength={9}
                  className="h-11 px-5 text-sm text-white ring-1 ring-white/15 hover:ring-[#A78BFA]/60"
                >
                  How it works
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </MagneticButton>
              </div>
            </div>
          </GlowCard>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/25"
        >
          <Orbit className="h-3.5 w-3.5" aria-hidden="true" />
          Panels respond to cursor proximity — try moving across the grid
        </motion.p>
      </Container>
    </section>
  );
}

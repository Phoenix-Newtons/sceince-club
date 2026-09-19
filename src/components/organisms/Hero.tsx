import { ArrowRight, CalendarDays, FlaskConical, Lightbulb, MapPin, Sparkles, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Fact, Notice, Stats } from '../../types';
import { useApi } from '../../hooks/useApi';
import { useJoinModal } from '../../context/JoinModalContext';
import { Button } from '../atoms/Button';
import { Container } from '../atoms/Container';
import { Skeleton } from '../atoms/Skeleton';
import { StarfieldCanvas } from './StarfieldCanvas';

function GlassChip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-2xl bg-white/[0.07] px-4 py-3 ring-1 ring-white/15 backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
}

export function Hero() {
  const { open } = useJoinModal();
  const { data: stats, loading: statsLoading } = useApi<Stats>('/stats');
  const { data: notices } = useApi<Notice[]>('/notices');
  const { data: facts } = useApi<Fact[]>('/facts');

  const upcoming = notices?.filter((n) => !n.featured) ?? [];
  const nextEvent = upcoming[0];

  // Rotate the university-level facts every 6 seconds.
  const [factIndex, setFactIndex] = useState(0);
  useEffect(() => {
    if (!facts || facts.length < 2) return;
    const timer = window.setInterval(() => {
      setFactIndex((i) => (i + 1) % facts.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [facts]);
  const fact = facts && facts.length > 0 ? facts[factIndex % facts.length] : undefined;

  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Moving stars + nebula glows */}
      <StarfieldCanvas className="absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary-600/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-accent-500/10 blur-3xl" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent"
        aria-hidden="true"
      />

      <Container className="relative pb-20 pt-28 sm:pb-28 sm:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Left column */}
          <div className="max-w-xl">
            <span className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-white/[0.08] px-3.5 py-1.5 text-xs font-bold text-accent-300 ring-1 ring-white/15 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              BSSM Science Club · Est. 2016
            </span>

            <h1
              className="mt-6 animate-fade-up text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl xl:text-[3.4rem]"
              style={{ animationDelay: '90ms' }}
            >
              Exploring the Wonders of{' '}
              <span className="bg-gradient-to-r from-primary-300 via-indigo-300 to-accent-300 bg-clip-text text-transparent">
                Scientific Discovery
              </span>
            </h1>

            <p className="mt-6 animate-fade-up text-lg leading-relaxed text-slate-300" style={{ animationDelay: '180ms' }}>
              From bench-top chemistry to competition robotics, Nucleus is where curious minds design real
              experiments, publish their findings and launch ideas into orbit — one lab session at a time.
            </p>

            <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-3" style={{ animationDelay: '270ms' }}>
              <Button size="lg" onClick={open}>
                Join the Club
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <a
                href="/projects"
                className="inline-flex h-12 select-none items-center justify-center gap-2 rounded-xl bg-white/[0.08] px-6 text-base font-semibold text-slate-100 ring-1 ring-white/15 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <FlaskConical className="h-4 w-4 text-accent-300" aria-hidden="true" />
                Explore Projects
              </a>
            </div>

            <div className="mt-10 grid max-w-md animate-fade-up grid-cols-3 gap-4 sm:gap-6" style={{ animationDelay: '360ms' }}>
              {[
                { id: 'members', value: stats?.members, label: 'Registered members' },
                { id: 'projects', value: stats?.projects, label: 'Live projects' },
                { id: 'facts', value: stats?.facts, label: 'Did-you-knows' },
              ].map((stat, i) => (
                <div key={stat.id} className={i > 0 ? 'border-l border-white/10 pl-4 sm:pl-6' : ''}>
                  <p className="text-2xl font-extrabold tabular-nums tracking-tight text-white sm:text-3xl">
                    {statsLoading && stat.value === undefined ? '—' : (stat.value ?? '—')}
                  </p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — live club feed */}
          <div className="animate-fade-up space-y-4" style={{ animationDelay: '240ms' }}>
            <div className="rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10 backdrop-blur-xl sm:p-6">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                <CalendarDays className="h-3.5 w-3.5 text-accent-300" aria-hidden="true" />
                Next on the calendar
              </p>
              {nextEvent ? (
                <div key={nextEvent.id} className="mt-3 animate-fade-in">
                  <p className="text-base font-bold text-white">{nextEvent.title}</p>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-400">
                    <span>{nextEvent.dateLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{nextEvent.timeLabel}</span>
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-300" aria-hidden="true" />
                    {nextEvent.location}
                  </p>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10 backdrop-blur-xl sm:p-6">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                <Lightbulb className="h-3.5 w-3.5 text-gold" aria-hidden="true" style={{ color: '#facc15' }} />
                Did you know?
              </p>
              {fact ? (
                <div key={fact.id} className="mt-3 animate-fade-in">
                  <p className="text-sm leading-relaxed text-slate-200">{fact.fact}</p>
                  <span className="mt-3 inline-block rounded-full bg-accent-400/10 px-2.5 py-1 text-[11px] font-bold text-accent-300 ring-1 ring-accent-400/20">
                    {fact.topic} · university level
                  </span>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="animate-float">
                <GlassChip>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-xs font-bold text-white">
                    {stats ? `${stats.members} members registered` : 'Members registering'}
                  </span>
                </GlassChip>
              </div>
              <div className="animate-float" style={{ animationDelay: '1.6s' }}>
                <GlassChip>
                  <Users className="h-4 w-4 text-accent-300" aria-hidden="true" />
                  <span className="text-xs font-bold text-white">Open to grades 9–12</span>
                </GlassChip>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { Activity, ArrowRight, FlaskConical, Sparkles, TrendingUp } from 'lucide-react';
import { HERO_STATS } from '../../data/stats';
import { useJoinModal } from '../../context/JoinModalContext';
import { Button, buttonClasses } from '../atoms/Button';
import { Container } from '../atoms/Container';
import { HeroCanvas } from './HeroCanvas';

function GlassChip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/20 shadow-lg backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

export function Hero() {
  const { open } = useJoinModal();

  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-dots [mask-image:radial-gradient(75%_60%_at_50%_0%,black,transparent)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -top-32 right-0 -z-10 h-96 w-96 rounded-full bg-primary-100/60 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute top-40 -left-32 -z-10 h-80 w-80 rounded-full bg-accent-100/50 blur-3xl" aria-hidden="true" />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column */}
          <div className="max-w-xl">
            <span className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-primary-700 shadow-sm ring-1 ring-primary-100">
              <Sparkles className="h-3.5 w-3.5 text-accent-500" aria-hidden="true" />
              BSSM Science Club · Est. 2016
            </span>

            <h1
              className="mt-6 animate-fade-up text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl xl:text-[3.5rem]"
              style={{ animationDelay: '90ms' }}
            >
              Exploring the Wonders of{' '}
              <span className="bg-gradient-to-r from-primary-600 via-indigo-500 to-accent-500 bg-clip-text text-transparent">
                Scientific Discovery
              </span>
            </h1>

            <p
              className="mt-6 animate-fade-up text-lg leading-relaxed text-slate-500"
              style={{ animationDelay: '180ms' }}
            >
              From bench-top chemistry to competition robotics, Nucleus is where 100+ curious minds design
              real experiments, publish their findings and launch ideas into orbit — one lab session at a time.
            </p>

            <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-3" style={{ animationDelay: '270ms' }}>
              <Button size="lg" onClick={open}>
                Join the Club
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <a href="#projects" className={buttonClasses('secondary', 'lg')}>
                <FlaskConical className="h-4 w-4 text-primary-600" aria-hidden="true" />
                Explore Projects
              </a>
            </div>

            <div className="mt-10 grid max-w-md animate-fade-up grid-cols-3 gap-4 sm:gap-6" style={{ animationDelay: '360ms' }}>
              {HERO_STATS.map((stat, i) => (
                <div key={stat.id} className={i > 0 ? 'border-l border-slate-200 pl-4 sm:pl-6' : ''}>
                  <p className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — interactive canvas illustration */}
          <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="relative h-full min-h-[440px] lg:min-h-[560px]">
              <HeroCanvas>
                {/* Floating live-lab chips */}
                <div className="absolute left-4 top-4 animate-fade-up sm:left-6 sm:top-6" style={{ animationDelay: '420ms' }}>
                  <div className="animate-float">
                    <GlassChip>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                      </span>
                      <span>
                        <span className="block text-xs font-bold text-white">Live · Spectrometer Bench B</span>
                        <span className="block text-[11px] font-medium text-slate-300">Absorbance sweep running</span>
                      </span>
                    </GlassChip>
                  </div>
                </div>

                <div className="absolute right-4 top-16 hidden animate-fade-up sm:right-6 sm:top-6 sm:block" style={{ animationDelay: '560ms' }}>
                  <div className="animate-float" style={{ animationDelay: '1.4s' }}>
                    <GlassChip>
                      <TrendingUp className="h-4 w-4 text-accent-300" aria-hidden="true" />
                      <span className="text-xs font-bold text-white">+14 members this week</span>
                    </GlassChip>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 animate-fade-up sm:bottom-6 sm:left-6" style={{ animationDelay: '700ms' }}>
                  <div className="animate-float" style={{ animationDelay: '2.6s' }}>
                    <GlassChip>
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-400/20 text-accent-300">
                        <Activity className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-xs font-bold text-white">128 experiments logged</span>
                        <span className="block text-[11px] font-medium text-slate-300">this semester</span>
                      </span>
                      <svg viewBox="0 0 64 24" className="h-5 w-14 text-accent-300" aria-hidden="true">
                        <polyline
                          points="0,18 10,14 20,16 30,9 40,12 50,5 64,8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </GlassChip>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 hidden animate-fade-up sm:bottom-6 sm:right-6 md:block" style={{ animationDelay: '840ms' }}>
                  <div className="animate-float" style={{ animationDelay: '3.8s' }}>
                    <GlassChip>
                      <span className="text-xs font-bold text-white">Next session · Thu 16:30 · Lab 2</span>
                    </GlassChip>
                  </div>
                </div>
              </HeroCanvas>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

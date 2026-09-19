import { ArrowRight, CalendarPlus, Pin } from 'lucide-react';
import { FEATURED_EVENT, NOTICES } from '../../data/notices';
import { useJoinModal } from '../../context/JoinModalContext';
import { Button } from '../atoms/Button';
import { Container } from '../atoms/Container';
import { Reveal } from '../atoms/Reveal';
import { NoticeCard } from '../molecules/NoticeCard';
import { SectionHeading } from '../molecules/SectionHeading';

export function AnnouncementsSection() {
  const { open } = useJoinModal();

  return (
    <section id="events" className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Lab bulletin"
            title="Announcements & upcoming events"
            description="Workshops, guest speakers and launch days — everything happening around the club this month."
          />
        </Reveal>

        {/* Featured banner */}
        <Reveal className="mt-12 sm:mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-700 via-primary-600 to-accent-600 px-6 py-8 text-white shadow-lift sm:px-10">
            <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-accent-300/20 blur-3xl" aria-hidden="true" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-5">
                <div className="hidden shrink-0 flex-col items-center rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/25 backdrop-blur-sm sm:flex">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-accent-200">{FEATURED_EVENT.month}</span>
                  <span className="text-3xl font-extrabold leading-none">{FEATURED_EVENT.day}</span>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ring-white/25">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-300 opacity-70" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-300" />
                    </span>
                    {FEATURED_EVENT.badge}
                  </span>
                  <h3 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{FEATURED_EVENT.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-100">{FEATURED_EVENT.description}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-200">
                    <Pin className="h-3.5 w-3.5" aria-hidden="true" />
                    {FEATURED_EVENT.note}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={open}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-primary-700 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
                >
                  Register your team
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Notice board */}
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {NOTICES.map((notice, i) => (
            <Reveal key={notice.id} delay={(i % 3) * 90} className="h-full">
              <NoticeCard notice={notice} />
            </Reveal>
          ))}

          {/* Propose-an-event tile */}
          <Reveal delay={180} className="h-full">
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-6 text-center transition-colors duration-300 hover:border-primary-300">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-1 ring-primary-100">
                <CalendarPlus className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-900">Running something cool?</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                Propose a workshop, talk or field trip and we'll pin it to the board.
              </p>
              <Button variant="secondary" size="sm" className="mt-5" onClick={open}>
                Propose an event
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

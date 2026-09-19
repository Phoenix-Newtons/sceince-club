import { ArrowRight, CalendarPlus, CalendarSearch, Pin } from 'lucide-react';
import type { Notice } from '../../types';
import { useApi } from '../../hooks/useApi';
import { useJoinModal } from '../../context/JoinModalContext';
import { Button } from '../atoms/Button';
import { Container } from '../atoms/Container';
import { EmptyState } from '../atoms/EmptyState';
import { ErrorBanner } from '../atoms/ErrorBanner';
import { Skeleton } from '../atoms/Skeleton';
import { NoticeCard } from '../molecules/NoticeCard';
import { SectionHeading } from '../molecules/SectionHeading';

const FEATURED_BADGE: Record<Notice['status'], string> = {
  live: 'Happening Live',
  upcoming: 'Save the Date',
  registration: 'Registration Open',
};

export function AnnouncementsSection() {
  const { open } = useJoinModal();
  const { data: notices, loading, error, reload } = useApi<Notice[]>('/notices');

  const featured = notices?.find((n) => n.featured) ?? notices?.[0];
  const rest = notices?.filter((n) => n.id !== featured?.id) ?? [];

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Lab bulletin"
          title="Announcements & upcoming events"
          description="Workshops, guest speakers and launch days — everything happening around the club this month."
        />

        {error ? (
          <div className="mt-10">
            <ErrorBanner message={error} onRetry={() => void reload()} />
          </div>
        ) : null}

        {loading ? (
          <div className="mt-12 space-y-6">
            <Skeleton className="h-52 w-full rounded-3xl" />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : !error && notices && featured ? (
          <>
            {/* Featured banner */}
            <div className="relative mt-12 overflow-hidden rounded-3xl bg-gradient-to-r from-primary-700 via-primary-600 to-accent-600 px-6 py-8 text-white shadow-lift sm:px-10">
              <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-accent-300/20 blur-3xl" aria-hidden="true" />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-5">
                  <div className="hidden shrink-0 flex-col items-center rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/25 backdrop-blur-sm sm:flex">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-accent-200">Featured</span>
                    <CalendarPlus className="mt-1 h-5 w-5 text-accent-200" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ring-white/25">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-300 opacity-70" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-300" />
                      </span>
                      {FEATURED_BADGE[featured.status]}
                    </span>
                    <h3 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{featured.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-100">{featured.description}</p>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-200">
                      <Pin className="h-3.5 w-3.5" aria-hidden="true" />
                      {featured.dateLabel} · {featured.timeLabel} · {featured.location}
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

            {/* Notice board */}
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}

              {/* Propose-an-event tile */}
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-6 text-center transition-colors duration-300 hover:border-primary-300 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-primary-500/50">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-1 ring-primary-100 dark:bg-primary-500/10 dark:text-primary-300 dark:ring-primary-500/20">
                  <CalendarPlus className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Running something cool?</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Club admins can pin new events from the admin panel.
                </p>
                <Button variant="secondary" size="sm" className="mt-5" onClick={open}>
                  Propose an event
                </Button>
              </div>
            </div>
          </>
        ) : !error ? (
          <div className="mt-12">
            <EmptyState
              icon={CalendarSearch}
              title="No announcements yet"
              hint="When the club posts workshops or talks, they'll appear here first."
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}

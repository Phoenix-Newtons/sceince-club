import { Bell, BellRing, CalendarDays, Check, Clock, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import type { Notice } from '../../types';
import { useJoinModal } from '../../context/JoinModalContext';
import { Badge, type BadgeTone } from '../atoms/Badge';
import { Button } from '../atoms/Button';

const STATUS_META: Record<Notice['status'], { tone: BadgeTone; label: string; pulse?: boolean }> = {
  live: { tone: 'live', label: 'Live', pulse: true },
  upcoming: { tone: 'upcoming', label: 'Upcoming' },
  registration: { tone: 'open', label: 'Registration Open' },
};

export function NoticeCard({ notice }: { notice: Notice }) {
  const { open } = useJoinModal();
  const [reminded, setReminded] = useState(false);
  const [joinedStream, setJoinedStream] = useState(false);
  const [watching, setWatching] = useState(notice.watching ?? 0);
  const meta = STATUS_META[notice.status];

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/70 hover:shadow-lift dark:border-slate-700/60 dark:bg-slate-900 dark:hover:border-primary-500/40">
      <div className="flex items-center justify-between gap-3">
        <Badge tone={meta.tone} dot pulse={meta.pulse}>
          {meta.label}
        </Badge>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{notice.dateLabel}</span>
      </div>

      <h3 className="mt-4 text-base font-bold leading-snug tracking-tight text-slate-900 dark:text-white">
        {notice.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{notice.description}</p>

      <ul className="mb-5 mt-4 space-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <li className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary-500" aria-hidden="true" />
          {notice.dateLabel}
        </li>
        <li className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 shrink-0 text-primary-500" aria-hidden="true" />
          {notice.timeLabel}
        </li>
        <li className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary-500" aria-hidden="true" />
          {notice.location}
        </li>
      </ul>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        {notice.status === 'registration' ? (
          <>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {notice.seatsLeft ?? 'Open'} {notice.seatsLeft ? 'bench seats left' : 'to all members'}
            </span>
            <Button size="sm" onClick={open}>
              Register
            </Button>
          </>
        ) : notice.status === 'live' ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {watching} watching
            </span>
            <Button
              size="sm"
              variant={joinedStream ? 'secondary' : 'primary'}
              onClick={() => {
                setJoinedStream((prev) => !prev);
                setWatching((prev) => (joinedStream ? prev - 1 : prev + 1));
              }}
            >
              {joinedStream ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  You're in
                </>
              ) : (
                "I'm watching"
              )}
            </Button>
          </>
        ) : (
          <>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Open to all members</span>
            <Button
              size="sm"
              variant={reminded ? 'secondary' : 'ghost'}
              className={reminded ? '' : 'text-slate-500 ring-1 ring-slate-200 hover:text-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:text-white'}
              onClick={() => setReminded((prev) => !prev)}
            >
              {reminded ? (
                <>
                  <BellRing className="h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                  Reminder set
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" aria-hidden="true" />
                  Remind me
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </article>
  );
}

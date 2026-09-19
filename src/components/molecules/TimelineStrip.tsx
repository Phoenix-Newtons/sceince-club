import { Check } from 'lucide-react';
import { Fragment } from 'react';
import type { Milestone } from '../../types';

interface TimelineStripProps {
  milestones: Milestone[];
  className?: string;
}

/** Horizontal milestone tracker: done → current (pulsing) → upcoming. */
export function TimelineStrip({ milestones, className = '' }: TimelineStripProps) {
  return (
    <div className={`flex items-start ${className}`} aria-label="Project timeline">
      {milestones.map((milestone, i) => (
        <Fragment key={milestone.label}>
          {i > 0 ? (
            <div className="mt-2 h-0.5 min-w-[6px] flex-1" aria-hidden="true">
              <div
                className={`h-full w-full rounded-full ${
                  milestone.done ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            </div>
          ) : null}
          <div
            className="flex w-12 shrink-0 flex-col items-center gap-1.5 sm:w-14"
            title={`${milestone.label} — ${milestone.date}`}
          >
            <span
              className={`flex h-[18px] w-[18px] items-center justify-center rounded-full transition-colors duration-300 ${
                milestone.done
                  ? 'bg-primary-600 text-white'
                  : milestone.current
                    ? 'bg-white ring-2 ring-primary-500 dark:bg-slate-900'
                    : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              {milestone.done ? (
                <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden="true" />
              ) : milestone.current ? (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-500" aria-hidden="true" />
              ) : null}
            </span>
            <span
              className={`text-center text-[10px] font-bold leading-tight ${
                milestone.done || milestone.current
                  ? 'text-slate-700 dark:text-slate-300'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {milestone.label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

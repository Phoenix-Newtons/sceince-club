import { ArrowUpRight, Clock, Leaf, Rocket, Bot, type LucideIcon } from 'lucide-react';
import type { Project, ProjectCategory, ProjectStatus } from '../../types';
import { useJoinModal } from '../../context/JoinModalContext';
import { Badge, type BadgeTone } from '../atoms/Badge';
import { ProgressBar } from '../atoms/ProgressBar';
import { AvatarStack } from './AvatarStack';
import { TimelineStrip } from './TimelineStrip';

const CATEGORY_META: Record<ProjectCategory, { icon: LucideIcon; classes: string }> = {
  robotics: { icon: Bot, classes: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
  eco: { icon: Leaf, classes: 'bg-teal-50 text-teal-700 ring-teal-100' },
  space: { icon: Rocket, classes: 'bg-primary-50 text-primary-700 ring-primary-100' },
};

const STATUS_META: Record<ProjectStatus, { tone: BadgeTone; dot?: boolean; pulse?: boolean }> = {
  'In Progress': { tone: 'progress', dot: true, pulse: true },
  'Peer Review': { tone: 'review' },
  Recruiting: { tone: 'recruiting', dot: true },
  Completed: { tone: 'done', dot: true },
};

export function ProjectCard({ project }: { project: Project }) {
  const { open } = useJoinModal();
  const CategoryIcon = CATEGORY_META[project.category].icon;
  const status = STATUS_META[project.status];

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-200/70 hover:shadow-lift">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ring-1 ${CATEGORY_META[project.category].classes}`}
        >
          <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {project.categoryLabel}
        </span>
        <Badge tone={status.tone} dot={status.dot} pulse={status.pulse}>
          {project.status}
        </Badge>
      </div>

      <h3 className="mt-4 text-lg font-extrabold leading-snug tracking-tight text-slate-900">{project.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{project.summary}</p>

      <ProgressBar value={project.progress} label="Milestones complete" className="mt-5" />
      <TimelineStrip milestones={project.milestones} className="mt-6" />

      <div className="mt-6 flex items-center justify-between gap-3">
        <AvatarStack people={project.team} />
        <p className="truncate text-xs text-slate-400">
          Lead · <span className="font-semibold text-slate-600">{project.lead.name}</span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-100"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Updated {project.updatedAt}
        </span>
        <button
          type="button"
          onClick={open}
          className="group/link inline-flex items-center gap-1 text-xs font-bold text-primary-600 transition-colors duration-200 hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Join this team
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}

import { useMemo, useState } from 'react';
import { PROJECTS } from '../../data/projects';
import type { ProjectTab } from '../../types';
import { Container } from '../atoms/Container';
import { Reveal } from '../atoms/Reveal';
import { ProjectCard } from '../molecules/ProjectCard';
import { SectionHeading } from '../molecules/SectionHeading';

const TABS: { id: ProjectTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'robotics', label: 'Robotics' },
  { id: 'eco', label: 'Eco-Science' },
  { id: 'space', label: 'Space' },
];

export function ProjectsSection() {
  const [tab, setTab] = useState<ProjectTab>('all');

  const counts = useMemo(
    () => ({
      all: PROJECTS.length,
      robotics: PROJECTS.filter((p) => p.category === 'robotics').length,
      eco: PROJECTS.filter((p) => p.category === 'eco').length,
      space: PROJECTS.filter((p) => p.category === 'space').length,
    }),
    [],
  );

  const filtered = useMemo(
    () => (tab === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === tab)),
    [tab],
  );

  return (
    <section id="projects" className="bg-surface-muted py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Research in motion"
            title="Active projects & timeline"
            description="Every experiment below is run by students — track progress from first sketch to peer-reviewed poster."
          />
        </Reveal>

        {/* Filter tabs */}
        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {TABS.map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:text-slate-900 hover:shadow-sm'
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {counts[t.id]}
                </span>
              </button>
            );
          })}
        </Reveal>

        {/* Cards grid — re-keyed per tab so cards replay their entrance */}
        <div key={tab} className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project, i) => (
            <div key={project.id} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <p className="text-sm font-medium text-slate-400">
            26 projects logged this year · 9 published in the club archive · 100% student-run
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

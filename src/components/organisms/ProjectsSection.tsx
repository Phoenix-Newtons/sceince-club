import { useMemo, useState } from 'react';
import { Layers, Plus } from 'lucide-react';
import type { Project, ProjectTab } from '../../types';
import { api } from '../../api/client';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../atoms/Button';
import { Container } from '../atoms/Container';
import { EmptyState } from '../atoms/EmptyState';
import { ErrorBanner } from '../atoms/ErrorBanner';
import { Skeleton } from '../atoms/Skeleton';
import { ProjectCard } from '../molecules/ProjectCard';
import { SectionHeading } from '../molecules/SectionHeading';
import { ProjectFormModal } from './ProjectFormModal';

const TABS: { id: ProjectTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'robotics', label: 'Robotics' },
  { id: 'eco', label: 'Eco-Science' },
  { id: 'space', label: 'Space' },
];

export function ProjectsSection() {
  const [tab, setTab] = useState<ProjectTab>('all');
  const [formOpen, setFormOpen] = useState(false);
  const { member } = useAuth();
  const { data: projects, loading, error, reload } = useApi<Project[]>('/projects');

  const counts = useMemo(() => {
    const list = projects ?? [];
    return {
      all: list.length,
      robotics: list.filter((p) => p.category === 'robotics').length,
      eco: list.filter((p) => p.category === 'eco').length,
      space: list.filter((p) => p.category === 'space').length,
    } as Record<ProjectTab, number>;
  }, [projects]);

  const filtered = useMemo(
    () => (tab === 'all' ? projects ?? [] : (projects ?? []).filter((p) => p.category === tab)),
    [projects, tab],
  );

  const canDelete = member?.role === 'admin';

  const handleDelete = async (project: Project) => {
    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) return;
    try {
      await api<void>(`/projects/${project.id}`, { method: 'DELETE' });
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete the project.');
    }
  };

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Research in motion"
          title="Active projects & timeline"
          description="Every experiment below is run by students — track progress from first sketch to peer-reviewed poster."
        />

        {/* Toolbar: filter tabs + add project */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
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
                      ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:text-slate-900 hover:shadow-sm dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:text-white'
                  }`}
                >
                  {t.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-slate-900/10 dark:text-slate-900'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {counts[t.id]}
                  </span>
                </button>
              );
            })}
          </div>
          {member ? (
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Share a project
            </Button>
          ) : null}
        </div>

        {/* Cards grid */}
        <div className="mt-10">
          {error ? (
            <ErrorBanner message={error} onRetry={() => void reload()} />
          ) : loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[26rem] rounded-2xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Layers}
              title={tab === 'all' ? 'No projects yet' : 'Nothing in this category yet'}
              hint={
                member
                  ? 'Be the first — share what your team is building.'
                  : 'Members share their experiments here as soon as teams form.'
              }
              action={
                member ? (
                  <Button size="sm" onClick={() => setFormOpen(true)}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Share a project
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div key={tab} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((project, i) => (
                <div key={project.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}>
                  <ProjectCard
                    project={project}
                    onDelete={canDelete ? () => void handleDelete(project) : undefined}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && !error && filtered.length > 0 ? (
          <p className="mt-10 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
            {counts.all} project{counts.all === 1 ? '' : 's'} on the board · 100% student-run
          </p>
        ) : null}
      </Container>

      <ProjectFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreated={() => {
          setFormOpen(false);
          void reload();
        }}
      />
    </section>
  );
}

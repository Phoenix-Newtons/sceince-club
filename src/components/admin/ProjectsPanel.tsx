import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Project } from '../../types';
import { api } from '../../api/client';
import { useApi } from '../../hooks/useApi';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { ErrorBanner } from '../atoms/ErrorBanner';
import { Skeleton } from '../atoms/Skeleton';
import { AdminCard, AdminRow } from './AdminUI';
import { ProjectFormModal } from '../organisms/ProjectFormModal';

export function ProjectsPanel() {
  const { data, loading, error, reload } = useApi<Project[]>('/projects');
  const [formOpen, setFormOpen] = useState(false);

  const remove = async (project: Project) => {
    if (!window.confirm(`Delete “${project.title}”?`)) return;
    try {
      await api<void>(`/projects/${project.id}`, { method: 'DELETE' });
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete the project.');
    }
  };

  return (
    <div className="space-y-6">
      <AdminCard title="Projects board">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Everything members share appears here — and on the public Projects page.
          </p>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add project
          </Button>
        </div>
      </AdminCard>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner message={error} onRetry={() => void reload()} />
      ) : (
        <div className="space-y-3">
          {(data ?? []).map((project) => (
            <AdminRow key={project.id}>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{project.title}</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {project.categoryLabel} · lead {project.lead.name} · {project.progress}% complete
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge
                  tone={
                    project.status === 'Completed'
                      ? 'done'
                      : project.status === 'Peer Review'
                        ? 'review'
                        : project.status === 'Recruiting'
                          ? 'recruiting'
                          : 'progress'
                  }
                >
                  {project.status}
                </Badge>
                <button
                  type="button"
                  aria-label={`Delete ${project.title}`}
                  onClick={() => void remove(project)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </AdminRow>
          ))}
        </div>
      )}

      <ProjectFormModal open={formOpen} onClose={() => setFormOpen(false)} onCreated={() => void reload()} />
    </div>
  );
}

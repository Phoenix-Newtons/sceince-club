import { useState } from 'react';
import { Check, LoaderCircle, Mail, X } from 'lucide-react';
import type { Application, Subscriber } from '../../types';
import { api } from '../../api/client';
import { useApi } from '../../hooks/useApi';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { EmptyState } from '../atoms/EmptyState';
import { ErrorBanner } from '../atoms/ErrorBanner';
import { Skeleton } from '../atoms/Skeleton';
import { AdminCard, AdminRow } from './AdminUI';

const STATUS_TONE = {
  pending: 'review',
  approved: 'open',
  rejected: 'neutral',
} as const;

export function ApplicationsPanel() {
  const apps = useApi<Application[]>('/applications');
  const subs = useApi<Subscriber[]>('/subscribers');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  const list = apps.data ?? [];
  const pending = list.filter((a) => a.status === 'pending');
  const processed = list.filter((a) => a.status !== 'pending');

  const act = async (application: Application, action: 'approve' | 'reject') => {
    setBusyId(application.id);
    setActionError(null);
    try {
      if (action === 'approve') {
        const result = await api<{ temporaryPassword: string }>(`/applications/${application.id}/approve`, {
          method: 'POST',
          body: { password: passwords[application.id]?.trim() || undefined },
        });
        window.alert(`Member created.\nTemporary password: ${result.temporaryPassword}\nShare it privately and ask them to change it.`);
      } else {
        await api<Application>(`/applications/${application.id}/reject`, { method: 'POST' });
      }
      await apps.reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      {actionError ? <ErrorBanner message={actionError} /> : null}

      <AdminCard title={`Pending applications (${pending.length})`}>
        {apps.loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : apps.error ? (
          <ErrorBanner message={apps.error} onRetry={() => void apps.reload()} />
        ) : pending.length === 0 ? (
          <EmptyState icon={Check} title="No pending applications" hint="New join requests will land here." />
        ) : (
          <div className="space-y-4">
            {pending.map((application) => (
              <AdminRow key={application.id}>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {application.name}
                    <span className="ml-2 font-mono text-xs font-medium text-slate-400">{application.id}</span>
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <Mail className="h-3 w-3" aria-hidden="true" />
                    {application.email} · {application.grade} · {application.interest}
                  </p>
                  {application.message ? (
                    <p className="mt-1.5 text-xs italic leading-relaxed text-slate-500 dark:text-slate-400">
                      “{application.message}”
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  <input
                    type="text"
                    placeholder="Temp password (default: nucleus-club)"
                    value={passwords[application.id] ?? ''}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, [application.id]: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 sm:w-64 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-primary-500/20"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" disabled={busyId === application.id} onClick={() => void act(application, 'approve')}>
                      {busyId === application.id ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Check className="h-4 w-4" aria-hidden="true" />
                      )}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={busyId === application.id}
                      onClick={() => void act(application, 'reject')}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                      Reject
                    </Button>
                  </div>
                </div>
              </AdminRow>
            ))}
          </div>
        )}
      </AdminCard>

      {processed.length > 0 ? (
        <AdminCard title="Processed">
          <div className="space-y-3">
            {processed.map((application) => (
              <AdminRow key={application.id}>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{application.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{application.email}</p>
                </div>
                <Badge tone={STATUS_TONE[application.status]}>{application.status}</Badge>
              </AdminRow>
            ))}
          </div>
        </AdminCard>
      ) : null}

      <AdminCard title={`Newsletter subscribers (${subs.data?.length ?? 0})`}>
        {subs.loading ? (
          <Skeleton className="h-16 rounded-xl" />
        ) : subs.data && subs.data.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {subs.data.map((sub) => (
              <span
                key={sub.id}
                className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
              >
                {sub.email}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No subscribers yet.</p>
        )}
      </AdminCard>
    </div>
  );
}

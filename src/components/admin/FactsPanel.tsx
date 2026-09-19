import { useState, type FormEvent } from 'react';
import { Lightbulb, LoaderCircle, Trash2 } from 'lucide-react';
import type { Fact } from '../../types';
import { api } from '../../api/client';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../atoms/Button';
import { ErrorBanner } from '../atoms/ErrorBanner';
import { Skeleton } from '../atoms/Skeleton';
import { TextArea, TextField } from '../molecules/FormField';
import { AdminCard, AdminRow } from './AdminUI';

export function FactsPanel() {
  const { member } = useAuth();
  const { data, loading, error, reload } = useApi<Fact[]>('/facts');
  const [fact, setFact] = useState('');
  const [topic, setTopic] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (fact.trim().length < 20) {
      setFormError('Facts should be at least 20 characters — give us the detail!');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await api<Fact>('/facts', { method: 'POST', body: { fact, topic } });
      setFact('');
      setTopic('');
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not add the fact.');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (entry: Fact) => {
    if (!window.confirm('Delete this fact?')) return;
    try {
      await api<void>(`/facts/${entry.id}`, { method: 'DELETE' });
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete the fact.');
    }
  };

  const canDelete = member?.role === 'admin';

  return (
    <div className="space-y-6">
      <AdminCard title="Add a university-level did-you-know">
        <form className="space-y-4" onSubmit={handleAdd} noValidate>
          <TextArea
            id="fact-entry"
            label="Fact"
            placeholder="Precise, sourced and a little mind-bending…"
            required
            value={fact}
            onChange={(e) => setFact(e.target.value)}
          />
          <TextField
            id="fact-topic"
            label="Topic"
            placeholder="e.g. Organic Chemistry, Astrophysics"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            hint="Defaults to “General Science”."
          />
          {formError ? <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{formError}</p> : null}
          <Button type="submit" disabled={submitting}>
            {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Lightbulb className="h-4 w-4" aria-hidden="true" />}
            Add fact
          </Button>
        </form>
      </AdminCard>

      <AdminCard title={`Facts (${data?.length ?? 0})`}>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <ErrorBanner message={error} onRetry={() => void reload()} />
        ) : (
          <div className="space-y-3">
            {(data ?? []).map((entry) => (
              <AdminRow key={entry.id}>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary-600 dark:text-primary-400">
                    {entry.topic}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{entry.fact}</p>
                </div>
                {canDelete ? (
                  <button
                    type="button"
                    aria-label="Delete fact"
                    onClick={() => void remove(entry)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </AdminRow>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

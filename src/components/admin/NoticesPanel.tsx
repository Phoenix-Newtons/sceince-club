import { useState, type FormEvent } from 'react';
import { CalendarPlus, LoaderCircle, Trash2 } from 'lucide-react';
import type { Notice, NoticeDraft, NoticeStatus } from '../../types';
import { api } from '../../api/client';
import { useApi } from '../../hooks/useApi';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { ErrorBanner } from '../atoms/ErrorBanner';
import { Skeleton } from '../atoms/Skeleton';
import { SelectField, TextArea, TextField } from '../molecules/FormField';
import { AdminCard, AdminRow } from './AdminUI';

const STATUS_OPTIONS: { value: NoticeStatus; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'registration', label: 'Registration Open' },
  { value: 'live', label: 'Live' },
];

const EMPTY_DRAFT: NoticeDraft = {
  title: '',
  description: '',
  status: 'upcoming',
  dateLabel: '',
  timeLabel: '',
  location: '',
  featured: false,
};

export function NoticesPanel() {
  const { data, loading, error, reload } = useApi<Notice[]>('/notices');
  const [draft, setDraft] = useState<NoticeDraft>(EMPTY_DRAFT);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (draft.title.trim().length < 4 || draft.description.trim().length < 10) {
      setFormError('Give the notice a title (4+ chars) and a description (10+ chars).');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await api<Notice>('/notices', { method: 'POST', body: draft });
      setDraft(EMPTY_DRAFT);
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not post the notice.');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (notice: Notice) => {
    if (!window.confirm(`Delete “${notice.title}”?`)) return;
    try {
      await api<void>(`/notices/${notice.id}`, { method: 'DELETE' });
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete the notice.');
    }
  };

  return (
    <div className="space-y-6">
      <AdminCard title="Post a new notice">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleAdd} noValidate>
          <div className="sm:col-span-2">
            <TextField
              id="notice-title"
              label="Title"
              placeholder="e.g. Guest speaker: CRISPR and the future of medicine"
              required
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <TextArea
              id="notice-description"
              label="Description"
              placeholder="What is happening, and why should members show up?"
              required
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
          </div>
          <SelectField
            id="notice-status"
            label="Status"
            required
            options={STATUS_OPTIONS}
            value={draft.status}
            onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as NoticeStatus }))}
          />
          <TextField
            id="notice-date"
            label="Date label"
            placeholder="e.g. Fri, Nov 21"
            value={draft.dateLabel}
            onChange={(e) => setDraft((d) => ({ ...d, dateLabel: e.target.value }))}
          />
          <TextField
            id="notice-time"
            label="Time"
            placeholder="e.g. 4:00 – 6:00 PM"
            value={draft.timeLabel}
            onChange={(e) => setDraft((d) => ({ ...d, timeLabel: e.target.value }))}
          />
          <TextField
            id="notice-location"
            label="Location"
            placeholder="e.g. Chem Lab"
            value={draft.location}
            onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
          />
          <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 sm:col-span-2 dark:text-slate-300">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-primary-600 accent-primary-600 dark:border-slate-600"
            />
            Feature this event in the big banner on the Events page
          </label>
          {formError ? (
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400 sm:col-span-2">{formError}</p>
          ) : null}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CalendarPlus className="h-4 w-4" aria-hidden="true" />}
              Post notice
            </Button>
          </div>
        </form>
      </AdminCard>

      <AdminCard title={`Notices (${data?.length ?? 0})`}>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <ErrorBanner message={error} onRetry={() => void reload()} />
        ) : (
          <div className="space-y-3">
            {(data ?? []).map((notice) => (
              <AdminRow key={notice.id}>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {notice.title}
                    {notice.featured ? (
                      <span className="ml-2 rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-700 dark:bg-accent-500/15 dark:text-accent-300">
                        Featured
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {notice.dateLabel} · {notice.timeLabel} · {notice.location}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={notice.status === 'live' ? 'live' : notice.status === 'registration' ? 'open' : 'upcoming'} dot>
                    {notice.status === 'live' ? 'Live' : notice.status === 'registration' ? 'Registration' : 'Upcoming'}
                  </Badge>
                  <button
                    type="button"
                    aria-label={`Delete ${notice.title}`}
                    onClick={() => void remove(notice)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </AdminRow>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

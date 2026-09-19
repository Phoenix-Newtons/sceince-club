import { useState, type FormEvent } from 'react';
import { LoaderCircle, Quote as QuoteIcon, Star, Trash2 } from 'lucide-react';
import type { Quote } from '../../types';
import { api } from '../../api/client';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { ErrorBanner } from '../atoms/ErrorBanner';
import { Skeleton } from '../atoms/Skeleton';
import { TextArea, TextField } from '../molecules/FormField';
import { AdminCard, AdminRow } from './AdminUI';

export function QuotesPanel() {
  const { member } = useAuth();
  const { data, loading, error, reload } = useApi<Quote[]>('/quotes');
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (text.trim().length < 10) {
      setFormError('A quote needs at least 10 characters.');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await api<Quote>('/quotes', { method: 'POST', body: { text, author, role } });
      setText('');
      setAuthor('');
      setRole('');
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not add the quote.');
    } finally {
      setSubmitting(false);
    }
  };

  const activate = async (quote: Quote) => {
    try {
      await api<Quote>(`/quotes/${quote.id}/activate`, { method: 'POST' });
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not activate the quote.');
    }
  };

  const remove = async (quote: Quote) => {
    if (!window.confirm('Delete this quote?')) return;
    try {
      await api<void>(`/quotes/${quote.id}`, { method: 'DELETE' });
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete the quote.');
    }
  };

  const canDelete = (quote: Quote) => member?.role === 'admin' || quote.author === member?.name;

  return (
    <div className="space-y-6">
      <AdminCard title="Add a quote">
        <form className="space-y-4" onSubmit={handleAdd} noValidate>
          <TextArea
            id="quote-text"
            label="Quote"
            placeholder="Words that capture the club's spirit…"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="quote-author"
              label="Author"
              placeholder="e.g. Richard Feynman"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              hint="Defaults to your name."
            />
            <TextField
              id="quote-role"
              label="Author role"
              placeholder="e.g. Theoretical Physicist"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              hint="Defaults to “Club Member”."
            />
          </div>
          {formError ? <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{formError}</p> : null}
          <Button type="submit" disabled={submitting}>
            {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <QuoteIcon className="h-4 w-4" aria-hidden="true" />}
            Add quote
          </Button>
        </form>
      </AdminCard>

      <AdminCard title={`Quotes (${data?.length ?? 0}) — the active one shows on About & Home`}>
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
            {(data ?? []).map((quote) => (
              <AdminRow key={quote.id}>
                <div className="min-w-0">
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">“{quote.text}”</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
                    — {quote.author}, {quote.role}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {quote.active ? (
                    <Badge tone="open">Active</Badge>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => void activate(quote)}>
                      <Star className="h-3.5 w-3.5" aria-hidden="true" />
                      Set active
                    </Button>
                  )}
                  {canDelete(quote) ? (
                    <button
                      type="button"
                      aria-label="Delete quote"
                      onClick={() => void remove(quote)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              </AdminRow>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

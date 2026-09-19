import { useState, type FormEvent } from 'react';
import { GraduationCap, Lightbulb, Plus, Send } from 'lucide-react';
import type { Fact } from '../../types';
import { api } from '../../api/client';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../atoms/Button';
import { Container } from '../atoms/Container';
import { ErrorBanner } from '../atoms/ErrorBanner';
import { Skeleton } from '../atoms/Skeleton';
import { SectionHeading } from '../molecules/SectionHeading';

export function DidYouKnowSection() {
  const { member } = useAuth();
  const { data: facts, loading, error, reload } = useApi<Fact[]>('/facts');
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [factText, setFactText] = useState('');
  const [topic, setTopic] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const list = facts ?? [];
  const featured = list.length > 0 ? list[featuredIndex % list.length] : undefined;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (factText.trim().length < 20) {
      setFormError('Give us the full fact — at least 20 characters.');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await api<Fact>('/facts', { method: 'POST', body: { fact: factText, topic } });
      setFactText('');
      setTopic('');
      setFormOpen(false);
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not add the fact.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-slate-50 py-16 sm:py-24 dark:bg-slate-900/40">
      <Container>
        <SectionHeading
          eyebrow="Brain food"
          title="Did you know?"
          description="University-level facts collected by the club — the kind of thing that starts a three-hour debate."
        />

        {error ? (
          <div className="mt-10">
            <ErrorBanner message={error} onRetry={() => void reload()} />
          </div>
        ) : loading ? (
          <div className="mt-12 space-y-6">
            <Skeleton className="mx-auto h-44 w-full max-w-3xl rounded-3xl" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : list.length === 0 ? (
          <p className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
            No facts yet — members can add the first one.
          </p>
        ) : (
          <>
            {/* Rotating featured fact */}
            <div className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-center shadow-lift sm:px-12">
              <div className="absolute inset-0 bg-dots-dark" aria-hidden="true" />
              <div className="absolute -top-20 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-primary-600/25 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-accent-300 ring-1 ring-white/15">
                  <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                  {featured?.topic} · university level
                </span>
                <p key={featured?.id} className="mt-5 animate-fade-in text-lg font-medium leading-relaxed text-slate-100 sm:text-xl">
                  {featured?.fact}
                </p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  {list.slice(0, 8).map((f, i) => (
                    <button
                      key={f.id}
                      type="button"
                      aria-label={`Show fact ${i + 1}`}
                      onClick={() => setFeaturedIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === featuredIndex % list.length
                          ? 'w-6 bg-accent-400'
                          : 'w-2 bg-white/25 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Fact grid */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.slice(0, 6).map((fact) => (
                <article
                  key={fact.id}
                  className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift dark:border-slate-700/60 dark:bg-slate-900"
                >
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-700 ring-1 ring-primary-100 dark:bg-primary-500/10 dark:text-primary-300 dark:ring-primary-500/20">
                    <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                    {fact.topic}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{fact.fact}</p>
                </article>
              ))}
            </div>

            {/* Member contribution */}
            {member ? (
              <div className="mt-8 text-center">
                {formOpen ? (
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="mx-auto max-w-xl space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 text-left shadow-card dark:border-slate-700/60 dark:bg-slate-900"
                  >
                    <div>
                      <label htmlFor="fact-text" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Your did-you-know <span className="text-primary-600 dark:text-primary-400">*</span>
                      </label>
                      <textarea
                        id="fact-text"
                        rows={3}
                        value={factText}
                        onChange={(e) => setFactText(e.target.value)}
                        placeholder="Share a university-level fact — precise, sourced, and a little mind-bending."
                        className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition-colors duration-200 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
                      />
                    </div>
                    <input
                      id="fact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Topic (e.g. Organic Chemistry)"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition-colors duration-200 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
                    />
                    {formError ? (
                      <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{formError}</p>
                    ) : null}
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" disabled={submitting}>
                        {submitting ? 'Sharing…' : <><Send className="h-4 w-4" aria-hidden="true" /> Share fact</>}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setFormOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => setFormOpen(true)}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add a did-you-know
                  </Button>
                )}
              </div>
            ) : (
              <p className="mt-8 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
                Club members can add their own facts — apply to join below.
              </p>
            )}
          </>
        )}
      </Container>
    </section>
  );
}

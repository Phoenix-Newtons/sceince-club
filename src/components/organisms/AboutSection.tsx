import { Quote } from 'lucide-react';
import { PARTNERS, VALUES } from '../../data/about';
import { useApi } from '../../hooks/useApi';
import type { Quote as QuoteType } from '../../types';
import { Avatar } from '../atoms/Avatar';
import { Container } from '../atoms/Container';
import { SectionHeading } from '../molecules/SectionHeading';

export function AboutSection() {
  const { data: quotes } = useApi<QuoteType[]>('/quotes');
  const activeQuote = quotes?.find((q) => q.active) ?? quotes?.[0];

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Mission + values */}
          <div>
            <SectionHeading
              align="left"
              eyebrow="About Nucleus"
              title="Curiosity, engineered."
              description="Founded in 2016, Nucleus is BSSM's student-run science club. We believe the best way to learn science is to do science — badly at first, then measurably better."
            />
            <div className="mt-8 space-y-5">
              {VALUES.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.id} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-primary-400 dark:ring-slate-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{value.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active quote + partners */}
          <div className="space-y-6">
            <figure className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-card dark:border-slate-700/60 dark:bg-slate-900">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-100/50 blur-2xl dark:bg-accent-500/10" aria-hidden="true" />
              <Quote className="h-8 w-8 text-primary-200 dark:text-primary-500/60" aria-hidden="true" />
              {activeQuote ? (
                <blockquote className="mt-4 text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                  “{activeQuote.text}”
                </blockquote>
              ) : (
                <blockquote className="mt-4 text-lg font-medium leading-relaxed text-slate-400 dark:text-slate-500">
                  No quote pinned yet — club members can add one from the admin panel.
                </blockquote>
              )}
              {activeQuote ? (
                <figcaption className="mt-6 flex items-center gap-3">
                  <Avatar name={activeQuote.author} size="md" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{activeQuote.author}</p>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{activeQuote.role}</p>
                  </div>
                </figcaption>
              ) : null}
            </figure>

            <div className="rounded-3xl border border-slate-200/80 bg-white/60 p-6 dark:border-slate-700/60 dark:bg-slate-900/60">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">In partnership with</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {PARTNERS.map((partner) => (
                  <span
                    key={partner}
                    className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

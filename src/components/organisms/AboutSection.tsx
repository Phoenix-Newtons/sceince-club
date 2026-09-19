import { Quote } from 'lucide-react';
import { ADVISOR_QUOTE, PARTNERS, VALUES } from '../../data/about';
import { Container } from '../atoms/Container';
import { Reveal } from '../atoms/Reveal';
import { Avatar } from '../atoms/Avatar';
import { SectionHeading } from '../molecules/SectionHeading';

export function AboutSection() {
  return (
    <section id="about" className="bg-surface-muted py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Mission + values */}
          <div>
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="About Nucleus"
                title="Curiosity, engineered."
                description="Founded in 2016, Nucleus is BSSM's student-run science club. We believe the best way to learn science is to do science — badly at first, then measurably better."
              />
            </Reveal>
            <div className="mt-8 space-y-5">
              {VALUES.map((value, i) => {
                const Icon = value.icon;
                return (
                  <Reveal key={value.id} delay={i * 80}>
                    <div className="flex gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm ring-1 ring-slate-200">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{value.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-500">{value.description}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Advisor quote + partners */}
          <div className="space-y-6">
            <Reveal delay={120}>
              <figure className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-card">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-100/50 blur-2xl" aria-hidden="true" />
                <Quote className="h-8 w-8 text-primary-200" aria-hidden="true" />
                <blockquote className="mt-4 text-lg font-medium leading-relaxed text-slate-700">
                  “{ADVISOR_QUOTE.text}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <Avatar name={ADVISOR_QUOTE.author} size="md" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{ADVISOR_QUOTE.author}</p>
                    <p className="text-xs font-medium text-slate-400">{ADVISOR_QUOTE.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={220}>
              <div className="rounded-3xl border border-slate-200/80 bg-white/60 p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">In partnership with</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {PARTNERS.map((partner) => (
                    <span
                      key={partner}
                      className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200"
                    >
                      {partner}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useJoinModal } from '../../context/JoinModalContext';
import { Button } from '../atoms/Button';
import { Container } from '../atoms/Container';

export function CtaBanner() {
  const { open } = useJoinModal();

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 text-center shadow-lift ring-1 ring-slate-900/5 sm:px-12 sm:py-20 dark:bg-slate-900 dark:ring-slate-700/50">
          <div className="absolute inset-0 bg-dots-dark" aria-hidden="true" />
          <div className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-primary-600/30 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-32 right-0 h-56 w-56 rounded-full bg-accent-500/20 blur-3xl" aria-hidden="true" />

          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-accent-300 ring-1 ring-white/15">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Fall 2026 cohort · Applications open
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to run your first experiment?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              No experience required — bring your questions and we'll bring the lab equipment, the mentors and
              the occasional liquid-nitrogen ice cream.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={open}>
                Join Nucleus today
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Link
                to="/events"
                className="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold text-slate-200 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Browse upcoming events
              </Link>
            </div>
            <p className="mt-6 text-xs font-medium text-slate-500">
              Free to join · Open to all BSSM students, grades 9–12
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { Telescope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { Container } from '../components/atoms/Container';

export function NotFoundPage() {
  return (
    <Container className="py-28 text-center sm:py-36">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100 dark:bg-primary-500/10 dark:text-primary-300 dark:ring-primary-500/20">
        <Telescope className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Lost in space
      </h1>
      <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-slate-500 dark:text-slate-400">
        This page drifted out of orbit. Let's get you back to the lab.
      </p>
      <div className="mt-8">
        <Link to="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </Container>
  );
}

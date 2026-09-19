import { CircleCheck, LoaderCircle, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { isValidEmail } from '../../lib/validation';
import { Button } from '../atoms/Button';

type Status = 'idle' | 'error' | 'submitting' | 'success';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    window.setTimeout(() => setStatus('success'), 1100);
  };

  if (status === 'success') {
    return (
      <p className="flex animate-fade-in items-center gap-2 text-sm font-semibold text-emerald-400">
        <CircleCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
        You're on the list — the first issue lands next month.
      </p>
    );
  }

  return (
    <form className="w-full max-w-md" onSubmit={handleSubmit} noValidate>
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          placeholder="you@bssm.edu"
          autoComplete="email"
          aria-invalid={status === 'error'}
          aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === 'error') setStatus('idle');
          }}
          className={`h-11 w-full min-w-0 rounded-xl border bg-slate-900 px-4 text-sm text-white placeholder:text-slate-500 transition-colors duration-200 focus:outline-none focus:ring-4 ${
            status === 'error'
              ? 'border-rose-500/60 focus:border-rose-400 focus:ring-rose-500/10'
              : 'border-white/10 hover:border-white/20 focus:border-accent-400 focus:ring-accent-500/10'
          }`}
        />
        <Button type="submit" disabled={status === 'submitting'} className="shrink-0">
          {status === 'submitting' ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">Subscribe</span>
        </Button>
      </div>
      {status === 'error' ? (
        <p id="newsletter-error" className="mt-2 animate-fade-in text-xs font-medium text-rose-400">
          That email doesn't look right — mind checking it?
        </p>
      ) : null}
    </form>
  );
}

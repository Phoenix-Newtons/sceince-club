import { KeyRound, LoaderCircle, ShieldCheck } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../atoms/Button';
import { TextField } from '../molecules/FormField';

export function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-card dark:border-slate-700/60 dark:bg-slate-900">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-md shadow-primary-600/25">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Admin sign-in</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Sign in to register members, approve applications and manage club content.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <TextField
            id="admin-email"
            label="Email"
            type="email"
            placeholder="you@nucleus.science"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="admin-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error ? (
            <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
              <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
              {error}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

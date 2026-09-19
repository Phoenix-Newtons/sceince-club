import { CircleAlert, RotateCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

/** Shown when an API request fails; offers a retry when possible. */
export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-rose-500/30 dark:bg-rose-500/10"
    >
      <p className="flex items-start gap-2 text-sm font-medium text-rose-700 dark:text-rose-300">
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {message}
      </p>
      {onRetry ? (
        <Button size="sm" variant="secondary" onClick={onRetry} className="shrink-0">
          <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
          Retry
        </Button>
      ) : null}
    </div>
  );
}

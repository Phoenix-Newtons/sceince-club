interface SkeletonProps {
  className?: string;
}

/** Shimmering placeholder shown while data loads. */
export function Skeleton({ className = '' }: SkeletonProps) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80 ${className}`} />;
}

import type { Contributor } from '../../types';
import { Avatar } from '../atoms/Avatar';

interface AvatarStackProps {
  people: Contributor[];
  max?: number;
}

export function AvatarStack({ people, max = 4 }: AvatarStackProps) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div className="flex -space-x-2">
      {shown.map((person) => (
        <Avatar key={person.name} name={person.name} size="sm" />
      ))}
      {extra > 0 ? (
        <span
          title={`${extra} more contributors`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500 ring-2 ring-white dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-900"
        >
          +{extra}
        </span>
      ) : null}
    </div>
  );
}

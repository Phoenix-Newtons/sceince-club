const PALETTES = [
  'from-primary-500 to-accent-400',
  'from-cyan-500 to-blue-500',
  'from-violet-500 to-purple-400',
  'from-emerald-500 to-teal-400',
  'from-amber-500 to-orange-400',
  'from-rose-500 to-pink-400',
] as const;

type AvatarSize = 'xs' | 'sm' | 'md';

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
};

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

/** Deterministic gradient per name so the same person always gets the same colours. */
function paletteFor(name: string): string {
  let hash = 0;
  for (const ch of name) {
    hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  }
  return PALETTES[hash % PALETTES.length];
}

interface AvatarProps {
  name: string;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ name, size = 'sm', className = '' }: AvatarProps) {
  return (
    <span
      title={name}
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br font-bold text-white ring-2 ring-white ${paletteFor(name)} ${SIZE_CLASSES[size]} ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
}

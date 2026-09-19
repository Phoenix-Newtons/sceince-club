import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex select-none items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:pointer-events-none disabled:opacity-60';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white shadow-sm hover:-translate-y-0.5 hover:bg-primary-500 hover:shadow-lift active:translate-y-0 active:shadow-sm',
  secondary:
    'bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:-translate-y-0.5 hover:text-primary-700 hover:shadow-md hover:ring-primary-300 active:translate-y-0 dark:bg-slate-800/90 dark:text-slate-200 dark:ring-slate-700 dark:hover:text-primary-300 dark:hover:ring-primary-500/40',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
  dark: 'bg-slate-900 text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

/** Shared class builder so plain <a> elements can look like Buttons too. */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className = '',
): string {
  return [BASE, VARIANTS[variant], SIZES[size], className].filter(Boolean).join(' ');
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

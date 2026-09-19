import { ChevronDown, CircleAlert, CircleCheck } from 'lucide-react';
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

interface FieldChrome {
  id: string;
  label: string;
  error?: string;
  touched?: boolean;
  hint?: string;
  required?: boolean;
}

function controlClasses(error?: string, touched?: boolean): string {
  const base =
    'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition-colors duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-4';
  const invalid = Boolean(error && touched);
  return invalid
    ? `${base} border-rose-300 focus:border-rose-400 focus:ring-rose-100`
    : `${base} border-slate-200 hover:border-slate-300 focus:border-primary-400 focus:ring-primary-100`;
}

function FieldShell({
  id,
  label,
  error,
  touched,
  hint,
  required,
  children,
}: FieldChrome & { children: ReactNode }) {
  const invalid = Boolean(error && touched);
  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
        {required ? (
          <span className="ml-0.5 text-primary-600" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {invalid ? (
        <p id={`${id}-error`} className="flex animate-fade-in items-center gap-1 text-xs font-medium text-rose-600">
          <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

/* ---------- Text ---------- */

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'>, FieldChrome {}

export function TextField({ id, label, error, touched, hint, required, value, ...rest }: TextFieldProps) {
  const valid = Boolean(touched && !error && value);
  return (
    <FieldShell id={id} label={label} error={error} touched={touched} hint={hint} required={required}>
      <div className="relative">
        <input
          id={id}
          value={value}
          required={required}
          aria-invalid={Boolean(error && touched)}
          aria-describedby={error && touched ? `${id}-error` : undefined}
          className={controlClasses(error, touched)}
          {...rest}
        />
        {valid ? (
          <CircleCheck
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500"
            aria-hidden="true"
          />
        ) : null}
      </div>
    </FieldShell>
  );
}

/* ---------- Select ---------- */

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'className'>,
    FieldChrome {
  options: SelectOption[];
  placeholder?: string;
}

export function SelectField({
  id,
  label,
  error,
  touched,
  hint,
  required,
  value,
  options,
  placeholder = 'Select…',
  ...rest
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} touched={touched} hint={hint} required={required}>
      <div className="relative">
        <select
          id={id}
          value={value}
          required={required}
          aria-invalid={Boolean(error && touched)}
          aria-describedby={error && touched ? `${id}-error` : undefined}
          className={`${controlClasses(error, touched)} appearance-none pr-10 ${value === '' ? 'text-slate-400' : ''}`}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-slate-800">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    </FieldShell>
  );
}

/* ---------- Textarea ---------- */

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className'>, FieldChrome {}

export function TextArea({ id, label, error, touched, hint, required, ...rest }: TextAreaProps) {
  return (
    <FieldShell id={id} label={label} error={error} touched={touched} hint={hint} required={required}>
      <textarea
        id={id}
        required={required}
        rows={3}
        aria-invalid={Boolean(error && touched)}
        aria-describedby={error && touched ? `${id}-error` : undefined}
        className={`${controlClasses(error, touched)} resize-none`}
        {...rest}
      />
    </FieldShell>
  );
}

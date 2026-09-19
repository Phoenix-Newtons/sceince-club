import { Rocket, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useJoinModal } from '../../context/JoinModalContext';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { isValidEmail } from '../../lib/validation';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { SelectField, TextArea, TextField } from '../molecules/FormField';

interface JoinFormValues {
  name: string;
  email: string;
  grade: string;
  interest: string;
  message: string;
}

type JoinFormErrors = Partial<Record<keyof JoinFormValues, string>>;
type FieldTouched = Partial<Record<keyof JoinFormValues, boolean>>;
type SubmitStatus = 'idle' | 'submitting' | 'success';

const GRADE_OPTIONS = [
  { value: 'grade-9', label: 'Grade 9' },
  { value: 'grade-10', label: 'Grade 10' },
  { value: 'grade-11', label: 'Grade 11' },
  { value: 'grade-12', label: 'Grade 12' },
];

const INTEREST_OPTIONS = [
  { value: 'physics', label: 'Physics Lab' },
  { value: 'astronomy', label: 'Astronomy & Astrophysics' },
  { value: 'chemistry', label: 'Molecular Chemistry' },
  { value: 'robotics', label: 'Robotics Experiments' },
  { value: 'bio', label: 'Bio Engineering' },
  { value: 'quantum', label: 'Quantum Computing' },
];

const INITIAL_VALUES: JoinFormValues = { name: '', email: '', grade: '', interest: '', message: '' };

function validate(values: JoinFormValues): JoinFormErrors {
  const errors: JoinFormErrors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (!isValidEmail(values.email)) errors.email = 'Enter a valid school email address.';
  if (!values.grade) errors.grade = 'Select your grade.';
  if (!values.interest) errors.interest = 'Pick a primary interest.';
  return errors;
}

function SuccessCheck() {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" role="img" aria-label="Application submitted">
      <circle cx="60" cy="60" r="48" fill="none" stroke="#d1fae5" strokeWidth="8" />
      <circle
        cx="60"
        cy="60"
        r="48"
        fill="none"
        stroke="#10b981"
        strokeWidth="8"
        strokeLinecap="round"
        className="animate-draw-circle"
        transform="rotate(-90 60 60)"
      />
      <path
        d="M40 62 L54 76 L82 46"
        fill="none"
        stroke="#10b981"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw-check"
      />
    </svg>
  );
}

export function JoinModal() {
  const { isOpen, close } = useJoinModal();
  const [values, setValues] = useState<JoinFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<JoinFormErrors>({});
  const [touched, setTouched] = useState<FieldTouched>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [applicationId, setApplicationId] = useState('');

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    // Fresh form every time the dialog opens
    setValues(INITIAL_VALUES);
    setErrors({});
    setTouched({});
    setStatus('idle');
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  const setField = (field: keyof JoinFormValues) => (value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
  };

  const blurField = (field: keyof JoinFormValues) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, grade: true, interest: true, message: true });
    if (Object.keys(nextErrors).length > 0) return;
    setStatus('submitting');
    // Simulated network round-trip — swap for a real POST when the API lands.
    window.setTimeout(() => {
      setApplicationId(`NCL-26-${Math.floor(100 + Math.random() * 900)}`);
      setStatus('success');
    }, 1400);
  };

  const firstName = values.name.trim().split(' ')[0] || 'scientist';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 animate-fade-in bg-slate-950/60 backdrop-blur-sm" onClick={close} aria-hidden="true" />

      {/* Panel */}
      <div className="relative flex max-h-[92dvh] w-full max-w-lg animate-scale-in flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        {status === 'success' ? (
          <div className="flex flex-col items-center px-8 py-12 text-center">
            <SuccessCheck />
            <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900">Application received!</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
              Nice one, <span className="font-semibold text-slate-700">{firstName}</span>. We'll email{' '}
              <span className="font-semibold text-slate-700">{values.email}</span> with your interview slot within
              a week. Applicant ID:{' '}
              <span className="font-mono font-semibold text-primary-700">{applicationId}</span>
            </p>
            <Button size="lg" className="mt-8 w-full" onClick={close}>
              Done
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-md shadow-primary-600/25">
                <Rocket className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 id="join-title" className="text-lg font-extrabold tracking-tight text-slate-900">
                  Join the club
                </h2>
                <p className="truncate text-sm text-slate-500">Fall 2026 applications close October 10.</p>
              </div>
              <IconButton label="Close dialog" className="ml-auto" onClick={close}>
                <X className="h-5 w-5" aria-hidden="true" />
              </IconButton>
            </div>

            {/* Form */}
            <form className="flex-1 space-y-4 overflow-y-auto px-6 py-6" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  id="join-name"
                  label="Full name"
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                  required
                  value={values.name}
                  error={errors.name}
                  touched={touched.name}
                  onChange={(e) => setField('name')(e.target.value)}
                  onBlur={blurField('name')}
                />
                <TextField
                  id="join-email"
                  label="School email"
                  type="email"
                  placeholder="ada@bssm.edu"
                  autoComplete="email"
                  required
                  value={values.email}
                  error={errors.email}
                  touched={touched.email}
                  onChange={(e) => setField('email')(e.target.value)}
                  onBlur={blurField('email')}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  id="join-grade"
                  label="Grade"
                  placeholder="Choose your grade…"
                  required
                  options={GRADE_OPTIONS}
                  value={values.grade}
                  error={errors.grade}
                  touched={touched.grade}
                  onChange={(e) => setField('grade')(e.target.value)}
                  onBlur={blurField('grade')}
                />
                <SelectField
                  id="join-interest"
                  label="Primary interest"
                  placeholder="Choose a domain…"
                  required
                  options={INTEREST_OPTIONS}
                  value={values.interest}
                  error={errors.interest}
                  touched={touched.interest}
                  onChange={(e) => setField('interest')(e.target.value)}
                  onBlur={blurField('interest')}
                />
              </div>

              <TextArea
                id="join-message"
                label="What would you love to build or investigate?"
                placeholder="e.g. A weather balloon that streams telemetry to the club dashboard…"
                hint="Optional — but great applications usually mention a question."
                value={values.message}
                onChange={(e) => setField('message')(e.target.value)}
              />

              <div className="space-y-3 pt-1">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  We review applications every Friday — no experience required.
                </p>
                <Button type="submit" size="lg" className="w-full" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Submitting application…' : 'Submit application'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

import { LoaderCircle, Rocket, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type { Project, ProjectCategory, ProjectDraft, ProjectStatus } from '../../types';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { SelectField, TextArea, TextField } from '../molecules/FormField';

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CATEGORY_OPTIONS: { value: ProjectCategory; label: string }[] = [
  { value: 'robotics', label: 'Robotics' },
  { value: 'eco', label: 'Eco-Science' },
  { value: 'space', label: 'Space' },
];

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Peer Review', label: 'Peer Review' },
  { value: 'Recruiting', label: 'Recruiting' },
  { value: 'Completed', label: 'Completed' },
];

const EMPTY_DRAFT: ProjectDraft = {
  title: '',
  category: 'robotics',
  status: 'In Progress',
  progress: 10,
  summary: '',
  leadName: '',
  tags: [],
};

type DraftErrors = Partial<Record<keyof ProjectDraft | 'tags', string>>;

export function ProjectFormModal({ open, onClose, onCreated }: ProjectFormModalProps) {
  const { member } = useAuth();
  const [draft, setDraft] = useState<ProjectDraft>(EMPTY_DRAFT);
  const [tagsText, setTagsText] = useState('');
  const [errors, setErrors] = useState<DraftErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setDraft({ ...EMPTY_DRAFT, leadName: member?.name ?? '' });
    setTagsText('');
    setErrors({});
    setSubmitted(false);
    setSubmitting(false);
    setServerError(null);
  }, [open, member]);

  useLockBodyScrollEffect(open);

  if (!open) return null;

  const validate = (d: ProjectDraft, tags: string[]): DraftErrors => {
    const next: DraftErrors = {};
    if (d.title.trim().length < 4) next.title = 'Give the project a title (at least 4 characters).';
    if (d.summary.trim().length < 10) next.summary = 'Add a short summary (at least 10 characters).';
    if (tags.length === 0) next.tags = 'Add at least one tag so people can find it.';
    return next;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tags = tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 6);
    const nextErrors = validate(draft, tags);
    setErrors(nextErrors);
    setSubmitted(true);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setServerError(null);
    try {
      await api<Project>('/projects', { method: 'POST', body: { ...draft, tags } });
      onCreated();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Could not publish the project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="project-form-title">
      <div className="absolute inset-0 animate-fade-in bg-slate-950/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative flex max-h-[92dvh] w-full max-w-lg animate-scale-in flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl dark:bg-slate-900">
        <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-md shadow-primary-600/25">
            <Rocket className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id="project-form-title" className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Share a project
            </h2>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
              Publish what your team is working on to the board.
            </p>
          </div>
          <IconButton label="Close dialog" className="ml-auto" onClick={onClose}>
            <X className="h-5 w-5" aria-hidden="true" />
          </IconButton>
        </div>

        <form className="flex-1 space-y-4 overflow-y-auto px-6 py-6" onSubmit={handleSubmit} noValidate>
          <TextField
            id="project-title"
            label="Project title"
            placeholder="e.g. Weather balloon telemetry dashboard"
            required
            value={draft.title}
            error={errors.title}
            touched={submitted}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              id="project-category"
              label="Category"
              required
              options={CATEGORY_OPTIONS}
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as ProjectCategory }))}
            />
            <SelectField
              id="project-status"
              label="Status"
              required
              options={STATUS_OPTIONS}
              value={draft.status}
              onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as ProjectStatus }))}
            />
          </div>

          <div>
            <label htmlFor="project-progress" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Progress <span className="tabular-nums text-primary-600 dark:text-primary-400">{draft.progress}%</span>
            </label>
            <input
              id="project-progress"
              type="range"
              min={0}
              max={100}
              step={5}
              value={draft.progress}
              onChange={(e) => setDraft((d) => ({ ...d, progress: Number(e.target.value) }))}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-primary-600 dark:bg-slate-800"
            />
          </div>

          <TextArea
            id="project-summary"
            label="Summary"
            placeholder="What are you building, and what question does it answer?"
            required
            value={draft.summary}
            error={errors.summary}
            touched={submitted}
            onChange={(e) => setDraft((d) => ({ ...d, summary: e.target.value }))}
          />

          <TextField
            id="project-lead"
            label="Project lead"
            placeholder="Who is leading the build?"
            value={draft.leadName}
            onChange={(e) => setDraft((d) => ({ ...d, leadName: e.target.value }))}
            hint="Leave as-is to list yourself as lead."
          />

          <TextField
            id="project-tags"
            label="Tags"
            placeholder="e.g. Telemetry, Arduino, Solar"
            value={tagsText}
            error={errors.tags}
            touched={submitted}
            onChange={(e) => setTagsText(e.target.value)}
            hint="Comma-separated, up to 6."
          />

          {serverError ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {serverError}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                Publishing…
              </>
            ) : (
              'Publish project'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

/* Local scroll-lock so this modal doesn't depend on call order of hooks above */
function useLockBodyScrollEffect(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

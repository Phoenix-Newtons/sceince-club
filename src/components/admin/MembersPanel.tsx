import { useState, type FormEvent } from 'react';
import { LoaderCircle, Trash2, UserPlus } from 'lucide-react';
import type { Member, Role } from '../../types';
import { api } from '../../api/client';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { ErrorBanner } from '../atoms/ErrorBanner';
import { Skeleton } from '../atoms/Skeleton';
import { Avatar } from '../atoms/Avatar';
import { SelectField, TextField } from '../molecules/FormField';
import { AdminCard, AdminRow } from './AdminUI';

const ROLE_OPTIONS = [
  { value: 'member', label: 'Member — can add projects, quotes & facts' },
  { value: 'admin', label: 'Admin — full management access' },
];

export function MembersPanel() {
  const { member: current } = useAuth();
  const { data, loading, error, reload } = useApi<Member[]>('/members');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('member');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim().length < 2 || password.length < 8) {
      setFormError('Enter a full name and a password of at least 8 characters.');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await api<Member>('/members', { method: 'POST', body: { name, email, password, role } });
      setName('');
      setEmail('');
      setPassword('');
      setRole('member');
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (member: Member) => {
    if (!window.confirm(`Remove ${member.name}'s account?`)) return;
    try {
      await api<void>(`/members/${member.id}`, { method: 'DELETE' });
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not remove the member.');
    }
  };

  return (
    <div className="space-y-6">
      <AdminCard title="Register a new member">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleRegister} noValidate>
          <TextField
            id="member-name"
            label="Full name"
            placeholder="e.g. Ada Lovelace"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="member-email"
            label="Email"
            type="email"
            placeholder="ada@bssm.edu"
            autoComplete="off"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="member-password"
            label="Temporary password"
            type="text"
            placeholder="At least 8 characters"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SelectField
            id="member-role"
            label="Role"
            required
            options={ROLE_OPTIONS}
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          />
          {formError ? (
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400 sm:col-span-2">{formError}</p>
          ) : null}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <UserPlus className="h-4 w-4" aria-hidden="true" />
              )}
              Create account
            </Button>
          </div>
        </form>
      </AdminCard>

      <AdminCard title={`Members (${data?.length ?? 0})`}>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <ErrorBanner message={error} onRetry={() => void reload()} />
        ) : (
          <div className="space-y-3">
            {(data ?? []).map((member) => (
              <AdminRow key={member.id}>
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={member.name} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {member.name}
                      {member.id === current?.id ? (
                        <span className="ml-2 text-xs font-semibold text-primary-500">you</span>
                      ) : null}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={member.role === 'admin' ? 'progress' : 'neutral'}>
                    {member.role === 'admin' ? 'Admin' : 'Member'}
                  </Badge>
                  {member.id === current?.id ? null : (
                    <button
                      type="button"
                      aria-label={`Remove ${member.name}`}
                      onClick={() => void handleDelete(member)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </AdminRow>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

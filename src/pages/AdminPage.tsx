import { useState } from 'react';
import { ClipboardList, Layers, Lightbulb, LogOut, Newspaper, Quote as QuoteIcon, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/atoms/Avatar';
import { Badge } from '../components/atoms/Badge';
import { Button } from '../components/atoms/Button';
import { Container } from '../components/atoms/Container';
import { Skeleton } from '../components/atoms/Skeleton';
import { AdminLogin } from '../components/admin/AdminLogin';
import { ApplicationsPanel } from '../components/admin/ApplicationsPanel';
import { MembersPanel } from '../components/admin/MembersPanel';
import { ProjectsPanel } from '../components/admin/ProjectsPanel';
import { QuotesPanel } from '../components/admin/QuotesPanel';
import { FactsPanel } from '../components/admin/FactsPanel';
import { NoticesPanel } from '../components/admin/NoticesPanel';

type AdminTab = 'applications' | 'members' | 'projects' | 'quotes' | 'facts' | 'notices';

const TABS: { id: AdminTab; label: string; icon: typeof Users }[] = [
  { id: 'applications', label: 'Applications', icon: ClipboardList },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'projects', label: 'Projects', icon: Layers },
  { id: 'quotes', label: 'Quotes', icon: QuoteIcon },
  { id: 'facts', label: 'Did-you-knows', icon: Lightbulb },
  { id: 'notices', label: 'Notices', icon: Newspaper },
];

export function AdminPage() {
  const { member, initializing, logout } = useAuth();
  const [tab, setTab] = useState<AdminTab>('applications');

  if (initializing) {
    return (
      <Container className="py-24">
        <div className="mx-auto max-w-md space-y-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </Container>
    );
  }

  if (!member) {
    return (
      <Container className="py-20 sm:py-24">
        <AdminLogin />
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between dark:border-slate-700/60 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <Avatar name={member.name} size="md" />
          <div>
            <p className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">{member.name}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge tone={member.role === 'admin' ? 'progress' : 'neutral'} dot>
                {member.role === 'admin' ? 'Administrator' : 'Member'}
              </Badge>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{member.email}</span>
            </div>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => void logout()}>
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </Button>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Admin sections">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                active
                  ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:text-slate-900 hover:shadow-sm dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="mt-6 animate-fade-in" key={tab}>
        {tab === 'applications' ? <ApplicationsPanel /> : null}
        {tab === 'members' ? <MembersPanel /> : null}
        {tab === 'projects' ? <ProjectsPanel /> : null}
        {tab === 'quotes' ? <QuotesPanel /> : null}
        {tab === 'facts' ? <FactsPanel /> : null}
        {tab === 'notices' ? <NoticesPanel /> : null}
      </div>
    </Container>
  );
}

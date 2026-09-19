import { ArrowRight, Atom, LogOut, X } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../../data/navigation';
import { useAuth } from '../../context/AuthContext';
import { useJoinModal } from '../../context/JoinModalContext';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { ThemeToggle } from '../atoms/ThemeToggle';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { member, logout } = useAuth();
  const { open: openJoin } = useJoinModal();
  const { pathname } = useLocation();
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Club menu"
        inert={!open}
        className={`absolute right-0 top-0 flex h-full w-80 max-w-[86vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-slate-950 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white">
              <Atom className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">Nucleus</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <IconButton label="Close menu" onClick={onClose}>
              <X className="h-5 w-5" aria-hidden="true" />
            </IconButton>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const active = link.end ? pathname === link.to : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors duration-200 ${
                  active
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4 border-t border-slate-100 px-5 py-5 dark:border-slate-800">
          {member ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-400 text-sm font-bold text-white">
                  {member.name.split(' ').map((p) => p.charAt(0).toUpperCase()).slice(0, 2).join('')}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">{member.name}</span>
                  <span className="block text-xs font-semibold capitalize text-primary-600 dark:text-primary-400">
                    {member.role}
                  </span>
                </span>
              </div>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  onClose();
                  void logout();
                }}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                onClose();
                openJoin();
              }}
            >
              Join Club
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}

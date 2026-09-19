import { ArrowRight, Atom, X } from 'lucide-react';
import { useEffect } from 'react';
import { MEMBER_BADGE, NAV_LINKS } from '../../data/navigation';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import type { SectionId } from '../../types';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  active: SectionId;
  onJoin: () => void;
}

export function MobileDrawer({ open, onClose, active, onJoin }: MobileDrawerProps) {
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
        className={`absolute right-0 top-0 flex h-full w-80 max-w-[86vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white">
              <Atom className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-base font-extrabold tracking-tight text-slate-900">Nucleus</span>
          </span>
          <IconButton label="Close menu" onClick={onClose}>
            <X className="h-5 w-5" aria-hidden="true" />
          </IconButton>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={onClose}
                aria-current={active === link.id ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors duration-200 ${
                  active === link.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="space-y-4 border-t border-slate-100 px-5 py-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {MEMBER_BADGE.count} {MEMBER_BADGE.label}
          </span>
          <Button className="w-full" onClick={onJoin}>
            Join Club
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </aside>
    </div>
  );
}

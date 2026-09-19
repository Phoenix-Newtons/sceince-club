import { ArrowRight, Atom, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MEMBER_BADGE, NAV_LINKS } from '../../data/navigation';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useJoinModal } from '../../context/JoinModalContext';
import { Button } from '../atoms/Button';
import { Container } from '../atoms/Container';
import { IconButton } from '../atoms/IconButton';
import { MobileDrawer } from './MobileDrawer';

function StatusDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
    </span>
  );
}

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useScrollSpy();
  const { open } = useJoinModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-xl'
            : 'border-b border-transparent bg-white/70 backdrop-blur-md'
        }`}
      >
        <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          {/* Brand */}
          <a href="#home" className="flex items-center gap-2.5" aria-label="Nucleus — back to top">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-md shadow-primary-600/25">
              <Atom className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-extrabold tracking-tight text-slate-900">Nucleus</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                BSSM Science Club
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={active === link.id ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                  active === link.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 xl:inline-flex">
              <StatusDot />
              {MEMBER_BADGE.count} {MEMBER_BADGE.label}
            </span>
            <Button size="sm" onClick={open} className="hidden sm:inline-flex">
              Join Club
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <IconButton label="Open menu" className="md:hidden" onClick={() => setDrawerOpen(true)}>
              <Menu className="h-5 w-5" aria-hidden="true" />
            </IconButton>
          </div>
        </Container>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        active={active}
        onJoin={() => {
          setDrawerOpen(false);
          open();
        }}
      />
    </>
  );
}

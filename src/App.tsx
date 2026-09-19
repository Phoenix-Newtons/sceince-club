import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JoinModalProvider } from './context/JoinModalContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/organisms/Navbar';
import { Footer } from './components/organisms/Footer';
import { JoinModal } from './components/organisms/JoinModal';
import { BackToTop } from './components/organisms/BackToTop';
import { LandingPage } from './pages/LandingPage';
import { NotFoundPage } from './pages/NotFoundPage';

/* ------------------------------------------------------------------ *
 * Code splitting
 *
 * Every non-landing route is a separate chunk; Three.js only enters the
 * graph via the landing's dynamic logo import. Chunks are then prefetched
 * speculatively (see `useSpeculativePrefetch`) so navigation never waits on
 * the network.
 * ------------------------------------------------------------------ */

const EventsPage = lazy(() =>
  import('./pages/EventsPage').then((m) => ({ default: m.EventsPage })),
);
const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
);
const GalleryPage = lazy(() =>
  import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage })),
);
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })));

/** Prefetch the route chunks during idle time — never competes with the preloader. */
function useSpeculativePrefetch(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const warm = () => {
      void import('./pages/EventsPage');
      void import('./pages/ProjectsPage');
      void import('./pages/AboutPage');
      void import('./pages/GalleryPage');
    };
    const hasIdle = typeof window.requestIdleCallback === 'function';
    const idle = hasIdle
      ? window.requestIdleCallback(warm, { timeout: 4000 })
      : window.setTimeout(warm, 2500);

    return () => {
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [enabled]);
}

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#05070D]">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/35">Loading…</span>
    </div>
  );
}

/** The classic portal chrome (navbar + footer) used by every non-landing route. */
function PortalShell() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      {/* Spacer for the fixed navbar */}
      <div className="h-16 lg:h-[4.5rem]" aria-hidden="true" />
      <main id="main" className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/events" element={<EventsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Shell() {
  const { pathname } = useLocation();
  const onLanding = pathname === '/';
  useSpeculativePrefetch(onLanding);

  return (
    <>
      {/* Skip link for keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-lg"
      >
        Skip to content
      </a>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<PortalShell />} />
      </Routes>

      <JoinModal />
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <JoinModalProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Shell />
          </BrowserRouter>
        </JoinModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

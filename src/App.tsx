import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JoinModalProvider } from './context/JoinModalContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/organisms/Navbar';
import { Footer } from './components/organisms/Footer';
import { JoinModal } from './components/organisms/JoinModal';
import { BackToTop } from './components/organisms/BackToTop';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <JoinModalProvider>
          <BrowserRouter>
            <ScrollToTop />
            {/* Skip link for keyboard users */}
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-lg"
            >
              Skip to content
            </a>

            <div className="flex min-h-dvh flex-col">
              <Navbar />
              {/* Spacer for the fixed navbar */}
              <div className="h-16 lg:h-[4.5rem]" aria-hidden="true" />
              <main id="main" className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>

            <JoinModal />
            <BackToTop />
          </BrowserRouter>
        </JoinModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

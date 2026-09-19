import { JoinModalProvider } from './context/JoinModalContext';
import { Navbar } from './components/organisms/Navbar';
import { Hero } from './components/organisms/Hero';
import { FeaturesSection } from './components/organisms/FeaturesSection';
import { AnnouncementsSection } from './components/organisms/AnnouncementsSection';
import { ProjectsSection } from './components/organisms/ProjectsSection';
import { GallerySection } from './components/organisms/GallerySection';
import { AboutSection } from './components/organisms/AboutSection';
import { CtaBanner } from './components/organisms/CtaBanner';
import { Footer } from './components/organisms/Footer';
import { JoinModal } from './components/organisms/JoinModal';
import { BackToTop } from './components/organisms/BackToTop';

export default function App() {
  return (
    <JoinModalProvider>
      {/* Skip link for keyboard users */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-lg"
      >
        Skip to content
      </a>

      <Navbar />

      <main>
        <Hero />
        <FeaturesSection />
        <AnnouncementsSection />
        <ProjectsSection />
        <GallerySection />
        <AboutSection />
        <CtaBanner />
      </main>

      <Footer />
      <JoinModal />
      <BackToTop />
    </JoinModalProvider>
  );
}

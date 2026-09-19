import { Hero } from '../components/organisms/Hero';
import { FeaturesSection } from '../components/organisms/FeaturesSection';
import { DidYouKnowSection } from '../components/organisms/DidYouKnowSection';
import { CtaBanner } from '../components/organisms/CtaBanner';

export function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <DidYouKnowSection />
      <CtaBanner />
    </>
  );
}

import { FEATURES } from '../../data/features';
import { Container } from '../atoms/Container';
import { Reveal } from '../atoms/Reveal';
import { FeatureCard } from '../molecules/FeatureCard';
import { SectionHeading } from '../molecules/SectionHeading';

export function FeaturesSection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24 dark:bg-slate-900/40">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="What we do"
            title="Six disciplines, one club"
            description="Pick a bench and get your hands busy — every domain runs weekly sessions, shared equipment and mentor office hours."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.id} delay={(i % 3) * 90} className="h-full">
              <FeatureCard feature={feature} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

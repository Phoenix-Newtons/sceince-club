import { GALLERY_TILES } from '../../data/gallery';
import { Container } from '../atoms/Container';
import { Reveal } from '../atoms/Reveal';
import { GalleryTile } from '../molecules/GalleryTile';
import { SectionHeading } from '../molecules/SectionHeading';

export function GallerySection() {
  return (
    <section id="gallery" className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="From the field"
            title="Moments from the lab"
            description="Field tests, launch days and 2 a.m. data runs — a season in the life of the club."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_TILES.map((tile, i) => (
            <Reveal key={tile.id} delay={(i % 3) * 90}>
              <GalleryTile tile={tile} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

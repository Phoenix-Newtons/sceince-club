import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../data/navigation';
import type { SectionId } from '../types';

/**
 * Scroll-spy: returns the id of the section currently in view,
 * used to highlight the active navigation link.
 */
export function useScrollSpy(offset = 140): SectionId {
  const [active, setActive] = useState<SectionId>('home');

  useEffect(() => {
    const ids = NAV_LINKS.map((link) => link.id);
    const lastId = ids[ids.length - 1] ?? 'home';

    const onScroll = () => {
      let current: SectionId = 'home';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }
      // Pin the final nav item once the page bottom is reached.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = lastId;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [offset]);

  return active;
}

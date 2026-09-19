import { Binary, Bot, Dna, FlaskConical, Magnet, Telescope } from 'lucide-react';
import type { Feature } from '../types';

export const FEATURES: Feature[] = [
  {
    id: 'physics',
    title: 'Physics Lab',
    description:
      'From pendulums to precision optics — bench experiments, error-analysis clinics and the annual build-anything kinematics contest.',
    icon: Magnet,
    accent: 'indigo',
    membersActive: 34,
    cadence: 'Thursdays · Lab 2',
  },
  {
    id: 'astronomy',
    title: 'Astronomy & Astrophysics',
    description:
      'Star parties on the ridge, telescope-building workshops and a shared photometry rig tracking exoplanet transits.',
    icon: Telescope,
    accent: 'cyan',
    membersActive: 27,
    cadence: 'Fortnightly · Ridge Observatory',
  },
  {
    id: 'chemistry',
    title: 'Molecular Chemistry',
    description:
      'Synthesis, titration and chromatography in our fume-hood wet lab, mentored by university chemists every session.',
    icon: FlaskConical,
    accent: 'violet',
    membersActive: 22,
    cadence: 'Wednesdays · Chem Lab',
  },
  {
    id: 'robotics',
    title: 'Robotics Experiments',
    description:
      'Design, print and program competition rovers — then defend your engineering decisions in front of judges at regionals.',
    icon: Bot,
    accent: 'emerald',
    membersActive: 31,
    cadence: 'Tue & Sat · Makerspace',
  },
  {
    id: 'bio',
    title: 'Bio Engineering',
    description:
      'Microscopy, gel electrophoresis and a citizen-science creek survey run with real lab protocols and open data.',
    icon: Dna,
    accent: 'rose',
    membersActive: 19,
    cadence: 'Mondays · Bio Lab 3',
  },
  {
    id: 'quantum',
    title: 'Quantum Computing',
    description:
      "A weekly journal club on qubits, circuits and Shor's algorithm — run with mentors from the city university physics department.",
    icon: Binary,
    accent: 'amber',
    membersActive: 12,
    cadence: 'Fridays · Room 204',
  },
];

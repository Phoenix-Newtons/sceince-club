import { Bot, BrainCircuit, Dna, FlaskConical, Rocket, Telescope } from 'lucide-react';
import type { GalleryTileData } from '../types';

export const GALLERY_TILES: GalleryTileData[] = [
  {
    id: 'rover-field',
    title: 'Rover Mk-II field test',
    meta: 'Makerspace yard · Sep 2026',
    category: 'Robotics',
    icon: Bot,
    gradient: 'from-indigo-500 via-indigo-600 to-blue-700',
  },
  {
    id: 'saturn-opposition',
    title: 'Saturn at opposition',
    meta: 'Ridge Observatory · Aug 2026',
    category: 'Astronomy',
    icon: Telescope,
    gradient: 'from-cyan-500 via-sky-600 to-indigo-700',
  },
  {
    id: 'titration-finals',
    title: 'Titration championship finals',
    meta: 'Chem Lab · May 2026',
    category: 'Chemistry',
    icon: FlaskConical,
    gradient: 'from-violet-500 via-purple-600 to-fuchsia-700',
  },
  {
    id: 'aurora-static',
    title: 'Aurora-I static-fire stand',
    meta: 'Propulsion bench · in build',
    category: 'Propulsion',
    icon: Rocket,
    gradient: 'from-rose-500 via-red-600 to-orange-600',
  },
  {
    id: 'gel-run',
    title: 'Gel electrophoresis run',
    meta: 'Bio Lab 3 · Oct 2026',
    category: 'Bio Lab',
    icon: Dna,
    gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
  },
  {
    id: 'journal-club',
    title: 'Quantum journal club',
    meta: 'Room 204 · every Friday',
    category: 'Quantum',
    icon: BrainCircuit,
    gradient: 'from-amber-500 via-orange-600 to-rose-600',
  },
];

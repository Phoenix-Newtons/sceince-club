import { BookOpen, Lightbulb, ShieldCheck } from 'lucide-react';
import type { AboutValue } from '../types';

export const VALUES: AboutValue[] = [
  {
    id: 'question-first',
    icon: Lightbulb,
    title: 'Question first',
    description:
      'Every project starts with a hypothesis we can defend — and a measurement that could prove us wrong.',
  },
  {
    id: 'safety-always',
    icon: ShieldCheck,
    title: 'Safety always',
    description:
      'Written risk assessments, buddy checks and mentor sign-off before anything touches a flame or a fume hood.',
  },
  {
    id: 'publish-everything',
    icon: BookOpen,
    title: 'Publish everything',
    description:
      'Protocols, raw data and failed runs all go into the club archive — science you can check is science worth doing.',
  },
];

export const ADVISOR_QUOTE = {
  text: 'The best experiments start with a question nobody in the room has asked yet. Our job is to keep the room full of those questions.',
  author: 'Dr. Hannah Cho',
  role: 'Faculty Advisor · Physics',
} as const;

export const PARTNERS: string[] = [
  'City University Physics Dept.',
  'Ridge Observatory',
  'FabLab Makerspace',
  'Valley Astronomy Society',
];

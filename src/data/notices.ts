import type { Notice } from '../types';

export interface FeaturedEvent {
  id: string;
  month: string;
  day: string;
  badge: string;
  title: string;
  description: string;
  note: string;
}

export const FEATURED_EVENT: FeaturedEvent = {
  id: 'science-fair-2026',
  month: 'Oct',
  day: '24',
  badge: 'Registration Open',
  title: 'Annual Science & Innovation Fair',
  description:
    'Forty-two teams, nine judging categories and a live expo in the main atrium. Registration closes October 10 — reserve a bench before the slots run out.',
  note: 'Free for members · Teams of 2–4',
};

export const NOTICES: Notice[] = [
  {
    id: 'ligo-webinar',
    status: 'live',
    title: 'Guest speaker: hunting gravitational waves',
    description:
      'Dr. Elena Vasquez (LIGO) walks us through chirp signals and mirror suspensions. Live Q&A until 5 pm.',
    dateLabel: 'Today',
    timeLabel: '4:00 – 5:00 PM',
    location: 'Auditorium + live stream',
    watching: 23,
  },
  {
    id: 'pcr-workshop',
    status: 'registration',
    title: 'Workshop: PCR & gel electrophoresis 101',
    description:
      'Extract, amplify and visualise your own DNA sample under mentor supervision. Complete beginners welcome.',
    dateLabel: 'Thu, Oct 8',
    timeLabel: '4:00 – 6:00 PM',
    location: 'Bio Lab 3',
    seatsLeft: 8,
  },
  {
    id: 'star-party',
    status: 'upcoming',
    title: 'Star party: Saturn at opposition',
    description:
      'Rings wide open — the 11-inch SCT will be primed on the ridge. Dress warm and bring red torches.',
    dateLabel: 'Fri, Oct 16',
    timeLabel: '8:30 – 11:00 PM',
    location: 'Ridge Observatory',
  },
  {
    id: 'robotics-sendoff',
    status: 'upcoming',
    title: 'Robotics regionals send-off & demo day',
    description:
      'The swarm fleet and Rover Mk-III run their final public demonstrations before regionals. Bleachers open to all.',
    dateLabel: 'Sat, Nov 7',
    timeLabel: '10:00 AM – 1:00 PM',
    location: 'Main Gymnasium',
  },
  {
    id: 'creek-cleanup',
    status: 'upcoming',
    title: 'Creek cleanup & water sampling',
    description:
      'Monthly Miller Creek survey — waders provided, data sheets on us. Counts toward field-hours credit.',
    dateLabel: 'Sat, Nov 14',
    timeLabel: '9:00 AM – 12:00 PM',
    location: 'Miller Creek trailhead',
  },
];

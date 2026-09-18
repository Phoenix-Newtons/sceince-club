/** Club events — rendered as cards with "Add to Google Calendar" links. */

export const EVENTS = [
  {
    id: 'weekly-meeting',
    title: 'Weekly Club Meeting',
    category: 'Meeting',
    date: '2026-09-25',
    timeStart: '16:00',
    timeEnd: '17:30',
    timeLabel: '4:00 – 5:30 PM',
    location: 'Lab 2, Science Block',
    recurring: 'Every Friday during term',
    description:
      'Demos, journal club and project check-ins. New faces welcome — just walk in.',
  },
  {
    id: 'guest-lecture',
    title: 'Guest Lecture: The Chemistry of Clean Water',
    category: 'Lecture',
    date: '2026-09-30',
    timeStart: '16:00',
    timeEnd: '17:30',
    timeLabel: '4:00 – 5:30 PM',
    location: 'Main Hall',
    description:
      'A water chemist from the regional utility explains how a treatment plant turns river water into drinking water — with live tests.',
  },
  {
    id: 'science-fair',
    title: 'BSSM Science Fair 2026',
    category: 'Science fair',
    date: '2026-10-16',
    timeStart: '10:00',
    timeEnd: '16:00',
    timeLabel: '10:00 AM – 4:00 PM',
    location: 'Main Hall & Courtyard',
    featured: true,
    description:
      'Our flagship fair: 30+ student exhibits, robot battles, a planetarium dome and the infamous liquid-nitrogen ice cream. Open to all schools.',
  },
  {
    id: 'chem-show',
    title: 'Chemistry Magic Show',
    category: 'Show',
    date: '2026-10-30',
    timeStart: '15:00',
    timeEnd: '17:00',
    timeLabel: '3:00 – 5:00 PM',
    location: 'Main Hall',
    description:
      'Colour-changing solutions, elephant toothpaste and safe-but-spectacular flames — chemistry as theatre, with the explanations included.',
  },
  {
    id: 'stargazing',
    title: 'Stargazing Night',
    category: 'Astronomy',
    date: '2026-11-06',
    timeStart: '19:00',
    timeEnd: '22:00',
    timeLabel: '7:00 – 10:00 PM',
    location: 'School Field',
    description:
      'Telescopes out, lights off. Saturn, star clusters and — fingers crossed — a meteor or two. Bring a jumper and red torch if you have one.',
  },
  {
    id: 'hackathon',
    title: 'Robotics Hackathon',
    category: 'Competition',
    date: '2026-12-05',
    timeStart: '09:00',
    timeEnd: '17:00',
    timeLabel: '9:00 AM – 5:00 PM',
    location: 'Computer Lab',
    description:
      'One day, one challenge, teams of four: build an autonomous bot from a mystery-parts box. Judges, prizes and lunch provided.',
  },
  {
    id: 'solar-workshop',
    title: 'Workshop: Build a Solar Phone Charger',
    category: 'Workshop',
    date: '2027-01-22',
    timeStart: '16:00',
    timeEnd: '18:00',
    timeLabel: '4:00 – 6:00 PM',
    location: 'Lab 2, Science Block',
    description:
      'Hands-on intro to the Green Energy Initiative — solder your own small solar charger and learn the physics that makes it work.',
  },
  {
    id: 'olympiad',
    title: 'Regional Science Olympiad',
    category: 'Competition',
    date: '2027-02-19',
    timeStart: '08:00',
    timeEnd: '17:00',
    timeLabel: '8:00 AM – 5:00 PM',
    location: 'Regional Science Centre',
    description:
      'Our teams compete in physics, chemistry and biology papers plus the practical round. Training sessions run from December.',
  },
]

export function eventDate(ev) {
  return new Date(`${ev.date}T${ev.timeStart}:00`)
}

/** Future events, soonest first. */
export function upcomingEvents() {
  const now = Date.now()
  return [...EVENTS]
    .filter((e) => eventDate(e).getTime() > now)
    .sort((a, b) => eventDate(a) - eventDate(b))
}

const stamp = (date, time) => `${date.replace(/-/g, '')}T${time.replace(':', '')}00`

/** Google Calendar "create event" template URL for an event. */
export function gcalUrl(ev) {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${ev.title} — Science Club BSSM`,
    dates: `${stamp(ev.date, ev.timeStart)}/${stamp(ev.date, ev.timeEnd)}`,
    details: `${ev.description}\n\nOrganised by Science Club BSSM.`,
    location: `${ev.location}, BSSM`,
  })
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}

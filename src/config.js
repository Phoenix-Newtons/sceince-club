/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Science Club BSSM — central site configuration
 *  Edit this single file to customize club details, links and the calendar.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const SITE = {
  name: 'Science Club BSSM',
  shortName: 'BSSM Science',
  tagline: 'Question boldly. Experiment fiercely. Discover together.',
  description:
    'A student-led science community exploring robotics, green energy, space studies, synthetic biology, AI and quantum physics.',

  creator: 'Luwangula Alpha',
  email: 'alphaluwangula@proton.me',
  founded: 2023,

  meetingTime: 'Fridays · 4:00 – 5:30 PM',
  meetingPlace: 'Science Block · Lab 2',

  /**
   * Public Google Calendar embedded in the Events section.
   * Default: Google's public "Phases of the Moon" astronomy calendar (a demo
   * that renders for everyone). To show the club's own meetings & science
   * fairs: make the club calendar public (Google Calendar → Settings →
   * "Make available to public") and paste its address below,
   * e.g. 'scienceclub.bssm@gmail.com'.
   */
  googleCalendarId: 'ht3jlfaac5lfd6263ulfh4tql8@group.calendar.google.com',
  timezone: 'Africa/Kampala',

  socials: [
    { id: 'instagram', label: 'Instagram', url: '#' },
    { id: 'twitter', label: 'X (Twitter)', url: '#' },
    { id: 'youtube', label: 'YouTube', url: '#' },
    { id: 'github', label: 'GitHub', url: '#' },
  ],

  school: {
    name: 'BSSM',
    line1: 'Science Block · Lab 2',
    line2: 'BSSM Campus',
  },
}

/** Google Calendar embed URL for the Events section. */
export function googleCalendarEmbedUrl() {
  const p = new URLSearchParams({
    src: SITE.googleCalendarId,
    ctz: SITE.timezone,
    showTitle: '0',
    showNav: '1',
    showDate: '1',
    showPrint: '0',
    showTabs: '1',
    showCalendars: '0',
    showTz: '0',
    mode: 'MONTH',
    hl: 'en',
  })
  return `https://calendar.google.com/calendar/embed?${p.toString()}`
}

import { useEffect, useState } from 'react'
import { CalendarPlus, Clock, ExternalLink, MapPin, Timer } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import { SITE, googleCalendarEmbedUrl } from '../config.js'
import { EVENTS, eventDate, gcalUrl, upcomingEvents } from '../data/events.js'

function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function Countdown({ event: ev }) {
  const now = useNow()
  const diff = Math.max(0, eventDate(ev).getTime() - now)
  const cells = [
    { v: Math.floor(diff / 864e5), l: 'days' },
    { v: Math.floor(diff / 36e5) % 24, l: 'hours' },
    { v: Math.floor(diff / 6e4) % 60, l: 'minutes' },
    { v: Math.floor(diff / 1e3) % 60, l: 'seconds' },
  ]
  return (
    <div className="countdown" data-reveal>
      <div className="countdown-head">
        <Timer size={16} />
        <span>Counting down to</span>
      </div>
      <h3 className="countdown-title">{ev.title}</h3>
      <div className="countdown-cells" role="timer" aria-label="Time until event">
        {cells.map((c) => (
          <div className="count-cell" key={c.l}>
            <span className="count-num">{pad(c.v)}</span>
            <span className="count-label">{c.l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EventCard({ ev, i }) {
  const d = eventDate(ev)
  const day = d.getDate()
  const month = d.toLocaleString('en', { month: 'short' })
  return (
    <article className="event-card" data-reveal style={{ '--rd': `${(i % 3) * 90}ms` }}>
      <div className="event-date" aria-hidden="true">
        <span className="event-day">{day}</span>
        <span className="event-month">{month}</span>
      </div>
      <div className="event-info">
        <span className="event-cat">{ev.category}</span>
        <h3>{ev.title}</h3>
        <p>{ev.description}</p>
        <div className="event-meta">
          <span>
            <Clock size={13} /> {ev.timeLabel}
          </span>
          <span>
            <MapPin size={13} /> {ev.location}
          </span>
        </div>
        {ev.recurring && <span className="event-recurring">↻ {ev.recurring}</span>}
        <a className="event-add" href={gcalUrl(ev)} target="_blank" rel="noreferrer">
          <CalendarPlus size={14} /> Add to Google Calendar
        </a>
      </div>
    </article>
  )
}

export default function Events() {
  const upcoming = upcomingEvents()
  const next = upcoming[0]
  const featured = EVENTS.find((e) => e.featured && eventDate(e).getTime() > Date.now()) || next

  return (
    <section className="section events" id="events">
      <div className="container">
        <SectionHeading
          eyebrow="03 · Mark your calendar"
          title="Meetings, fairs & starry nights"
          sub="Add any event to your own Google Calendar in one click — or browse the club calendar below."
        />

        {featured && <Countdown event={featured} />}

        <div className="events-grid">
          {upcoming.map((ev, i) => (
            <EventCard key={ev.id} ev={ev} i={i} />
          ))}
        </div>

        {!upcoming.length && (
          <p className="reactor-empty" data-reveal>
            Next term&apos;s events are being scheduled — watch the calendar below.
          </p>
        )}

        <div className="gcal-card" data-reveal>
          <div className="gcal-head">
            <div>
              <h3>Club calendar</h3>
              <p>
                Live Google Calendar — meetings, science fairs and astronomy events. Swap in the
                club&apos;s own public calendar via <code>src/config.js</code>.
              </p>
            </div>
            <a
              className="btn btn-ghost btn-sm"
              href={`https://calendar.google.com/calendar?src=${encodeURIComponent(SITE.googleCalendarId)}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Calendar <ExternalLink size={14} />
            </a>
          </div>
          <iframe
            className="gcal-frame"
            src={googleCalendarEmbedUrl()}
            title="Science Club BSSM Google Calendar"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

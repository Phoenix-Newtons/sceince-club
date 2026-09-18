import { useState } from 'react'
import {
  AlertTriangle,
  Check,
  Clock,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  Timer,
} from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import { SITE } from '../config.js'

const PERKS = [
  'Meetings every Friday — free to attend',
  'Join any project team, no experience needed',
  'Borrow lab equipment & telescope time',
  'Represent the school at fairs and olympiads',
]

const TOPICS = [
  'Join the club',
  'Project collaboration',
  'Guest speaking',
  'Competition / science fair',
  'Press & other enquiries',
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const mailtoHref = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `[Science Club BSSM] ${form.topic}`,
  )}&body=${encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)}`

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${SITE.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `[Science Club BSSM website] ${form.topic}`,
          _template: 'table',
          _captcha: 'false',
          name: form.name,
          email: form.email,
          topic: form.topic,
          message: form.message,
        }),
      })
      if (!res.ok) throw new Error('send failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <SectionHeading
          eyebrow="07 · Say hello"
          title="Join the club — or just say hi"
          sub="Membership is free and open to every student. Messages land directly in the club inbox."
        />

        <div className="contact-grid">
          <div className="contact-info" data-reveal>
            <a className="info-card" href={`mailto:${SITE.email}`}>
              <span className="info-icon">
                <Mail size={19} />
              </span>
              <div>
                <h3>Email us</h3>
                <p>{SITE.email}</p>
              </div>
            </a>
            <div className="info-card">
              <span className="info-icon">
                <Clock size={19} />
              </span>
              <div>
                <h3>Meetings</h3>
                <p>{SITE.meetingTime}</p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">
                <MapPin size={19} />
              </span>
              <div>
                <h3>Find us</h3>
                <p>
                  {SITE.school.line1}
                  <br />
                  {SITE.school.line2}
                </p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">
                <Timer size={19} />
              </span>
              <div>
                <h3>Response time</h3>
                <p>Usually within 48 hours</p>
              </div>
            </div>

            <ul className="perks">
              {PERKS.map((p) => (
                <li key={p}>
                  <Check size={15} /> {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="contact-form-card" data-reveal style={{ '--rd': '120ms' }}>
            {status === 'sent' ? (
              <div className="form-state">
                <span className="form-state-icon ok">
                  <Check size={26} />
                </span>
                <h3>Message sent!</h3>
                <p>
                  Thanks, {form.name.split(' ')[0] || 'friend'} — your message is on its way to the
                  club inbox. We&apos;ll get back to you soon.
                </p>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setForm({ name: '', email: '', topic: TOPICS[0], message: '' })
                    setStatus('idle')
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={onSubmit}>
                <div className="form-row">
                  <label>
                    Your name
                    <input
                      required
                      minLength={2}
                      value={form.name}
                      onChange={set('name')}
                      placeholder="e.g. Marie Curie"
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    Email
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </label>
                </div>
                <label>
                  I&apos;m writing about
                  <select value={form.topic} onChange={set('topic')}>
                    {TOPICS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Message
                  <textarea
                    required
                    minLength={10}
                    rows={5}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Tell us what you'd love to explore — robotics? stargazing? joining a project team?"
                  />
                </label>

                <button type="submit" className="btn btn-primary btn-lg submit-btn" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                  <Send size={16} />
                </button>

                {status === 'error' && (
                  <p className="form-error" role="alert">
                    <AlertTriangle size={15} />
                    The form service couldn&apos;t be reached.{' '}
                    <a href={mailtoHref}>Email us directly instead</a> — it works just as well.
                  </p>
                )}

                <p className="form-note">
                  <ShieldCheck size={13} />
                  Delivered straight to {SITE.email}. First-ever submission sends a one-time
                  activation link to the club inbox (FormSubmit) — everything after is automatic.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

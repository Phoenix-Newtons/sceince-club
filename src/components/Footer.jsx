import { Github, Heart, Instagram, Mail, MapPin, Twitter, Youtube } from 'lucide-react'
import AtomLogo from './AtomLogo.jsx'
import { NAV_LINKS } from './Navbar.jsx'
import { SITE } from '../config.js'
import { LIBRARY } from '../data/library.js'

const SOCIAL_ICONS = { instagram: Instagram, twitter: Twitter, youtube: Youtube, github: Github }

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#home" className="brand" aria-label="Science Club BSSM — home">
              <AtomLogo size={38} />
              <span className="brand-text">
                Science Club <b>BSSM</b>
              </span>
            </a>
            <p>{SITE.description}</p>
            <div className="footer-socials">
              {SITE.socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.id]
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    aria-label={s.label}
                    title={`${s.label} — set the link in src/config.js`}
                    onClick={(e) => s.url === '#' && e.preventDefault()}
                  >
                    <Icon size={17} />
                  </a>
                )
              })}
            </div>
          </div>

          <nav className="footer-col" aria-label="Footer navigation">
            <h4>Explore</h4>
            {NAV_LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="footer-col">
            <h4>The club</h4>
            <span>
              <MapPin size={14} /> {SITE.school.line1}, {SITE.school.line2}
            </span>
            <span>Meetings: {SITE.meetingTime}</span>
            <span>Founded {SITE.founded} · 42+ members</span>
            <span>{LIBRARY.length.toLocaleString()} quotes &amp; facts in the library</span>
          </div>

          <div className="footer-col">
            <h4>Get in touch</h4>
            <a href={`mailto:${SITE.email}`} className="footer-mail">
              <Mail size={14} /> {SITE.email}
            </a>
            <span>Interested in joining? The form is one scroll away.</span>
            <a href="#contact" className="btn btn-ghost btn-sm footer-cta">
              Join the club
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {SITE.name} · {SITE.school.name}. All rights reserved.
          </span>
          <span className="footer-credit">
            Built with <Heart size={13} className="heart" /> and an unreasonable amount of curiosity
            by{' '}
            <a href={`mailto:${SITE.email}`}>
              {SITE.creator}
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}

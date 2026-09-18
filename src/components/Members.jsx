import { Mail, Medal, Users } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import { MEMBERS } from '../data/members.js'
import { SITE } from '../config.js'

const CONTRIBUTORS = ['Kato T.', 'Namusoke P.', 'Wasswa M.', 'Akello J.', 'Nakato R.', 'Opio D.']

function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
}

export default function Members() {
  return (
    <section className="section members alt" id="members">
      <div className="container">
        <SectionHeading
          eyebrow="06 · The people"
          title="Student leaders & contributors"
          sub="The team keeping the experiments running, the telescopes pointed and the calendar full."
        />

        <div className="members-grid">
          {MEMBERS.map((m, i) => (
            <article
              className={`member-card ${m.badge ? 'has-badge' : ''}`}
              key={m.name}
              data-reveal
              style={{ '--rd': `${(i % 4) * 70}ms` }}
            >
              {m.badge && (
                <span className="member-badge">
                  <Medal size={12} /> {m.badge}
                </span>
              )}
              <div className="member-avatar">
                <img src={m.avatar} alt={`Illustrated portrait of ${m.name}`} loading="lazy" />
              </div>
              <h3>{m.name}</h3>
              <span className="member-role">{m.role}</span>
              <p className="member-focus">{m.focus}</p>
              <div className="tag-row center">
                {m.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="member-social">
                <a
                  href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Hello ${m.name} (Science Club BSSM)`)}`}
                  aria-label={`Email ${m.name}`}
                  title="Email via the club inbox"
                >
                  <Mail size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="contributors" data-reveal>
          <div className="contributors-title">
            <Users size={16} />
            <span>Contributors</span>
          </div>
          <div className="contributor-chips">
            {CONTRIBUTORS.map((c) => (
              <span className="contributor-chip" key={c} title="Active contributor">
                <i className="contributor-initials">{initials(c)}</i>
                {c}
              </span>
            ))}
            <span className="contributor-chip more">+ 30 more members</span>
          </div>
        </div>
      </div>
    </section>
  )
}

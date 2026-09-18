import { useRef, useState } from 'react'
import { ArrowRight, CalendarClock, Play, UserRound } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import Modal from './Modal.jsx'
import { PROJECTS } from '../data/projects.js'

function ProjectCard({ p, i, onOpen }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const Icon = p.icon

  const start = () => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = 0
    v.play()
      .then(() => setPlaying(true))
      .catch(() => {})
  }
  const stop = () => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
    setPlaying(false)
  }

  return (
    <article
      className={`project-card ${p.featured ? 'featured' : ''}`}
      data-reveal
      style={{ '--rd': `${(i % 3) * 90}ms` }}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      onClick={() => onOpen(p)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(p)}
      role="button"
      tabIndex={0}
      aria-label={`Open details: ${p.title}`}
    >
      <div className="project-media">
        <video ref={videoRef} muted loop playsInline preload="metadata" poster={p.poster} src={p.video} />
        <span className={`preview-chip ${playing ? 'on' : ''}`}>
          <Play size={13} />
          {playing ? 'Preview playing' : 'Hover to preview'}
        </span>
        <span className={`status-chip s-${p.status}`}>{p.statusLabel}</span>
      </div>

      <div className="project-body">
        <div className="project-title-row">
          <span className="project-icon">
            <Icon size={20} />
          </span>
          <h3>{p.title}</h3>
        </div>
        <p className="project-tagline">{p.tagline}</p>
        <div className="tag-row">
          {p.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <div className="project-meta">
          <span>
            <UserRound size={14} /> {p.lead}
          </span>
          <span>
            <CalendarClock size={14} /> {p.timeline}
          </span>
        </div>
        <div className="progress" role="img" aria-label={`${p.progress}% set up`}>
          <span style={{ '--w': `${p.progress}%` }} />
        </div>
        <span className="project-more">
          View details <ArrowRight size={14} />
        </span>
      </div>
    </article>
  )
}

export default function Projects() {
  const [selected, setSelected] = useState(null)

  return (
    <section className="section projects alt" id="projects">
      <div className="container">
        <SectionHeading
          eyebrow="02 · What we build"
          title="Projects that go beyond the textbook"
          sub="Hover a card for a video preview — click it for the full brief. Upcoming projects are highlighted."
        />

        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} onOpen={setSelected} />
          ))}
        </div>
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} wide label={selected?.title}>
        {selected && (
          <div className="project-detail">
            <video
              className="project-detail-video"
              src={selected.video}
              poster={selected.poster}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="project-detail-body">
              <div className="detail-head">
                <span className={`status-chip s-${selected.status}`}>{selected.statusLabel}</span>
                {selected.featured && <span className="status-chip s-featured">Upcoming highlight</span>}
              </div>
              <h3>{selected.title}</h3>
              <p className="detail-tagline">{selected.tagline}</p>
              {selected.details.map((d) => (
                <p key={d.slice(0, 24)}>{d}</p>
              ))}
              <div className="tag-row">
                {selected.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <dl className="detail-meta">
                <div>
                  <dt>Project lead</dt>
                  <dd>{selected.lead}</dd>
                </div>
                <div>
                  <dt>Timeline</dt>
                  <dd>{selected.timeline}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{selected.statusLabel}</dd>
                </div>
                <div>
                  <dt>Set-up progress</dt>
                  <dd>{selected.progress}%</dd>
                </div>
              </dl>
              <a
                href="#contact"
                className="btn btn-primary"
                onClick={() => setSelected(null)}
              >
                Get involved <ArrowRight size={16} />
              </a>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}

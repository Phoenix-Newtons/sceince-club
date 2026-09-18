import { Eye, Globe2, Microscope, Target, Trophy, Users } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import { SITE } from '../config.js'

const PILLARS = [
  {
    icon: Users,
    title: 'Weekly meetings',
    text: 'Every Friday after class: demos, journal club, project check-ins and loudly argued science debates.',
  },
  {
    icon: Microscope,
    title: 'Hands-on labs',
    text: 'Real experiments with real equipment — from titrations and microscopy to coding microcontrollers and building sensors.',
  },
  {
    icon: Trophy,
    title: 'Competitions & fairs',
    text: 'We train for national science fairs, olympiads and hackathons — and we host our own every year.',
  },
  {
    icon: Globe2,
    title: 'Community outreach',
    text: 'Science serves people: clean-water testing, climate awareness drives and mentoring younger students.',
  },
]

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <SectionHeading
          eyebrow="01 · Who we are"
          title="A community of curious minds"
          sub="Science Club BSSM is where bold questions are welcome, failures are data, and every student can be a scientist."
        />

        <div className="about-grid">
          <div className="about-copy" data-reveal>
            <p>
              Founded in {SITE.founded} by students who wanted more than textbook science, Science
              Club BSSM has grown into the school&apos;s most active club. We meet every week to
              experiment, build, argue about the universe — and to prepare the projects and people
              that represent our school at fairs and olympiads.
            </p>

            <div className="mv-card">
              <span className="mv-icon mission">
                <Target size={20} />
              </span>
              <div>
                <h3>Our mission</h3>
                <p>
                  To ignite a lifelong passion for science in every student — through hands-on
                  experiments, bold projects and a community where asking good questions matters
                  more than memorising answers.
                </p>
              </div>
            </div>

            <div className="mv-card">
              <span className="mv-icon vision">
                <Eye size={20} />
              </span>
              <div>
                <h3>Our vision</h3>
                <p>
                  To become the region&apos;s most vibrant student science club — a launchpad
                  where the next generation of scientists, engineers and inventors discovers their
                  potential and uses it to serve their community.
                </p>
              </div>
            </div>

            <div className="value-chips" aria-label="Our values">
              {['Curiosity', 'Integrity', 'Collaboration', 'Innovation', 'Excellence'].map((v) => (
                <span className="chip" key={v}>
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div className="about-visual" data-reveal style={{ '--rd': '120ms' }}>
            <figure className="about-figure">
              <img
                src="/images/about.jpg"
                alt="Illustration of Science Club BSSM students experimenting together in the school lab"
                loading="lazy"
              />
              <figcaption className="about-figure-caption">Curious minds, connected.</figcaption>
            </figure>
            <div className="about-stat-card">
              <span className="about-stat-num">42+</span>
              <span className="about-stat-label">
                active members across all forms — physicists, coders, biologists & builders
              </span>
            </div>
            <span className="about-badge">est. {SITE.founded}</span>
          </div>
        </div>

        <div className="pillars">
          {PILLARS.map((p, i) => (
            <div className="pillar" key={p.title} data-reveal style={{ '--rd': `${i * 80}ms` }}>
              <span className="pillar-icon">
                <p.icon size={20} />
              </span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

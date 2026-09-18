import { useEffect, useState } from 'react'
import { ArrowRight, Atom, ChevronDown, Dna, FlaskConical, Rocket, Sparkles } from 'lucide-react'
import ParticleCanvas from './ParticleCanvas.jsx'
import { SITE } from '../config.js'
import { LIBRARY } from '../data/library.js'

function useCountUp(target, duration = 1500) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

function Stat({ value, suffix, label }) {
  const v = useCountUp(value)
  return (
    <div className="hero-stat">
      <span className="hero-stat-num">
        {v.toLocaleString()}
        {suffix}
      </span>
      <span className="hero-stat-label">{label}</span>
    </div>
  )
}

export default function Hero({ theme }) {
  return (
    <section className="hero" id="home">
      <div className="hero-bg" aria-hidden="true">
        <ParticleCanvas theme={theme} />
        <div className="hero-glow hero-glow-a" />
        <div className="hero-glow hero-glow-b" />
      </div>

      <div className="container hero-inner">
        <span className="hero-badge" data-reveal>
          <Sparkles size={15} />
          Student-led science community · est. {SITE.founded}
        </span>

        <h1 className="hero-title" data-reveal style={{ '--rd': '80ms' }}>
          Science Club <span className="grad-text">BSSM</span>
        </h1>

        <p className="hero-tagline" data-reveal style={{ '--rd': '160ms' }}>
          {SITE.tagline}
        </p>
        <p className="hero-sub" data-reveal style={{ '--rd': '220ms' }}>
          From robotics and green energy to space studies and synthetic biology — we turn curiosity
          into experiments, and experiments into discovery.
        </p>

        <div className="hero-cta" data-reveal style={{ '--rd': '300ms' }}>
          <a href="#contact" className="btn btn-primary btn-lg">
            Join the Club <ArrowRight size={18} />
          </a>
          <a href="#projects" className="btn btn-ghost btn-lg">
            <FlaskConical size={18} /> Explore projects
          </a>
        </div>

        <div className="hero-stats" data-reveal style={{ '--rd': '380ms' }}>
          <Stat value={42} suffix="+" label="Active members" />
          <Stat value={12} suffix="" label="Projects & counting" />
          <Stat value={8} suffix="" label="Events every year" />
          <Stat value={LIBRARY.length} suffix="+" label="Quotes & facts in our library" />
        </div>
      </div>

      <div className="hero-chips" aria-hidden="true">
        <div className="float-chip c1">
          <Atom size={18} /> Physics
        </div>
        <div className="float-chip c2">
          <Rocket size={18} /> Space
        </div>
        <div className="float-chip c3">
          <Dna size={18} /> Biology
        </div>
      </div>

      <a href="#about" className="scroll-cue" aria-label="Scroll to About section">
        <ChevronDown size={20} />
      </a>
    </section>
  )
}

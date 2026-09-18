import { useEffect, useRef, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import AtomLogo from './AtomLogo.jsx'

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'events', label: 'Events' },
  { id: 'blog', label: 'Blog' },
  { id: 'members', label: 'Members' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const barRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-38% 0px -55% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''} ${open ? 'menu-open' : ''}`}>
      <div className="nav-progress" ref={barRef} aria-hidden="true" />
      <div className="container nav-inner">
        <a href="#home" className="brand" aria-label="Science Club BSSM — home">
          <AtomLogo size={36} />
          <span className="brand-text">
            Science Club <b>BSSM</b>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'active' : ''}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a href="#contact" className="btn btn-primary btn-sm nav-cta">
            Join us
          </a>
          <button
            type="button"
            className="icon-btn nav-burger"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className={`nav-mobile ${open ? 'open' : ''}`}>
        {NAV_LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'active' : ''} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#contact" className="btn btn-primary mobile-join" onClick={() => setOpen(false)}>
          Join the club
        </a>
      </div>
    </header>
  )
}

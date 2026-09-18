import { useCallback, useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import TickerStrip from './components/TickerStrip.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Events from './components/Events.jsx'
import Blog from './components/Blog.jsx'
import Discovery from './components/Discovery.jsx'
import Members from './components/Members.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('bssm-theme')
      if (stored === 'dark' || stored === 'light') return stored
      return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  })
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try {
      localStorage.setItem('bssm-theme', theme)
    } catch {
      /* private mode */
    }
  }, [theme])

  /* Reveal-on-scroll for every [data-reveal] element */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' },
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 720)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <a className="skip-link" href="#home">
        Skip to content
      </a>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero theme={theme} />
        <TickerStrip />
        <About />
        <Projects />
        <Events />
        <Blog />
        <Discovery />
        <Members />
        <Contact />
      </main>
      <Footer />
      <button
        type="button"
        className={`back-to-top ${showTop ? 'show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </>
  )
}

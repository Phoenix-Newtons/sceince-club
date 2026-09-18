import { Lightbulb } from 'lucide-react'
import { FACTS } from '../data/library.js'

/** Short "Did you know?" facts that scroll beneath the hero. */
function pickShortFacts() {
  const pool = FACTS.filter((f) => f.text.length < 125)
  if (pool.length <= 14) return pool
  const step = pool.length / 14
  const out = []
  for (let i = 0; i < 14; i += 1) out.push(pool[Math.floor(i * step)])
  return out
}

export default function TickerStrip() {
  const facts = pickShortFacts()
  const row = [...facts, ...facts]
  return (
    <div className="ticker" data-reveal>
      <div className="ticker-label">
        <Lightbulb size={15} />
        Did you know?
      </div>
      <div className="ticker-viewport">
        <ul className="sr-only">
          {facts.map((f) => (
            <li key={f.text}>{f.text}</li>
          ))}
        </ul>
        <div className="ticker-track" aria-hidden="true">
          {row.map((f, i) => (
            <span className="ticker-item" key={`${f.text}-${i}`}>
              {f.text}
              <i className="ticker-dot" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

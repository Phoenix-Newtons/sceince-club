import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  Library,
  Lightbulb,
  Quote,
  Search,
  Shuffle,
} from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import Modal from './Modal.jsx'
import { CATEGORIES, FACTS, LIBRARY, QUOTES, dailyIndex } from '../data/library.js'

const ROTATE_MS = 8000
const PAGE = 24

function CopyButton({ text, author, id, copied, onCopied }) {
  const done = copied === id
  return (
    <button
      type="button"
      className={`copy-btn ${done ? 'done' : ''}`}
      aria-label="Copy to clipboard"
      title="Copy to clipboard"
      onClick={async (e) => {
        e.stopPropagation()
        try {
          await navigator.clipboard.writeText(author ? `${text} — ${author}` : text)
          onCopied(id)
          setTimeout(() => onCopied(null), 1600)
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {done ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}

function dailyOf(list, salt) {
  return list[dailyIndex(list.length, salt)]
}

/* ------------------------------------------------------------- the reactor */
export default function Discovery() {
  const [type, setType] = useState('quote')
  const [category, setCategory] = useState('All')
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [libOpen, setLibOpen] = useState(false)
  const [copied, setCopied] = useState(null)

  const filtered = useMemo(
    () =>
      LIBRARY.filter(
        (e) => (type === 'all' || e.type === type) && (category === 'All' || e.category === category),
      ),
    [type, category],
  )

  useEffect(() => {
    setIndex(0)
  }, [type, category])

  useEffect(() => {
    if (paused || libOpen || filtered.length < 2) return undefined
    const id = setInterval(() => setIndex((i) => (i + 1) % filtered.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [paused, libOpen, filtered.length])

  const entry = filtered.length ? filtered[index % filtered.length] : null
  const quoteOfDay = dailyOf(QUOTES, 3)
  const factOfDay = dailyOf(FACTS, 5)

  const next = () => setIndex((i) => (i + 1) % filtered.length)
  const prev = () => setIndex((i) => (i - 1 + filtered.length) % filtered.length)
  const shuffle = () => setIndex(Math.floor(Math.random() * filtered.length))

  return (
    <section className="section discovery" id="spark">
      <div className="container">
        <SectionHeading
          eyebrow="05 · The Idea Reactor"
          title="Wisdom & wonders, on rotation"
          sub={`Our library holds ${LIBRARY.length.toLocaleString()} advanced science quotes and “Did you know?” facts — a few sparks land here every ${ROTATE_MS / 1000}s.`}
        />

        <div className="reactor-grid">
          <div className="daily-col">
            <div className="daily-card quote" data-reveal>
              <div className="daily-head">
                <Quote size={15} />
                Quote of the day
                <CopyButton
                  text={quoteOfDay.text}
                  author={quoteOfDay.author}
                  id="qod"
                  copied={copied}
                  onCopied={setCopied}
                />
              </div>
              <p className="daily-text">“{quoteOfDay.text}”</p>
              <span className="daily-author">— {quoteOfDay.author}</span>
            </div>
            <div className="daily-card fact" data-reveal style={{ '--rd': '90ms' }}>
              <div className="daily-head">
                <Lightbulb size={15} />
                Did you know?
                <CopyButton text={factOfDay.text} author={null} id="fod" copied={copied} onCopied={setCopied} />
              </div>
              <p className="daily-text">{factOfDay.text}</p>
              <span className="daily-author">{factOfDay.category}</span>
            </div>
          </div>

          <div
            className="reactor"
            data-reveal
            style={{ '--rd': '140ms' }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="reactor-top">
              <div className="segmented" role="tablist" aria-label="Content type">
                {[
                  ['quote', 'Quotes'],
                  ['fact', 'Facts'],
                  ['all', 'Everything'],
                ].map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    className={type === v ? 'on' : ''}
                    onClick={() => setType(v)}
                    role="tab"
                    aria-selected={type === v}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setLibOpen(true)}>
                <Library size={14} /> Open library
              </button>
            </div>

            <div className="chip-scroll" role="group" aria-label="Filter by category">
              {['All', ...CATEGORIES].map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`chip chip-btn ${category === c ? 'on' : ''}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="reactor-stage" aria-live="polite">
              {entry ? (
                <div key={`${entry.type}-${filtered.indexOf(entry)}`} className="reactor-entry">
                  <span className="reactor-glyph">{entry.type === 'quote' ? <Quote size={26} /> : <Lightbulb size={26} />}</span>
                  {entry.type === 'quote' ? (
                    <blockquote className="reactor-quote">“{entry.text}”</blockquote>
                  ) : (
                    <p className="reactor-fact">{entry.text}</p>
                  )}
                  <div className="reactor-foot">
                    {entry.type === 'quote' && <span className="reactor-author">— {entry.author}</span>}
                    <span className="reactor-cat">{entry.category}</span>
                    <CopyButton
                      text={entry.text}
                      author={entry.author}
                      id={`r-${filtered.indexOf(entry)}`}
                      copied={copied}
                      onCopied={setCopied}
                    />
                  </div>
                  <span
                    key={`bar-${index}-${filtered.length}`}
                    className={`reactor-bar ${paused ? 'paused' : ''}`}
                  />
                </div>
              ) : (
                <p className="reactor-empty">No entries for this filter yet.</p>
              )}
            </div>

            <div className="reactor-controls">
              <button type="button" className="icon-btn" onClick={prev} aria-label="Previous entry">
                <ChevronLeft size={18} />
              </button>
              <span className="reactor-count">
                {filtered.length ? (index % filtered.length) + 1 : 0} / {filtered.length.toLocaleString()}
              </span>
              <button type="button" className="icon-btn" onClick={next} aria-label="Next entry">
                <ChevronRight size={18} />
              </button>
              <button type="button" className="icon-btn" onClick={shuffle} aria-label="Random entry" title="Shuffle">
                <Shuffle size={16} />
              </button>
            </div>
          </div>
        </div>

        <LibraryModal open={libOpen} onClose={() => setLibOpen(false)} />
      </div>
    </section>
  )
}

/* ------------------------------------------------------- searchable library */
function LibraryModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('All')
  const [shown, setShown] = useState(PAGE)
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    setShown(PAGE)
  }, [query, type, category])

  const q = query.trim().toLowerCase()
  const results = useMemo(
    () =>
      LIBRARY.filter((e) => {
        if (type !== 'all' && e.type !== type) return false
        if (category !== 'All' && e.category !== category) return false
        if (q && !(e.text.toLowerCase().includes(q) || (e.author || '').toLowerCase().includes(q)))
          return false
        return true
      }),
    [q, type, category],
  )

  return (
    <Modal open={open} onClose={onClose} wide label="Quotes and facts library">
      <div className="lib">
        <div className="lib-head">
          <h3>
            <Library size={20} /> The Library
          </h3>
          <p>
            {results.length.toLocaleString()} of {LIBRARY.length.toLocaleString()} entries — quotes,
            “did you know?” facts and university-level trivia.
          </p>
          <div className="lib-filters">
            <label className="lib-search">
              <Search size={15} />
              <input
                type="search"
                placeholder="Search 1,000+ entries… (e.g. entropy, Curie, neutron star)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <div className="segmented" role="tablist" aria-label="Content type">
              {[
                ['all', 'All'],
                ['quote', 'Quotes'],
                ['fact', 'Facts'],
              ].map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  className={type === v ? 'on' : ''}
                  onClick={() => setType(v)}
                  role="tab"
                  aria-selected={type === v}
                >
                  {label}
                </button>
              ))}
            </div>
            <select
              className="lib-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
            >
              {['All', ...CATEGORIES].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <ul className="lib-list">
          {results.slice(0, shown).map((e) => {
            const id = LIBRARY.indexOf(e)
            return (
              <li key={id} className={`lib-item ${e.type}`}>
                <span className="lib-glyph">{e.type === 'quote' ? <Quote size={14} /> : <Lightbulb size={14} />}</span>
                <div>
                  <p>{e.type === 'quote' ? `“${e.text}”` : e.text}</p>
                  <span className="lib-meta">
                    {e.type === 'quote' ? `${e.author} · ` : ''}
                    {e.category}
                  </span>
                </div>
                <CopyButton text={e.text} author={e.author} id={`l-${id}`} copied={copied} onCopied={setCopied} />
              </li>
            )
          })}
          {!results.length && <li className="lib-empty">Nothing matched — try another search.</li>}
        </ul>

        {shown < results.length && (
          <button type="button" className="btn btn-ghost lib-more" onClick={() => setShown((s) => s + PAGE)}>
            Load more ({(results.length - shown).toLocaleString()} remaining)
          </button>
        )}
      </div>
    </Modal>
  )
}

/** Consistent section header: mono eyebrow, big title, subtitle. */
export default function SectionHeading({ eyebrow, title, sub, align = 'center' }) {
  return (
    <div className={`section-head ${align === 'left' ? 'left' : ''}`} data-reveal>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  )
}

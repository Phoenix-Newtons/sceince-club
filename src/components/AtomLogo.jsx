/** Animated atom logo used in the navbar and footer. */
export default function AtomLogo({ size = 34, className = '' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`atom-logo ${className}`}
      role="img"
      aria-label="Science Club BSSM logo"
    >
      <ellipse cx="32" cy="32" rx="27" ry="11" className="orbit o1" transform="rotate(32 32 32)" />
      <ellipse cx="32" cy="32" rx="27" ry="11" className="orbit o2" transform="rotate(-32 32 32)" />
      <circle cx="32" cy="32" r="6.5" className="nucleus" />

      <circle cx="59" cy="32" r="2.6" className="electron e1" transform="rotate(32 32 32)" />
      <circle cx="5" cy="32" r="2.6" className="electron e2" transform="rotate(-32 32 32)" />
    </svg>
  )
}

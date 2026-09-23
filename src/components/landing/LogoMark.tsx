import type { SVGProps } from 'react';

/**
 * Vector Nucleus mark — used as the instant-paint fallback inside the
 * preloader (before the WebGL chunk resolves) and by routes that do not run
 * the landing experience.
 */
export function LogoMark({ className = '', ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <defs>
        <radialGradient id="nucleus-core" cx="50%" cy="46%" r="52%">
          <stop offset="0%" stopColor="#EAF6FF" />
          <stop offset="45%" stopColor="#4F7CFF" />
          <stop offset="100%" stopColor="#7C3AED" />
        </radialGradient>
        <linearGradient id="nucleus-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>

      <ellipse cx="32" cy="32" rx="27" ry="11.5" stroke="url(#nucleus-ring)" strokeWidth="1.6" opacity="0.9" />
      <ellipse
        cx="32"
        cy="32"
        rx="27"
        ry="11.5"
        stroke="url(#nucleus-ring)"
        strokeWidth="1.6"
        opacity="0.75"
        transform="rotate(60 32 32)"
      />
      <ellipse
        cx="32"
        cy="32"
        rx="27"
        ry="11.5"
        stroke="url(#nucleus-ring)"
        strokeWidth="1.6"
        opacity="0.6"
        transform="rotate(120 32 32)"
      />

      <circle cx="32" cy="32" r="9" fill="url(#nucleus-core)" />
      <circle cx="32" cy="32" r="13.5" stroke="#38BDF8" strokeWidth="0.8" opacity="0.35" />

      <circle cx="59" cy="32" r="2.6" fill="#38BDF8" />
      <circle cx="18.5" cy="55.4" r="2.6" fill="#A78BFA" />
      <circle cx="18.5" cy="8.6" r="2.6" fill="#4F7CFF" />
    </svg>
  );
}

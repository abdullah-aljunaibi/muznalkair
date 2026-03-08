interface MuznLogoProps {
  size?: number;
  className?: string;
  ariaLabel?: string;
}

export default function MuznLogo({
  size = 48,
  className = "",
  ariaLabel = "شعار مقرأة مُزن الخير",
}: MuznLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0D060" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2A8FA0" />
          <stop offset="100%" stopColor="#1B6B7A" />
        </linearGradient>
      </defs>

      {/* ── Gold arch framing the top ── */}
      {/* Outer arch band */}
      <path
        d="M40 6 C22 6 8 20 8 38 L8 44 C8 28 22 14 40 14 C58 14 72 28 72 44 L72 38 C72 20 58 6 40 6Z"
        fill="url(#goldGrad)"
        opacity="0.95"
      />
      {/* Arch crown dot */}
      <circle cx="40" cy="6" r="3" fill="url(#goldGrad)" />
      {/* Arch side terminals */}
      <circle cx="8" cy="44" r="2.5" fill="url(#goldGrad)" />
      <circle cx="72" cy="44" r="2.5" fill="url(#goldGrad)" />

      {/* ── Kufic interlocking knot — 8-pointed star made of two overlapping squares ── */}
      {/* Outer square (axis-aligned), centered at 40,38 */}
      <rect
        x="22" y="22" width="36" height="36"
        fill="none"
        stroke="url(#tealGrad)"
        strokeWidth="3"
        rx="1"
      />
      {/* Rotated square (45°), same center */}
      <polygon
        points="40,18 62,38 40,58 18,38"
        fill="none"
        stroke="url(#tealGrad)"
        strokeWidth="3"
      />

      {/* ── Inner knotwork fill — teal solid between knot paths ── */}
      {/* Fills the 8 triangular petals of the star */}
      {/* Top petal */}
      <polygon points="40,18 40,22 37,22 40,18" fill="#1B6B7A" opacity="0.7"/>
      <polygon points="40,18 43,22 40,22 40,18" fill="#1B6B7A" opacity="0.7"/>
      {/* Bottom petal */}
      <polygon points="40,58 40,54 37,54 40,58" fill="#1B6B7A" opacity="0.7"/>
      <polygon points="40,58 43,54 40,54 40,58" fill="#1B6B7A" opacity="0.7"/>
      {/* Left petal */}
      <polygon points="18,38 22,38 22,35 18,38" fill="#1B6B7A" opacity="0.7"/>
      <polygon points="18,38 22,41 22,38 18,38" fill="#1B6B7A" opacity="0.7"/>
      {/* Right petal */}
      <polygon points="62,38 58,38 58,35 62,38" fill="#1B6B7A" opacity="0.7"/>
      <polygon points="62,38 58,41 58,38 62,38" fill="#1B6B7A" opacity="0.7"/>

      {/* ── Interlocking cross lines through the knot ── */}
      <line x1="40" y1="22" x2="40" y2="54" stroke="#1B6B7A" strokeWidth="2.5" />
      <line x1="22" y1="38" x2="58" y2="38" stroke="#1B6B7A" strokeWidth="2.5" />

      {/* ── Diagonal interlock ── */}
      <line x1="26" y1="26" x2="54" y2="50" stroke="#1B6B7A" strokeWidth="1.5" opacity="0.5" />
      <line x1="54" y1="26" x2="26" y2="50" stroke="#1B6B7A" strokeWidth="1.5" opacity="0.5" />

      {/* ── Center jewel ── */}
      <circle cx="40" cy="38" r="5.5" fill="url(#goldGrad)" />
      <circle cx="40" cy="38" r="3" fill="#FAF4EE" />
      <circle cx="40" cy="38" r="1.2" fill="url(#tealGrad)" />

      {/* ── Gold accent dots at 8 star points ── */}
      <circle cx="40" cy="18" r="2" fill="url(#goldGrad)" />
      <circle cx="40" cy="58" r="2" fill="url(#goldGrad)" />
      <circle cx="18" cy="38" r="2" fill="url(#goldGrad)" />
      <circle cx="62" cy="38" r="2" fill="url(#goldGrad)" />
      <circle cx="26" cy="26" r="1.5" fill="url(#goldGrad)" />
      <circle cx="54" cy="26" r="1.5" fill="url(#goldGrad)" />
      <circle cx="26" cy="50" r="1.5" fill="url(#goldGrad)" />
      <circle cx="54" cy="50" r="1.5" fill="url(#goldGrad)" />

      {/* ── Open book motif at the bottom ── */}
      {/* Left page curve */}
      <path
        d="M40 64 Q28 62 16 68"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Right page curve */}
      <path
        d="M40 64 Q52 62 64 68"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Book spine */}
      <line x1="40" y1="64" x2="40" y2="74" stroke="url(#goldGrad)" strokeWidth="1.8" strokeLinecap="round" />
      {/* Lower page shadow lines */}
      <path
        d="M40 68 Q28 66 18 72"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M40 68 Q52 66 62 72"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

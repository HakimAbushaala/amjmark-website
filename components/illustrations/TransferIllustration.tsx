// Abstract geometric illustration standing in for a real product photo:
// a stack of film sheets on the left, a pressed shirt with a vibrant
// printed design on the right. Swap for a real photo whenever one is ready.
export function TransferIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Colorful DTF transfer film pressed onto a shirt">
      <defs>
        <radialGradient id="printGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="35%" stopColor="#f97316" />
          <stop offset="65%" stopColor="#22c55e" />
          <stop offset="85%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#8f1d2e" />
        </radialGradient>
      </defs>

      {/* film stack */}
      <rect x="40" y="150" width="130" height="90" rx="10" fill="#ffffff" stroke="#e4e4e7" strokeWidth="2" transform="rotate(-6 105 195)" />
      <rect x="50" y="140" width="130" height="90" rx="10" fill="#ffffff" stroke="#d4d4d8" strokeWidth="2" strokeDasharray="6 5" transform="rotate(-3 115 185)" />
      <rect x="60" y="130" width="130" height="90" rx="10" fill="#fafafa" stroke="#e4e4e7" strokeWidth="2" />
      <circle cx="125" cy="175" r="30" fill="url(#printGlow)" />

      {/* arrow */}
      <path d="M210 175 H260" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
      <path d="M252 165 L266 175 L252 185" stroke="#a1a1aa" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* shirt: body + two sleeves + V-neck cutout */}
      <g>
        <rect x="290" y="110" width="100" height="140" rx="10" fill="#18181b" />
        <path d="M290 110 L253 130 L270 168 L290 150 Z" fill="#18181b" />
        <path d="M390 110 L427 130 L410 168 L390 150 Z" fill="#18181b" />
        <path d="M318 110 Q340 138 362 110 Z" fill="#f4f4f5" />
      </g>

      {/* vibrant printed design on chest */}
      <circle cx="340" cy="185" r="32" fill="url(#printGlow)" />
    </svg>
  );
}

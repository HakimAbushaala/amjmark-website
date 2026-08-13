// Abstract illustration standing in for a real product photo: a folded
// shirt with a vibrant printed design, and film peeling off the corner.
// Swap for a real photo whenever one is ready.
export function TransferIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Colorful DTF transfer design peeling off a folded shirt">
      <defs>
        <radialGradient id="printGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="30%" stopColor="#f97316" />
          <stop offset="55%" stopColor="#22c55e" />
          <stop offset="78%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#8f1d2e" />
        </radialGradient>
        <linearGradient id="filmShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#e4e4e7" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* folded shirt */}
      <rect x="55" y="55" width="290" height="210" rx="22" fill="#18181b" />

      {/* vibrant printed design */}
      <circle cx="185" cy="165" r="95" fill="url(#printGlow)" />
      <circle cx="185" cy="165" r="95" fill="#18181b" opacity="0.04" />

      {/* film peeling off the top-right corner */}
      <path d="M230 55 L345 55 L345 170 Z" fill="url(#filmShine)" stroke="#d4d4d8" strokeWidth="1.5" />
      <path d="M230 55 L280 55 L230 105 Z" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}

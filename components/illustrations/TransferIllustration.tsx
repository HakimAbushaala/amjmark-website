// Abstract geometric illustration standing in for a real product photo:
// a stack of film sheets on the left, a pressed shirt with a printed
// transfer on the right. Swap for a real photo whenever one is ready.
export function TransferIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="DTF transfer film pressed onto a shirt">
      {/* film stack */}
      <rect x="40" y="150" width="130" height="90" rx="10" fill="#ffffff" stroke="#e4e4e7" strokeWidth="2" transform="rotate(-6 105 195)" />
      <rect x="50" y="140" width="130" height="90" rx="10" fill="#ffffff" stroke="#d4d4d8" strokeWidth="2" strokeDasharray="6 5" transform="rotate(-3 115 185)" />
      <rect x="60" y="130" width="130" height="90" rx="10" fill="#fafafa" stroke="#e4e4e7" strokeWidth="2" />
      <rect x="80" y="150" width="90" height="50" rx="6" fill="#8f1d2e" opacity="0.15" />
      <path d="M95 175 L115 160 L135 180 L150 165" stroke="#8f1d2e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* arrow */}
      <path d="M210 175 H260" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
      <path d="M252 165 L266 175 L252 185" stroke="#a1a1aa" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* shirt */}
      <path
        d="M300 90 L330 75 L352 92 L372 84 L392 112 L376 128 L368 122 L368 230 L292 230 L292 122 L284 128 L268 112 L288 84 L308 92 Z"
        fill="#18181b"
      />
      <rect x="310" y="140" width="50" height="50" rx="8" fill="#8f1d2e" />
      <path d="M325 165 L333 173 L349 155" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

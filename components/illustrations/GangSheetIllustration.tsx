// Abstract illustration of a packed gang sheet — a light "sheet" with a
// grid of variously sized design blocks, mirroring what the builder
// actually produces. Swap for a real photo whenever one is ready.
export function GangSheetIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Packed DTF gang sheet layout">
      <rect x="30" y="20" width="340" height="260" rx="14" fill="#ffffff" stroke="#e4e4e7" strokeWidth="2" />

      <rect x="55" y="45" width="90" height="90" rx="8" fill="#8f1d2e" opacity="0.85" />
      <rect x="155" y="45" width="60" height="60" rx="8" fill="#18181b" opacity="0.85" />
      <rect x="225" y="45" width="60" height="90" rx="8" fill="#e4e4e7" />
      <rect x="295" y="45" width="50" height="42" rx="6" fill="#8f1d2e" opacity="0.5" />
      <rect x="295" y="93" width="50" height="42" rx="6" fill="#18181b" opacity="0.5" />

      <rect x="55" y="145" width="60" height="60" rx="8" fill="#18181b" opacity="0.6" />
      <rect x="125" y="145" width="80" height="45" rx="6" fill="#8f1d2e" opacity="0.65" />
      <rect x="215" y="145" width="45" height="45" rx="6" fill="#e4e4e7" />
      <rect x="270" y="145" width="75" height="90" rx="8" fill="#8f1d2e" opacity="0.9" />

      <rect x="55" y="215" width="55" height="45" rx="6" fill="#e4e4e7" />
      <rect x="120" y="200" width="85" height="60" rx="8" fill="#18181b" opacity="0.75" />
      <rect x="215" y="200" width="45" height="60" rx="6" fill="#8f1d2e" opacity="0.4" />
    </svg>
  );
}

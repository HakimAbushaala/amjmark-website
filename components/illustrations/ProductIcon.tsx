// Simple line-icon fallbacks for product cards without a real photo yet.
export function ShirtIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M17 6 L24 10 L31 6 L40 13 L35 20 L31 17 L31 42 L17 42 L17 17 L13 20 L8 13 Z" />
    </svg>
  );
}

export function SheetIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <rect x="7" y="9" width="34" height="30" rx="3" />
      <rect x="12" y="14" width="10" height="10" rx="1.5" />
      <rect x="26" y="14" width="10" height="7" rx="1.5" />
      <rect x="12" y="27" width="8" height="7" rx="1.5" />
      <rect x="24" y="24" width="12" height="10" rx="1.5" />
    </svg>
  );
}

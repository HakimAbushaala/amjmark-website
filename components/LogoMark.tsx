// Approximated from the brand's gold "MJ" monogram (serif, gold gradient).
// Swap for the real logo file whenever it's available — see public/logo.png.
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="amjGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3d78a" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#a8791f" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="14" fill="#18181b" />
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fontFamily="var(--font-logo), 'Playfair Display', Georgia, serif"
        fontWeight="700"
        fontSize="52"
        fill="url(#amjGold)"
      >
        MJ
      </text>
    </svg>
  );
}

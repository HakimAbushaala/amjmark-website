import Link from "next/link";

const STEPS = [
  {
    n: "1",
    title: "Upload your artwork",
    body: "Drop in PNG, JPG, WebP, or SVG files — transparent backgrounds work best. Everything is auto-sized at 300 DPI print quality.",
  },
  {
    n: "2",
    title: "Auto-pack your sheet",
    body: "One click packs every design onto the sheet as tightly as possible, or drag, resize, and rotate anything by hand.",
  },
  {
    n: "3",
    title: "See your price live",
    body: "The total updates as you build — rate automatically drops at volume, and rush turnaround is a single toggle.",
  },
  {
    n: "4",
    title: "Checkout",
    body: "Add your sheet to the cart alongside any preset sizes or apparel, then pay securely at checkout.",
  },
  {
    n: "5",
    title: "We print & you get it",
    body: "Standard turnaround is 48 hours. Pick up locally in Fremont, CA, or we ship anywhere in the Bay Area and beyond.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-extrabold text-zinc-900">How It Works</h1>
      <p className="mt-3 text-zinc-500">From artwork to pressed transfer in five steps.</p>

      <div className="mt-10 space-y-6">
        {STEPS.map((s) => (
          <div key={s.n} className="flex gap-4">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-700 font-bold text-white">
              {s.n}
            </span>
            <div>
              <div className="font-bold text-zinc-900">{s.title}</div>
              <div className="mt-1 text-sm text-zinc-500">{s.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/design"
          className="rounded-full bg-brand-700 px-7 py-3 font-bold text-white shadow-sm transition hover:bg-brand-800"
        >
          Start Building
        </Link>
        <Link
          href="/pricing"
          className="rounded-full border-2 border-brand-700 px-7 py-3 font-bold text-brand-700 transition hover:bg-brand-50"
        >
          See Pricing
        </Link>
      </div>
    </div>
  );
}

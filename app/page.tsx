import Link from "next/link";

const FEATURES = [
  {
    title: "Custom Gang Sheets",
    body: "Upload your designs, auto-pack them onto a sheet, and see your price update live.",
    href: "/design",
    cta: "Start Designing",
  },
  {
    title: "Preset Sheet Sizes",
    body: "Grab a ready-made sheet size when you don't need the full custom layout tool.",
    href: "/shop?type=gang_sheet_preset",
    cta: "Browse Sizes",
  },
  {
    title: "Ready-Pressed Apparel",
    body: "Shirts and hoodies, pressed and ready to ship — no press of your own required.",
    href: "/shop?type=apparel",
    cta: "Shop Apparel",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="mb-4 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
            As low as $0.02/sq in
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            DTF Transfers, Printed On Demand
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Design your own gang sheet, grab a preset size, or order ready-pressed apparel. Fast turnaround,
            wholesale pricing at volume, and a live price as you build.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/design"
              className="rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-7 py-3 font-bold text-slate-900 shadow-lg shadow-amber-500/20 transition hover:brightness-110"
            >
              Start Designing
            </Link>
            <Link
              href="/shop"
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-7 py-3 font-bold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
            >
              <h3 className="font-display text-xl font-bold text-white">{f.title}</h3>
              <p className="mt-2 flex-1 text-sm text-slate-400">{f.body}</p>
              <Link
                href={f.href}
                className="mt-5 inline-block text-sm font-bold text-amber-400 hover:text-amber-300"
              >
                {f.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="font-display text-2xl font-bold text-white">Ordering in bulk?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Wholesale pricing kicks in automatically at checkout once your quantity crosses our volume
            thresholds — no code needed.
          </p>
        </div>
      </section>
    </div>
  );
}

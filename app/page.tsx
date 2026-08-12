import Link from "next/link";

const FEATURES = [
  { icon: "⚡", title: "Fast Turnaround", body: "Same-day and next-day printing available" },
  { icon: "📦", title: "No Minimums", body: "Order exactly what you need, nothing more" },
  { icon: "✂️", title: "Easy to Gang & Cut", body: "Auto-packed layouts, clean cut lines" },
  { icon: "🛡️", title: "Quality Guaranteed", body: "Premium film, vivid color, durable press" },
];

// Styled placeholder standing in for real product photography — swap the
// `bg-gradient-to-br ...` div below for an <img> once photos are ready.
function PhotoPlaceholder({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 text-zinc-400">
      <span className="text-4xl">{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="mb-4 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
            As low as $0.02/sq in
          </p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl">
            Crisp. Yours.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500">
            Custom DTF gang sheets, preset transfer sizes, and ready-pressed apparel. Design online, see your
            price update live, and order in minutes.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-zinc-900 px-7 py-3 font-bold text-white shadow-sm transition hover:bg-zinc-800"
            >
              Shop Transfers
            </Link>
            <Link href="/design" className="font-semibold text-zinc-600 hover:text-zinc-900">
              Explore Gang Sheets
            </Link>
          </div>
        </div>
      </section>

      {/* NEED IT FAST */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <PhotoPlaceholder icon="🎞️" label="Transfer Film" />
            <PhotoPlaceholder icon="👕" label="Pressed Shirt" />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-zinc-900">Need it fast?</h2>
            <ul className="mt-5 space-y-3 text-zinc-600">
              <li className="flex items-center gap-2">
                <span className="text-zinc-900">✓</span> Same-day &amp; next-day printing
              </li>
              <li className="flex items-center gap-2">
                <span className="text-zinc-900">✓</span> No minimums
              </li>
              <li className="flex items-center gap-2">
                <span className="text-zinc-900">✓</span> Competitive pricing, discounts at volume
              </li>
            </ul>
            <Link
              href="/shop"
              className="mt-7 inline-block rounded-full bg-zinc-900 px-7 py-3 font-bold text-white shadow-sm transition hover:bg-zinc-800"
            >
              Shop Now
            </Link>
            <p className="mt-4 text-xs text-zinc-400">Trusted by local shops &amp; brands</p>
          </div>
        </div>
      </section>

      {/* BUILD YOUR GANG SHEET */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid items-center gap-10 sm:grid-cols-2">
            <div className="order-2 sm:order-1">
              <PhotoPlaceholder icon="🖨️" label="Gang Sheet + Apparel" />
            </div>
            <div className="order-1 sm:order-2">
              <h2 className="font-display text-3xl font-bold text-zinc-900">Build your gang sheet</h2>
              <p className="mt-3 text-zinc-500">
                Fast, clean, consistent DTF transfers — built for gang sheets. Upload your designs, auto-pack
                them, and see your price update live at 300 DPI print quality.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
                <span className="text-3xl">⬆</span>
                <span className="font-semibold text-zinc-700">Drag &amp; drop your files here</span>
                <Link
                  href="/gang-sheet-builder.html"
                  className="mt-2 rounded-full bg-zinc-900 px-6 py-2.5 font-bold text-white transition hover:bg-zinc-800"
                >
                  Upload Artwork
                </Link>
                <span className="text-xs text-zinc-400">PNG · JPG · WebP · SVG — 22.5&quot; width max</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 text-xl">
                {f.icon}
              </span>
              <div className="font-bold text-zinc-900">{f.title}</div>
              <div className="mt-1 text-sm text-zinc-500">{f.body}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

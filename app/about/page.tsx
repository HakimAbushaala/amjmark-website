export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-extrabold text-zinc-900">About AMJ Mark</h1>
      <p className="mt-4 text-zinc-500">
        AMJ Mark is a DTF (direct-to-film) transfer shop based in Fremont, California, serving creators, apparel
        brands, and businesses across the Bay Area. We print custom gang sheets, preset transfer sizes, and
        ready-pressed apparel — with transparent, live pricing and no minimum order size.
      </p>

      <section className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
        <h2 className="font-display text-xl font-bold text-zinc-900">Local Pickup</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Same-day pickup is available in Fremont, CA on orders placed before 12PM. Prefer shipping? We deliver
          anywhere in the Bay Area and beyond.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-zinc-900">Get in touch</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Questions about an order, a bulk quote, or anything else?{" "}
          <a href="mailto:info@amjmark.com" className="font-semibold text-brand-700 underline underline-offset-2">
            info@amjmark.com
          </a>
        </p>
      </section>
    </div>
  );
}

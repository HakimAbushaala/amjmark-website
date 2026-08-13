import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { GangSheetTeaser } from "@/components/GangSheetTeaser";

const HERO_FEATURES = [
  { icon: "✦", title: "High-Detail Prints", body: "Sharp, vibrant, professional results" },
  { icon: "⊘", title: "No Minimums", body: "Order what you need" },
  { icon: "✂", title: "Easy to Press & Cut", body: "Smooth workflow, every time" },
  { icon: "💧", title: "Vibrant Color", body: "Rich color. Sharp detail." },
];

const INFO_BAR = [
  { icon: "🏬", title: "Local Pickup", body: "Fremont, CA" },
  { icon: "⏱", title: "Same-Day Printing", body: "Order by 12PM" },
  { icon: "🚚", title: "Next-Day Printing", body: "Reliable every time" },
  { icon: "📦", title: "No Minimums", body: "One or a hundred" },
];

const TRUST_ITEMS = ["Local Production", "Consistent Quality", "Real Human Support", "Fast Turnaround"];

const BUILD_STEPS = [
  { title: "Easy Upload", body: "Upload your artwork in seconds" },
  { title: "Smart Auto-Pack", body: "Maximizes space, minimizes waste" },
  { title: "Live Pricing", body: "See your price update in real time" },
];

const SECONDARY_FEATURES = [
  { icon: "★", title: "Premium Quality", body: "Vibrant colors that last" },
  { icon: "🎯", title: "Precision Printing", body: "Sharp detail. Consistent color." },
  { icon: "🛡", title: "Durable Transfers", body: "Strong adhesion. Built to last." },
  { icon: "📍", title: "Local & Reliable", body: "Local production, fast turnaround" },
];

export default async function HomePage() {
  const presetSheet = await prisma.product.findUnique({
    where: { slug: "preset-dtf-gang-sheet" },
    include: { variants: { where: { active: true }, orderBy: { priceCents: "asc" } } },
  });

  return (
    <div>
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl">
              Crisp. <span className="text-brand-700">Yours.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-zinc-500">
              Premium DTF transfers for creators, brands, and businesses that care about the details.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
              {HERO_FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-2">
                  <span className="mt-0.5 text-brand-700">{f.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">{f.title}</div>
                    <div className="text-xs text-zinc-500">{f.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/design"
                className="rounded-full bg-brand-700 px-7 py-3 font-bold text-white shadow-sm transition hover:bg-brand-800"
              >
                Build Gang Sheet
              </Link>
              <Link
                href="/shop?type=gang_sheet_preset"
                className="rounded-full border-2 border-brand-700 px-7 py-3 font-bold text-brand-700 transition hover:bg-brand-50"
              >
                Shop Preset Transfers
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
            <Image
              src="/hero-transfer.png"
              alt="Colorful DTF transfer design peeling off a black shirt"
              width={1536}
              height={1024}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* INFO BAR */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:grid-cols-4">
          {INFO_BAR.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="text-xl text-brand-700">{item.icon}</span>
              <div>
                <div className="text-sm font-bold text-zinc-900">{item.title}</div>
                <div className="text-xs text-zinc-500">{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="mx-auto max-w-6xl px-6 py-10 text-center">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
          Trusted by Local Shops &amp; Brands
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-zinc-600">
          {TRUST_ITEMS.map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <span className="text-brand-700">✓</span> {item}
            </span>
          ))}
        </div>
      </section>

      {/* BUILD / PREVIEW / ORDER */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-zinc-900">
              Build. Preview. <span className="text-brand-700">Order.</span>
            </h2>
            <p className="mt-3 text-zinc-500">
              Design your perfect gang sheet in seconds. Upload, arrange, and see your price update instantly.
            </p>

            <div className="mt-6 space-y-4">
              {BUILD_STEPS.map((s) => (
                <div key={s.title} className="flex items-start gap-3">
                  <span className="mt-0.5 text-brand-700">✓</span>
                  <div>
                    <div className="font-bold text-zinc-900">{s.title}</div>
                    <div className="text-sm text-zinc-500">{s.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/design"
                className="rounded-full bg-brand-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-800"
              >
                Build Your Gang Sheet
              </Link>
              <Link href="/how-it-works" className="font-semibold text-zinc-600 hover:text-zinc-900">
                How it works →
              </Link>
            </div>
          </div>

          {presetSheet && presetSheet.variants.length > 0 && (
            <GangSheetTeaser productId={presetSheet.id} variants={presetSheet.variants} />
          )}
        </div>
      </section>

      {/* SECONDARY FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {SECONDARY_FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 text-xl text-brand-700">
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

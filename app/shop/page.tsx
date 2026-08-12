import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/format";
import type { ProductType } from "@prisma/client";

const TYPE_LABELS: Record<string, string> = {
  gang_sheet_preset: "Preset Sheets",
  apparel: "Apparel",
};

const SHOP_TYPES: ProductType[] = ["gang_sheet_preset", "apparel"];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const filterType = SHOP_TYPES.find((t) => t === type);

  const products = await prisma.product.findMany({
    where: { active: true, type: filterType ?? { in: SHOP_TYPES } },
    include: { variants: { where: { active: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-extrabold text-white">Shop</h1>
        <p className="mt-2 text-slate-400">
          Preset sheets and ready-pressed apparel. Need a fully custom layout?{" "}
          <Link href="/design" className="text-amber-400 hover:text-amber-300">
            Use the gang sheet builder →
          </Link>
        </p>

        <div className="mt-5 flex gap-2 text-sm font-semibold">
          <Link
            href="/shop"
            className={`rounded-full px-4 py-1.5 ${!filterType ? "bg-amber-500 text-slate-900" : "border border-slate-700 text-slate-300 hover:border-slate-500"}`}
          >
            All
          </Link>
          {SHOP_TYPES.map((t) => (
            <Link
              key={t}
              href={`/shop?type=${t}`}
              className={`rounded-full px-4 py-1.5 ${filterType === t ? "bg-amber-500 text-slate-900" : "border border-slate-700 text-slate-300 hover:border-slate-500"}`}
            >
              {TYPE_LABELS[t]}
            </Link>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-slate-500">No products yet — check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const price = p.variants[0]?.priceCents ?? p.basePriceCents;
            return (
              <Link
                key={p.id}
                href={`/shop/${p.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition hover:border-amber-500/40"
              >
                <div className="flex aspect-square items-center justify-center bg-slate-800 text-slate-600">
                  {p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-4xl">🧵</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-amber-400">
                    {TYPE_LABELS[p.type] ?? p.type}
                  </div>
                  <div className="mt-1 font-semibold text-white group-hover:text-amber-300">{p.name}</div>
                  {price != null && <div className="mt-1 text-sm text-slate-400">From {formatCents(price)}</div>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

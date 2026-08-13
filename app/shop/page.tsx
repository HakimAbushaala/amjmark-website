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
        <h1 className="font-display text-3xl font-extrabold text-zinc-900">Shop</h1>
        <p className="mt-2 text-zinc-500">
          Preset sheets and ready-pressed apparel. Need a fully custom layout?{" "}
          <Link href="/design" className="font-semibold text-brand-700 underline underline-offset-2">
            Use the gang sheet builder →
          </Link>
        </p>

        <div className="mt-5 flex gap-2 text-sm font-semibold">
          <Link
            href="/shop"
            className={`rounded-full px-4 py-1.5 ${!filterType ? "bg-brand-700 text-white" : "border border-zinc-300 text-zinc-600 hover:border-zinc-500"}`}
          >
            All
          </Link>
          {SHOP_TYPES.map((t) => (
            <Link
              key={t}
              href={`/shop?type=${t}`}
              className={`rounded-full px-4 py-1.5 ${filterType === t ? "bg-brand-700 text-white" : "border border-zinc-300 text-zinc-600 hover:border-zinc-500"}`}
            >
              {TYPE_LABELS[t]}
            </Link>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-zinc-400">No products yet — check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const price = p.variants[0]?.priceCents ?? p.basePriceCents;
            return (
              <Link
                key={p.id}
                href={`/shop/${p.slug}`}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-zinc-400"
              >
                <div className="flex aspect-square items-center justify-center bg-zinc-100 text-zinc-400">
                  {p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-4xl">🧵</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                    {TYPE_LABELS[p.type] ?? p.type}
                  </div>
                  <div className="mt-1 font-semibold text-zinc-900 group-hover:text-zinc-600">{p.name}</div>
                  {price != null && <div className="mt-1 text-sm text-zinc-500">From {formatCents(price)}</div>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

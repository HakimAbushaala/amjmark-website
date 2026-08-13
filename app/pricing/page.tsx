import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/format";
import { GANG_SHEET_WIDTH_IN } from "@/lib/pricing";

export default async function PricingPage() {
  const [gangSheetTiers, rushRule, presetSheet, wholesaleTiers] = await Promise.all([
    prisma.pricingRule.findMany({
      where: { productType: "gang_sheet_custom", active: true, minSqIn: { not: null } },
      orderBy: { minSqIn: "asc" },
    }),
    prisma.pricingRule.findFirst({
      where: { productType: "gang_sheet_custom", active: true, flatFeeCents: { not: null } },
    }),
    prisma.product.findUnique({
      where: { slug: "preset-dtf-gang-sheet" },
      include: { variants: { where: { active: true }, orderBy: { priceCents: "asc" } } },
    }),
    prisma.pricingRule.findMany({
      where: { productType: "apparel", active: true, minQuantity: { not: null } },
      orderBy: { minQuantity: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl font-extrabold text-zinc-900">Sizes &amp; Pricing</h1>
      <p className="mt-3 max-w-2xl text-zinc-500">
        Every price on this page comes straight from our live pricing rules — no surprises at checkout.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-zinc-900">Custom Gang Sheets</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Build any layout at {GANG_SHEET_WIDTH_IN}&quot; wide in the{" "}
          <Link href="/design" className="font-semibold text-brand-700 underline underline-offset-2">
            Gang Sheet Builder
          </Link>
          . Rate scales down automatically as your total sheet area grows.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Volume</th>
                <th className="px-4 py-3 text-right">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {gangSheetTiers.map((tier) => (
                <tr key={tier.id}>
                  <td className="px-4 py-3 text-zinc-700">{tier.label}</td>
                  <td className="px-4 py-3 text-right font-bold text-zinc-900">
                    ${(tier.rateCentsPerUnit! / 100).toFixed(3)}/sq in
                  </td>
                </tr>
              ))}
              {rushRule && (
                <tr>
                  <td className="px-4 py-3 text-zinc-700">{rushRule.label}</td>
                  <td className="px-4 py-3 text-right font-bold text-brand-700">
                    +{formatCents(rushRule.flatFeeCents!)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {presetSheet && presetSheet.variants.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-zinc-900">Preset Sheet Sizes</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Already know your size? Order one directly — no layout tool needed.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {presetSheet.variants.map((v) => (
              <div key={v.id} className="rounded-xl border border-zinc-200 bg-white p-4 text-center">
                <div className="font-bold text-zinc-900">{v.name}</div>
                <div className="mt-1 text-brand-700">{formatCents(v.priceCents)}</div>
              </div>
            ))}
          </div>
          <Link
            href={`/shop/${presetSheet.slug}`}
            className="mt-4 inline-block font-semibold text-brand-700 underline underline-offset-2"
          >
            Order a preset sheet →
          </Link>
        </section>
      )}

      {wholesaleTiers.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-zinc-900">Wholesale &amp; Bulk Apparel</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Discounts apply automatically at checkout once your quantity crosses these thresholds.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3 text-right">Discount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {wholesaleTiers.map((tier) => (
                  <tr key={tier.id}>
                    <td className="px-4 py-3 text-zinc-700">{tier.minQuantity}+ units</td>
                    <td className="px-4 py-3 text-right font-bold text-brand-700">{tier.discountPercent}% off</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

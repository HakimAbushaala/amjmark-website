"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatCents } from "@/lib/format";

type Variant = { id: string; name: string; priceCents: number; inventoryCount: number };

export function AddToCartForm({
  product,
  variants,
}: {
  product: { id: string; name: string; image: string | null; basePriceCents: number | null };
  variants: Variant[];
}) {
  const { addLine } = useCart();
  const router = useRouter();
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = variants.find((v) => v.id === variantId) ?? null;
  const unitPriceCents = variant?.priceCents ?? product.basePriceCents ?? 0;
  const outOfStock = variant != null && variant.inventoryCount <= 0;

  function handleAdd() {
    addLine({
      kind: "product",
      lineId: `${product.id}:${variant?.id ?? "base"}`,
      productId: product.id,
      variantId: variant?.id ?? null,
      name: product.name,
      variantName: variant?.name ?? null,
      image: product.image,
      qty,
      unitPriceCents,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mt-6 space-y-5">
      <div className="text-2xl font-extrabold text-zinc-900">{formatCents(unitPriceCents)}</div>

      {variants.length > 1 && (
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-400">Option</label>
          <select
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id} disabled={v.inventoryCount <= 0}>
                {v.name} {v.inventoryCount <= 0 ? "(out of stock)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-400">Quantity</label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
        />
      </div>

      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className="w-full rounded-full bg-zinc-900 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {outOfStock ? "Out of Stock" : added ? "Added ✓" : "Add to Cart"}
      </button>

      {added && (
        <button
          onClick={() => router.push("/cart")}
          className="w-full rounded-full border border-zinc-300 px-6 py-2 text-sm font-semibold text-zinc-600 hover:border-zinc-500"
        >
          View Cart →
        </button>
      )}
    </div>
  );
}

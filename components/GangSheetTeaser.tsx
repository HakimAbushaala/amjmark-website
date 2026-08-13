"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatCents } from "@/lib/format";

type Variant = { id: string; name: string; priceCents: number };

export function GangSheetTeaser({ productId, variants }: { productId: string; variants: Variant[] }) {
  const { addLine } = useCart();
  const [selectedId, setSelectedId] = useState(variants[variants.length - 1]?.id ?? "");
  const [added, setAdded] = useState(false);

  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];

  function handleAddToCart() {
    if (!selected) return;
    addLine({
      kind: "product",
      lineId: `${productId}:${selected.id}`,
      productId,
      variantId: selected.id,
      name: "Preset DTF Gang Sheet",
      variantName: selected.name,
      image: null,
      qty: 1,
      unitPriceCents: selected.priceCents,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <Link
        href="/gang-sheet-builder.html"
        className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center transition hover:border-brand-700 hover:bg-brand-50"
      >
        <span className="text-2xl">⬆</span>
        <span className="font-semibold text-zinc-700">Drag &amp; drop your files here</span>
        <span className="text-sm font-semibold text-brand-700 underline underline-offset-2">
          or open the full builder
        </span>
        <span className="text-xs text-zinc-400">PNG, JPG, PDF — auto-packed at 300 DPI</span>
      </Link>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setSelectedId(v.id)}
            className={`rounded-xl border-2 px-3 py-3 text-center transition ${
              v.id === selectedId ? "border-brand-700 bg-brand-50" : "border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <div className="font-bold text-zinc-900">{v.name}</div>
            <div className="text-sm text-zinc-500">{formatCents(v.priceCents)}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-zinc-400">Est. Price</div>
          <div className="text-2xl font-extrabold text-zinc-900">
            {selected ? formatCents(selected.priceCents) : "$0.00"}
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selected}
          className="rounded-full bg-brand-700 px-8 py-3 font-bold text-white shadow-sm transition hover:bg-brand-800 disabled:opacity-50"
        >
          {added ? "Added ✓" : "Add to Cart →"}
        </button>
      </div>
      <p className="mt-3 text-xs text-zinc-400">
        Already have a print-ready file? Add a size to your cart and attach it in the order notes at checkout — or
        use the full builder above for a custom multi-design layout.
      </p>
    </div>
  );
}

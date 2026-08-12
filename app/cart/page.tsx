"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { lineTotalCents } from "@/lib/cart-types";
import { formatCents } from "@/lib/format";

export default function CartPage() {
  const { lines, removeLine, setQty, addLine, subtotalCents } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const addedDraftIds = useRef(new Set<string>());
  const [loadingDraft, setLoadingDraft] = useState(false);

  useEffect(() => {
    const draftId = searchParams.get("add");
    if (!draftId || addedDraftIds.current.has(draftId)) return;
    addedDraftIds.current.add(draftId);
    setLoadingDraft(true);

    fetch(`/api/cart/draft/${draftId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Design not found");
        return res.json();
      })
      .then((draft) => {
        addLine({
          kind: "gang_sheet_custom",
          lineId: draft.id,
          draftId: draft.id,
          description: `Custom Gang Sheet ${draft.sheetWidthIn}"×${draft.sheetHeightIn}"${draft.sheetQty > 1 ? ` ×${draft.sheetQty}` : ""}${draft.rush ? " (Rush)" : ""}`,
          thumbnailUrl: draft.compositedImageUrl,
          widthIn: draft.sheetWidthIn,
          heightIn: draft.sheetHeightIn,
          sheetQty: draft.sheetQty,
          unitPriceCents: draft.priceCents,
        });
        router.replace("/cart");
      })
      .catch(() => {
        // draft missing/expired — silently drop, nothing to add
      })
      .finally(() => setLoadingDraft(false));
  }, [searchParams, addLine, router]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-3xl font-extrabold text-zinc-900">Your Cart</h1>

      {loadingDraft && <p className="mt-6 text-sm text-zinc-500">Adding your design…</p>}

      {lines.length === 0 && !loadingDraft ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 p-12 text-center text-zinc-400">
          Your cart is empty.
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/design" className="font-semibold text-zinc-900 underline underline-offset-2">
              Design a Gang Sheet
            </Link>
            <span>·</span>
            <Link href="/shop" className="font-semibold text-zinc-900 underline underline-offset-2">
              Browse Shop
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {lines.map((line) => (
            <div
              key={line.lineId}
              className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100">
                {line.kind === "gang_sheet_custom" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={line.thumbnailUrl} alt="Gang sheet design" className="h-full w-full object-contain" />
                ) : line.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl">🧵</span>
                )}
              </div>

              <div className="flex-1">
                <div className="font-semibold text-zinc-900">
                  {line.kind === "gang_sheet_custom" ? line.description : line.name}
                </div>
                {line.kind === "product" && line.variantName && (
                  <div className="text-xs text-zinc-500">{line.variantName}</div>
                )}
                {line.kind === "product" && (
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-xs text-zinc-500">Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={line.qty}
                      onChange={(e) => setQty(line.lineId, parseInt(e.target.value) || 1)}
                      className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900"
                    />
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="font-bold text-zinc-900">{formatCents(lineTotalCents(line))}</div>
                <button
                  onClick={() => removeLine(line.lineId)}
                  className="mt-1 text-xs text-zinc-400 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <div>
              <div className="text-xs uppercase tracking-wide text-zinc-500">Estimated Subtotal</div>
              <div className="text-2xl font-extrabold text-zinc-900">{formatCents(subtotalCents)}</div>
            </div>
            <button
              onClick={() => router.push("/checkout")}
              className="rounded-full bg-zinc-900 px-8 py-3 font-bold text-white shadow-sm transition hover:bg-zinc-800"
            >
              Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export type CartLine =
  | {
      kind: "gang_sheet_custom";
      lineId: string; // = draftId, drafts are one-shot so this is a stable unique key
      draftId: string;
      description: string;
      thumbnailUrl: string;
      widthIn: number;
      heightIn: number;
      sheetQty: number;
      unitPriceCents: number; // price for the whole draft (already includes sheetQty + rush)
    }
  | {
      kind: "product";
      lineId: string; // = `${productId}:${variantId ?? "base"}`
      productId: string;
      variantId: string | null;
      name: string;
      variantName: string | null;
      image: string | null;
      qty: number;
      unitPriceCents: number;
    };

export function lineTotalCents(line: CartLine): number {
  if (line.kind === "gang_sheet_custom") return line.unitPriceCents;
  return line.unitPriceCents * line.qty;
}

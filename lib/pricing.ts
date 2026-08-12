import { prisma } from "@/lib/prisma";
import type { ProductType } from "@prisma/client";

export const GANG_SHEET_WIDTH_IN = 22.5;

// Fallback values if pricing_rules hasn't been seeded yet — kept in sync
// with the original gang-sheet builder's updatePrice() JS logic so a fresh
// DB never produces a broken price.
const FALLBACK_GANG_SHEET_TIERS = [
  { minSqIn: 5400, rateCentsPerUnit: 2.0 }, // 37.5 sq ft
  { minSqIn: 2700, rateCentsPerUnit: 2.5 }, // 18.75 sq ft
  { minSqIn: 0, rateCentsPerUnit: 3.0 },
];
const FALLBACK_RUSH_FEE_CENTS = 2000;

export type GangSheetPriceResult = {
  sqIn: number;
  rateCentsPerUnit: number;
  subtotalCents: number;
  rushFeeCents: number;
  totalCents: number;
};

/**
 * Authoritative gang-sheet price. Mirrors the original tool's tiers, which
 * key off *total* sq in across all copies (sheetHeightIn * width * qty),
 * not sq in of a single sheet.
 */
export async function calcGangSheetPriceCents(
  sheetHeightIn: number,
  sheetQty: number,
  rush: boolean,
): Promise<GangSheetPriceResult> {
  const sqIn = GANG_SHEET_WIDTH_IN * sheetHeightIn;
  const totalSqIn = sqIn * sheetQty;

  const rules = await prisma.pricingRule.findMany({
    where: { productType: "gang_sheet_custom", active: true, minSqIn: { not: null } },
    orderBy: { minSqIn: "desc" },
  });

  const tiers =
    rules.length > 0
      ? rules.map((r) => ({ minSqIn: r.minSqIn!, rateCentsPerUnit: r.rateCentsPerUnit! }))
      : FALLBACK_GANG_SHEET_TIERS;

  const tier = tiers.find((t) => totalSqIn >= t.minSqIn) ?? tiers[tiers.length - 1];

  const rushRule = await prisma.pricingRule.findFirst({
    where: { productType: "gang_sheet_custom", active: true, flatFeeCents: { not: null } },
  });
  const rushFeeAmount = rushRule?.flatFeeCents ?? FALLBACK_RUSH_FEE_CENTS;

  const subtotalCents = Math.round(sqIn * tier.rateCentsPerUnit * sheetQty);
  const rushFeeCents = rush ? rushFeeAmount : 0;

  return {
    sqIn,
    rateCentsPerUnit: tier.rateCentsPerUnit,
    subtotalCents,
    rushFeeCents,
    totalCents: subtotalCents + rushFeeCents,
  };
}

/** Applies the best-matching wholesale qty-break discount for a product type. */
export async function applyWholesaleDiscount(
  productType: ProductType,
  unitPriceCents: number,
  qty: number,
): Promise<{ unitPriceCents: number; discountPercent: number }> {
  const rules = await prisma.pricingRule.findMany({
    where: { productType, active: true, minQuantity: { not: null }, discountPercent: { not: null } },
    orderBy: { minQuantity: "desc" },
  });

  const match = rules.find((r) => qty >= r.minQuantity!);
  if (!match) return { unitPriceCents, discountPercent: 0 };

  const discountPercent = match.discountPercent!;
  return {
    unitPriceCents: Math.round(unitPriceCents * (1 - discountPercent / 100)),
    discountPercent,
  };
}

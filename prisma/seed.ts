import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Print-on-demand items (preset sheets) aren't physically stocked, so they
// get a large placeholder inventoryCount rather than a real cap. Apparel is
// physical stock and gets a real, small count the admin should edit.
const UNLIMITED_STOCK = 999_999;

async function main() {
  // --- Gang sheet pricing tiers (ported 1:1 from the original builder's
  // updatePrice() thresholds: >=37.5 sq ft -> $0.02/sq in, >=18.75 -> $0.025,
  // else $0.03) ---
  await prisma.pricingRule.deleteMany({ where: { productType: "gang_sheet_custom" } });
  await prisma.pricingRule.createMany({
    data: [
      { productType: "gang_sheet_custom", label: "Volume rate — 37.5+ sq ft", minSqIn: 5400, rateCentsPerUnit: 2.0, sortOrder: 1 },
      { productType: "gang_sheet_custom", label: "Discount rate — 18.75+ sq ft", minSqIn: 2700, rateCentsPerUnit: 2.5, sortOrder: 2 },
      { productType: "gang_sheet_custom", label: "Standard rate", minSqIn: 0, rateCentsPerUnit: 3.0, sortOrder: 3 },
      { productType: "gang_sheet_custom", label: "Rush Service", flatFeeCents: 2000, sortOrder: 4 },
    ],
  });

  // --- Wholesale qty-break discounts ---
  await prisma.pricingRule.deleteMany({ where: { productType: { in: ["apparel", "gang_sheet_preset"] } } });
  await prisma.pricingRule.createMany({
    data: [
      { productType: "apparel", label: "Wholesale 50+", minQuantity: 50, discountPercent: 20, sortOrder: 1 },
      { productType: "apparel", label: "Wholesale 20+", minQuantity: 20, discountPercent: 10, sortOrder: 2 },
      { productType: "apparel", label: "Bulk 10+", minQuantity: 10, discountPercent: 5, sortOrder: 3 },
      { productType: "gang_sheet_preset", label: "Bulk 10+", minQuantity: 10, discountPercent: 10, sortOrder: 1 },
    ],
  });

  // --- Preset DTF gang sheets ---
  const presetSheet = await prisma.product.upsert({
    where: { slug: "preset-dtf-gang-sheet" },
    update: {},
    create: {
      slug: "preset-dtf-gang-sheet",
      name: "Preset DTF Gang Sheet",
      description: "A ready-made sheet size when you don't need the full custom layout tool. Same 300 DPI print quality.",
      type: "gang_sheet_preset",
      active: true,
    },
  });

  const presetVariants: { name: string; sku: string; priceCents: number }[] = [
    { name: '12" × 12"', sku: "SHEET-12X12", priceCents: 1500 },
    { name: '22" × 24"', sku: "SHEET-22X24", priceCents: 4500 },
    { name: '22" × 36"', sku: "SHEET-22X36", priceCents: 6500 },
  ];
  for (const v of presetVariants) {
    await prisma.productVariant.upsert({
      where: { sku: v.sku },
      update: { priceCents: v.priceCents, productId: presetSheet.id },
      create: { ...v, productId: presetSheet.id, inventoryCount: UNLIMITED_STOCK },
    });
  }

  // --- Ready-pressed apparel (placeholder — real inventory to be edited later) ---
  const tee = await prisma.product.upsert({
    where: { slug: "classic-tee" },
    update: {},
    create: {
      slug: "classic-tee",
      name: "Classic Tee — Ready Pressed",
      description: "Placeholder product. Replace with real apparel, sizes, colors, and stock counts.",
      type: "apparel",
      basePriceCents: 2000,
      active: true,
    },
  });

  const teeVariants: { name: string; sku: string; priceCents: number; inventoryCount: number }[] = [
    { name: "Black / S", sku: "TEE-BLK-S", priceCents: 2000, inventoryCount: 25 },
    { name: "Black / M", sku: "TEE-BLK-M", priceCents: 2000, inventoryCount: 25 },
    { name: "Black / L", sku: "TEE-BLK-L", priceCents: 2000, inventoryCount: 25 },
    { name: "White / S", sku: "TEE-WHT-S", priceCents: 2000, inventoryCount: 25 },
    { name: "White / M", sku: "TEE-WHT-M", priceCents: 2000, inventoryCount: 25 },
    { name: "White / L", sku: "TEE-WHT-L", priceCents: 2000, inventoryCount: 25 },
  ];
  for (const v of teeVariants) {
    await prisma.productVariant.upsert({
      where: { sku: v.sku },
      update: { priceCents: v.priceCents, inventoryCount: v.inventoryCount, productId: tee.id },
      create: { ...v, productId: tee.id },
    });
  }

  console.log("Seed complete:", { presetSheet: presetSheet.slug, tee: tee.slug });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

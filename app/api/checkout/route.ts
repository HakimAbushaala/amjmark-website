import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { applyWholesaleDiscount } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/server";

const cartLineSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("gang_sheet_custom"),
    draftId: z.string().uuid(),
  }),
  z.object({
    kind: z.literal("product"),
    productId: z.string().uuid(),
    variantId: z.string().uuid().nullable(),
    qty: z.number().int().min(1).max(1000),
  }),
]);

const bodySchema = z.object({
  lines: z.array(cartLineSchema).min(1),
  customerName: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  shippingAddress: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(1).default("US"),
  }),
  notes: z.string().max(2000).optional(),
});

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  type ResolvedItem = {
    description: string;
    qty: number;
    unitPriceCents: number;
    productId?: string;
    variantId?: string;
    widthIn?: number;
    heightIn?: number;
    designAssetUrl?: string;
    layoutJson?: unknown;
  };

  const resolved: ResolvedItem[] = [];
  let subtotalCents = 0;
  let rushFeeCents = 0;

  for (const line of body.lines) {
    if (line.kind === "gang_sheet_custom") {
      const draft = await prisma.designDraft.findUnique({ where: { id: line.draftId } });
      if (!draft) {
        return NextResponse.json({ error: `Design ${line.draftId} not found — please rebuild it` }, { status: 400 });
      }
      resolved.push({
        description: `Custom Gang Sheet ${draft.sheetWidthIn}"×${draft.sheetHeightIn}" ×${draft.sheetQty}${draft.rush ? " (Rush)" : ""}`,
        qty: 1,
        unitPriceCents: draft.priceCents,
        widthIn: draft.sheetWidthIn,
        heightIn: draft.sheetHeightIn,
        designAssetUrl: draft.compositedImageUrl,
        layoutJson: draft.itemsJson,
      });
      subtotalCents += draft.subtotalCents;
      rushFeeCents += draft.rushFeeCents;
    } else {
      const product = await prisma.product.findUnique({
        where: { id: line.productId },
        include: { variants: true },
      });
      if (!product || !product.active) {
        return NextResponse.json({ error: "A product in your cart is no longer available" }, { status: 400 });
      }
      const variant = line.variantId ? product.variants.find((v) => v.id === line.variantId) : null;
      if (line.variantId && (!variant || !variant.active)) {
        return NextResponse.json({ error: "A selected product option is no longer available" }, { status: 400 });
      }
      if (variant && variant.inventoryCount < line.qty) {
        return NextResponse.json({ error: `Not enough stock for ${product.name} — ${variant.name}` }, { status: 400 });
      }

      const basePrice = variant?.priceCents ?? product.basePriceCents;
      if (basePrice == null) {
        return NextResponse.json({ error: `${product.name} has no price set` }, { status: 400 });
      }

      const { unitPriceCents } = await applyWholesaleDiscount(product.type, basePrice, line.qty);

      resolved.push({
        description: variant ? `${product.name} — ${variant.name}` : product.name,
        qty: line.qty,
        unitPriceCents,
        productId: product.id,
        variantId: variant?.id,
      });
      subtotalCents += unitPriceCents * line.qty;
    }
  }

  const totalCents = subtotalCents + rushFeeCents;
  if (totalCents < 50) {
    return NextResponse.json({ error: "Order total is too low to process" }, { status: 400 });
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: user?.id,
        email: body.email,
        customerName: body.customerName,
        phone: body.phone,
        shippingAddress: body.shippingAddress,
        notes: body.notes,
        subtotalCents,
        rushFeeCents,
        totalCents,
        status: "pending_payment",
        items: {
          create: resolved.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            description: item.description,
            qty: item.qty,
            unitPriceCents: item.unitPriceCents,
            widthIn: item.widthIn,
            heightIn: item.heightIn,
            designAssetUrl: item.designAssetUrl,
            layoutJson: item.layoutJson as never,
          })),
        },
      },
    });
    return created;
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user?.email ?? body.email,
    line_items: resolved.map((item) => ({
      quantity: item.qty,
      price_data: {
        currency: "usd",
        unit_amount: item.unitPriceCents,
        product_data: { name: item.description },
      },
    })),
    metadata: { orderId: order.id },
    success_url: `${siteUrl}/order/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout?cancelled=1`,
  });

  await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });

  return NextResponse.json({ url: session.url });
}

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcGangSheetPriceCents } from "@/lib/pricing";

const bodySchema = z.object({
  compositedImage: z.string().startsWith("data:image/png;base64,"),
  sheetWidthIn: z.number().positive(),
  sheetHeightIn: z.number().positive(),
  sheetQty: z.number().int().min(1).max(500),
  rush: z.boolean(),
  notes: z.string().max(2000).optional(),
  items: z.array(
    z.object({
      widthIn: z.number().positive(),
      heightIn: z.number().positive(),
      xIn: z.number(),
      yIn: z.number(),
      rotationDeg: z.number(),
      qty: z.number().int().min(1),
    }),
  ).min(1),
});

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid design payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;

  // Authoritative price — never trust a client-supplied total.
  const price = await calcGangSheetPriceCents(body.sheetHeightIn, body.sheetQty, body.rush);

  const base64 = body.compositedImage.split(",", 2)[1];
  const buffer = Buffer.from(base64, "base64");
  const path = `gang-sheets/${crypto.randomUUID()}.png`;

  const supabase = createAdminClient();
  const { error: uploadError } = await supabase.storage
    .from("designs")
    .upload(path, buffer, { contentType: "image/png", upsert: false });

  if (uploadError) {
    console.error("design upload failed", uploadError);
    return NextResponse.json({ error: "Could not save design file" }, { status: 502 });
  }

  const { data: publicUrlData } = supabase.storage.from("designs").getPublicUrl(path);

  const draft = await prisma.designDraft.create({
    data: {
      compositedImageUrl: publicUrlData.publicUrl,
      sheetWidthIn: body.sheetWidthIn,
      sheetHeightIn: body.sheetHeightIn,
      itemsJson: body.items,
      rush: body.rush,
      sheetQty: body.sheetQty,
      notes: body.notes,
      subtotalCents: price.subtotalCents,
      rushFeeCents: price.rushFeeCents,
      priceCents: price.totalCents,
    },
  });

  return NextResponse.json({
    draftId: draft.id,
    priceCents: draft.priceCents,
    compositedImageUrl: draft.compositedImageUrl,
  });
}

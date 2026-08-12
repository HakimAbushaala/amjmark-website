import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const draft = await prisma.designDraft.findUnique({ where: { id } });
  if (!draft) {
    return NextResponse.json({ error: "Design not found" }, { status: 404 });
  }
  return NextResponse.json({
    id: draft.id,
    compositedImageUrl: draft.compositedImageUrl,
    sheetWidthIn: draft.sheetWidthIn,
    sheetHeightIn: draft.sheetHeightIn,
    sheetQty: draft.sheetQty,
    rush: draft.rush,
    priceCents: draft.priceCents,
  });
}

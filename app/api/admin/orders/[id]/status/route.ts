import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { sendOrderShippedEmail } from "@/lib/email";

const bodySchema = z.object({
  status: z.enum(["pending_payment", "paid", "in_production", "shipped", "completed", "cancelled"]),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const order = await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
    include: { items: true },
  });

  if (parsed.data.status === "shipped") {
    await sendOrderShippedEmail({
      orderId: order.id,
      customerName: order.customerName,
      customerEmail: order.email,
      totalCents: order.totalCents,
      items: order.items.map((i) => ({ description: i.description, qty: i.qty })),
    }).catch((e) => console.error("shipped email failed", e));
  }

  return NextResponse.json({ ok: true, status: order.status });
}

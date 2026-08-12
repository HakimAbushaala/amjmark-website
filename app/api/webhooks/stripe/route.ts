import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendAdminOrderAlertEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("checkout.session.completed with no orderId in metadata", session.id);
      return NextResponse.json({ received: true });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { variant: true } } },
    });

    if (!order) {
      console.error("Order not found for webhook", orderId);
      return NextResponse.json({ received: true });
    }

    // Idempotent — Stripe may deliver this event more than once.
    if (order.status === "pending_payment") {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: {
            status: "paid",
            stripePaymentIntentId:
              typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
          },
        }),
        ...order.items
          .filter((item) => item.variantId)
          .map((item) =>
            prisma.productVariant.update({
              where: { id: item.variantId! },
              data: { inventoryCount: { decrement: item.qty } },
            }),
          ),
      ]);

      const emailInfo = {
        orderId: order.id,
        customerName: order.customerName,
        customerEmail: order.email,
        totalCents: order.totalCents,
        items: order.items.map((i) => ({ description: i.description, qty: i.qty })),
      };

      await Promise.all([
        sendOrderConfirmationEmail(emailInfo).catch((e) => console.error("confirmation email failed", e)),
        sendAdminOrderAlertEmail(emailInfo).catch((e) => console.error("admin alert email failed", e)),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}

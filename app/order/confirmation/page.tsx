import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/format";
import { ClearCartOnMount } from "./ClearCartOnMount";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center text-zinc-400">No order to show.</div>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(session_id).catch(() => null);

  if (!session || session.payment_status !== "paid") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center text-zinc-500">
        <h1 className="font-display text-2xl font-bold text-zinc-900">Finishing up…</h1>
        <p className="mt-3">
          We&apos;re confirming your payment. If this doesn&apos;t update within a minute, check your email or
          contact info@amjmark.com.
        </p>
      </div>
    );
  }

  const orderId = session.metadata?.orderId;
  const order = orderId
    ? await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
    : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <ClearCartOnMount />
      <div className="text-5xl">✅</div>
      <h1 className="mt-4 font-display text-3xl font-extrabold text-zinc-900">Order Confirmed!</h1>
      <p className="mt-3 text-zinc-500">
        Thanks{order ? `, ${order.customerName}` : ""} — a confirmation email is on its way.
      </p>

      {order && (
        <div className="mt-8 space-y-2 rounded-xl border border-zinc-200 bg-white p-6 text-left">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-zinc-700">
                {item.qty} × {item.description}
              </span>
              <span className="text-zinc-500">{formatCents(item.unitPriceCents * item.qty)}</span>
            </div>
          ))}
          <div className="mt-3 flex justify-between border-t border-zinc-200 pt-3 font-bold text-zinc-900">
            <span>Total</span>
            <span>{formatCents(order.totalCents)}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/shop"
          className="rounded-full border border-zinc-300 px-6 py-2 font-semibold text-zinc-600 hover:border-zinc-500"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account"
          className="rounded-full bg-brand-700 px-6 py-2 font-bold text-white hover:bg-brand-800"
        >
          View Order History
        </Link>
      </div>
    </div>
  );
}

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
      <div className="mx-auto max-w-2xl px-6 py-24 text-center text-slate-500">No order to show.</div>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(session_id).catch(() => null);

  if (!session || session.payment_status !== "paid") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center text-slate-400">
        <h1 className="font-display text-2xl font-bold text-white">Finishing up…</h1>
        <p className="mt-3">
          We&apos;re confirming your payment. If this doesn&apos;t update within a minute, check your email or
          contact aabushaa@gmail.com.
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
      <h1 className="mt-4 font-display text-3xl font-extrabold text-white">Order Confirmed!</h1>
      <p className="mt-3 text-slate-400">
        Thanks{order ? `, ${order.customerName}` : ""} — a confirmation email is on its way.
      </p>

      {order && (
        <div className="mt-8 space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-left">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-slate-300">
                {item.qty} × {item.description}
              </span>
              <span className="text-slate-400">{formatCents(item.unitPriceCents * item.qty)}</span>
            </div>
          ))}
          <div className="mt-3 flex justify-between border-t border-slate-800 pt-3 font-bold text-amber-400">
            <span>Total</span>
            <span>{formatCents(order.totalCents)}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/shop"
          className="rounded-lg border border-slate-700 px-6 py-2 font-semibold text-slate-300 hover:border-slate-500"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account"
          className="rounded-lg bg-amber-500 px-6 py-2 font-bold text-slate-900 hover:brightness-110"
        >
          View Order History
        </Link>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/format";
import { StatusSelect } from "./StatusSelect";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  const address = order.shippingAddress as {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">Order #{order.id.slice(0, 8)}</h2>
        <StatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Customer</h3>
          <div className="text-white">{order.customerName}</div>
          <div className="text-sm text-slate-400">{order.email}</div>
          {order.phone && <div className="text-sm text-slate-400">{order.phone}</div>}
          <div className="mt-3 text-sm text-slate-400">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}
            <br />
            {address.city}, {address.state} {address.zip}
          </div>
          {order.notes && (
            <div className="mt-3 border-t border-slate-800 pt-3 text-sm text-slate-400">
              <span className="font-semibold text-slate-300">Notes:</span> {order.notes}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Totals</h3>
          <div className="flex justify-between text-sm text-slate-400">
            <span>Subtotal</span>
            <span>{formatCents(order.subtotalCents)}</span>
          </div>
          {order.rushFeeCents > 0 && (
            <div className="flex justify-between text-sm text-slate-400">
              <span>Rush Fee</span>
              <span>{formatCents(order.rushFeeCents)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-slate-800 pt-2 font-bold text-amber-400">
            <span>Total</span>
            <span>{formatCents(order.totalCents)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500">Items</h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b border-slate-800 pb-4 last:border-0 last:pb-0">
              {item.designAssetUrl ? (
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.designAssetUrl} alt={item.description} className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800 text-2xl">
                  🧵
                </div>
              )}
              <div className="flex-1">
                <div className="font-semibold text-white">{item.description}</div>
                <div className="text-sm text-slate-500">
                  Qty {item.qty} · {formatCents(item.unitPriceCents)} each
                </div>
              </div>
              {item.designAssetUrl && (
                <a
                  href={item.designAssetUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-amber-500/50 hover:text-amber-400"
                >
                  Download Print File
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

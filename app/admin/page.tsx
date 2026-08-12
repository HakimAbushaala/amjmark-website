import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/format";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Payment Pending",
  paid: "Paid",
  in_production: "In Production",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  pending_payment: "text-slate-400",
  paid: "text-amber-400",
  in_production: "text-blue-400",
  shipped: "text-emerald-400",
  completed: "text-emerald-500",
  cancelled: "text-red-400",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    where: { status: { not: "pending_payment" } },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
        Orders ({orders.length})
      </h2>
      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-900/60">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-semibold text-amber-400 hover:text-amber-300">
                    #{order.id.slice(0, 8)}
                  </Link>
                  <div className="text-xs text-slate-500">{order.createdAt.toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {order.customerName}
                  <div className="text-xs text-slate-500">{order.email}</div>
                </td>
                <td className="px-4 py-3 text-slate-400">{order.items.length} item(s)</td>
                <td className={`px-4 py-3 font-semibold ${STATUS_COLORS[order.status] ?? ""}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </td>
                <td className="px-4 py-3 text-right font-bold text-white">{formatCents(order.totalCents)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

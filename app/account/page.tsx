import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/format";
import { SignOutButton } from "./SignOutButton";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Payment Pending",
  paid: "Paid",
  in_production: "In Production",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // proxy.ts already redirects unauthenticated visitors before this renders.
  if (!user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-zinc-900">Your Orders</h1>
          <p className="mt-1 text-sm text-zinc-500">{user.email}</p>
        </div>
        <SignOutButton />
      </div>

      {orders.length === 0 ? (
        <p className="mt-10 text-zinc-400">No orders yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-zinc-900">Order #{order.id.slice(0, 8)}</div>
                  <div className="text-xs text-zinc-400">{order.createdAt.toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                    {STATUS_LABELS[order.status] ?? order.status}
                  </div>
                  <div className="font-bold text-zinc-900">{formatCents(order.totalCents)}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 border-t border-zinc-200 pt-3 text-sm text-zinc-500">
                {order.items.map((item) => (
                  <div key={item.id}>
                    {item.qty} × {item.description}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

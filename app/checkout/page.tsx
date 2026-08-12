"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatCents } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const { lines, subtotalCents } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setForm((f) => ({ ...f, email: data.user!.email! }));
    });
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) =>
            l.kind === "gang_sheet_custom"
              ? { kind: "gang_sheet_custom", draftId: l.draftId }
              : { kind: "product", productId: l.productId, variantId: l.variantId, qty: l.qty },
          ),
          customerName: form.customerName,
          email: form.email,
          phone: form.phone || undefined,
          shippingAddress: {
            line1: form.line1,
            line2: form.line2 || undefined,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: "US",
          },
          notes: form.notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center text-zinc-400">
        Your cart is empty.{" "}
        <Link href="/shop" className="font-semibold text-zinc-900 underline underline-offset-2">
          Browse the shop →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-extrabold text-zinc-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 sm:grid-cols-2">
        <div className="space-y-4 sm:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">Contact & Shipping</h2>
        </div>

        <Field label="Full Name *" value={form.customerName} onChange={(v) => update("customerName", v)} required />
        <Field label="Email *" type="email" value={form.email} onChange={(v) => update("email", v)} required />
        <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} />
        <Field label="Address Line 1 *" value={form.line1} onChange={(v) => update("line1", v)} required />
        <Field label="Address Line 2" value={form.line2} onChange={(v) => update("line2", v)} />
        <Field label="City *" value={form.city} onChange={(v) => update("city", v)} required />
        <Field label="State *" value={form.state} onChange={(v) => update("state", v)} required />
        <Field label="ZIP *" value={form.zip} onChange={(v) => update("zip", v)} required />

        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-400">
            Order Notes
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="min-h-24 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-5 sm:col-span-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-zinc-500">Estimated Total</div>
            <div className="text-2xl font-extrabold text-zinc-900">{formatCents(subtotalCents)}</div>
            <div className="text-xs text-zinc-400">Final total is confirmed on the next screen.</div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-zinc-900 px-8 py-3 font-bold text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {submitting ? "Redirecting to payment…" : "Continue to Payment →"}
          </button>
        </div>

        {error && <p className="text-sm text-red-500 sm:col-span-2">{error}</p>}
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-400">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
      />
    </div>
  );
}

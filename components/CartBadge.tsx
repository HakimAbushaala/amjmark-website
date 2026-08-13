"use client";

import { useCart } from "@/components/CartProvider";

export function CartBadge() {
  const { count } = useCart();
  return (
    <span className="relative">
      Cart
      {count > 0 && (
        <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-700 px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </span>
  );
}

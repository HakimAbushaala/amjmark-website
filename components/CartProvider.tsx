"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { CartLine } from "@/lib/cart-types";
import { lineTotalCents } from "@/lib/cart-types";

const STORAGE_KEY = "amj-mark-cart";

// Module-level store synced to localStorage. getSnapshot/getServerSnapshot
// only ever run in the browser vs. on the server respectively, so this
// mutable module state never leaks between server requests — it's one
// instance per browser tab.
type Listener = () => void;
let cartState: CartLine[] = [];
let hydrated = false;
const listeners = new Set<Listener>();

function loadFromStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCart(next: CartLine[]) {
  cartState = next;
  hydrated = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — cart just won't persist across reloads
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (!hydrated) {
    cartState = loadFromStorage();
    hydrated = true;
  }
  return cartState;
}

const EMPTY_CART: CartLine[] = [];

function getServerSnapshot(): CartLine[] {
  return EMPTY_CART;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  return children;
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addLine = useCallback((line: CartLine) => {
    const prev = getSnapshot();
    const existing = prev.find((l) => l.lineId === line.lineId);
    if (!existing) {
      setCart([...prev, line]);
      return;
    }
    if (line.kind === "product" && existing.kind === "product") {
      setCart(prev.map((l) => (l.lineId === line.lineId ? { ...existing, qty: existing.qty + line.qty } : l)));
      return;
    }
    // gang_sheet_custom drafts are one-shot; re-adding replaces the line
    setCart(prev.map((l) => (l.lineId === line.lineId ? line : l)));
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setCart(getSnapshot().filter((l) => l.lineId !== lineId));
  }, []);

  const setQty = useCallback((lineId: string, qty: number) => {
    setCart(
      getSnapshot().map((l) => (l.lineId === lineId && l.kind === "product" ? { ...l, qty: Math.max(1, qty) } : l)),
    );
  }, []);

  const clear = useCallback(() => setCart([]), []);

  const subtotalCents = lines.reduce((sum, l) => sum + lineTotalCents(l), 0);
  const count = lines.reduce((sum, l) => sum + (l.kind === "product" ? l.qty : 1), 0);

  return { lines, addLine, removeLine, setQty, clear, subtotalCents, count };
}

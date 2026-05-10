"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/lib/types";
import { readJson, storageKeys, writeJson } from "@/lib/storage";

type CartCtx = {
  lines: CartLine[];
  add: (medicineId: string, qty?: number) => void;
  setQty: (medicineId: string, qty: number) => void;
  remove: (medicineId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    queueMicrotask(() =>
      setLines(readJson<CartLine[]>(storageKeys.CART_KEY, [])),
    );
  }, []);

  const persist = useCallback((next: CartLine[]) => {
    setLines(next);
    writeJson(storageKeys.CART_KEY, next);
  }, []);

  const add = useCallback(
    (medicineId: string, qty = 1) => {
      const next = [...lines];
      const i = next.findIndex((l) => l.medicineId === medicineId);
      if (i >= 0) next[i] = { ...next[i], qty: next[i].qty + qty };
      else next.push({ medicineId, qty });
      persist(next);
    },
    [lines, persist],
  );

  const setQty = useCallback(
    (medicineId: string, qty: number) => {
      if (qty <= 0) {
        persist(lines.filter((l) => l.medicineId !== medicineId));
        return;
      }
      const next = lines.map((l) => (l.medicineId === medicineId ? { ...l, qty } : l));
      persist(next);
    },
    [lines, persist],
  );

  const remove = useCallback(
    (medicineId: string) => persist(lines.filter((l) => l.medicineId !== medicineId)),
    [lines, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  const value = useMemo(
    () => ({ lines, add, setQty, remove, clear }),
    [lines, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

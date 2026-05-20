"use client";

import { useCart } from "@/context/CartContext";

export function MedicineDetailActions({
  medicineId,
  price,
  mrp,
}: {
  medicineId: string;
  price: number;
  mrp: number;
}) {
  const { add } = useCart();
  const disc = mrp > price ? Math.round((1 - price / mrp) * 100) : null;
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-emerald-950/10 bg-white/80 p-4 shadow-[0_18px_60px_-44px_rgb(6_46_34/0.75)] backdrop-blur">
      <div>
        <div className="text-4xl font-black tracking-tight text-emerald-950">₹{price}</div>
        <div className="text-sm font-semibold text-neutral-500">
          {disc !== null && (
            <>
              <span className="line-through">₹{mrp}</span> · {disc}% off
            </>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => add(medicineId)}
        className="rounded-2xl border border-emerald-950 bg-[#dfff1a] px-8 py-3 text-sm font-black uppercase tracking-[0.14em] text-emerald-950 shadow-[0_18px_38px_-24px_rgb(6_46_34/0.95)] hover:bg-[#e8ff50]"
      >
        Add to cart
      </button>
    </div>
  );
}

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
    <div className="flex flex-wrap items-center gap-4">
      <div>
        <div className="text-3xl font-bold text-emerald-800">₹{price}</div>
        <div className="text-sm text-neutral-500">
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
        className="rounded-2xl border-2 border-emerald-950 bg-[#dfff1a] px-8 py-3 text-sm font-black uppercase tracking-wide text-emerald-950 shadow-lg hover:bg-[#e8ff50]"
      >
        Add to cart
      </button>
    </div>
  );
}

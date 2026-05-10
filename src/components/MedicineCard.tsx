"use client";

import Link from "next/link";
import Image from "next/image";
import type { Medicine } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export function MedicineCard({ m }: { m: Medicine }) {
  const { add } = useCart();
  const price = m.discountedPrice ?? m.mrp;
  const disco = m.discountedPrice ? Math.round((1 - m.discountedPrice / m.mrp) * 100) : null;

  return (
    <article className="group flex gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-[0_8px_30px_-12px_rgb(15_118_110/0.25)] transition hover:border-[#b8f077] hover:shadow-[0_12px_36px_-10px_rgb(15_118_110/0.35)]">
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-100 ring-2 ring-emerald-950/5">
        <Image
          src={`https://picsum.photos/seed/${m.slug}/200/200`}
          alt={m.brand}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="112px"
        />
        {m.prescriptionsRequired && (
          <span className="absolute left-2 top-2 rounded-md bg-amber-500 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
            Rx
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <Link
          href={`/medicine/${m.slug}`}
          className="text-[15px] font-bold leading-snug text-neutral-900 hover:text-emerald-700"
        >
          {m.brand}
        </Link>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-neutral-600">{m.usesSummary}</p>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-black text-emerald-900">₹{price}</span>
          {disco !== null && <span className="text-xs text-neutral-400 line-through">₹{m.mrp}</span>}
          {disco !== null && (
            <span className="rounded-md bg-[#dfff1a] px-1.5 py-0.5 text-[11px] font-bold text-emerald-950">{disco}% off</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => add(m.id)}
          className="mt-4 w-full max-w-[8rem] rounded-xl border-2 border-emerald-950 bg-[#dfff1a] py-2 text-xs font-black uppercase tracking-wide text-emerald-950 shadow-sm hover:bg-[#e8ff50]"
        >
          Add
        </button>
      </div>
    </article>
  );
}

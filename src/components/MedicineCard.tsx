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
    <article className="group relative flex gap-4 overflow-hidden rounded-[1.35rem] border border-emerald-950/10 bg-white/90 p-4 shadow-[0_20px_70px_-44px_rgb(6_46_34/0.82)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#b8f077] hover:shadow-[0_28px_86px_-44px_rgb(6_46_34/0.95)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dfff1a]/80 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-emerald-950/10">
        <Image
          src={`https://picsum.photos/seed/${m.slug}/200/200`}
          alt={m.brand}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="112px"
        />
        {m.prescriptionsRequired && (
          <span className="absolute left-2 top-2 rounded-md bg-amber-500 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
            Rx
          </span>
        )}
        <span className="absolute bottom-2 left-2 rounded-full bg-emerald-950/82 px-2 py-0.5 text-[10px] font-black text-[#dfff1a] backdrop-blur">
          {m.etaMin ?? 18} min
        </span>
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <Link
          href={`/medicine/${m.slug}`}
          className="text-[15px] font-black leading-snug text-neutral-950 hover:text-emerald-700"
        >
          {m.brand}
        </Link>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-neutral-600">{m.usesSummary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-800">
            {m.stockQty ?? 0} in stock
          </span>
          <span className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-cyan-800">
            Safety AI
          </span>
        </div>
        {m.pharmacyName && <p className="mt-2 text-[11px] font-bold text-neutral-500">Uploaded by {m.pharmacyName}</p>}
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
          className="mt-4 w-full max-w-[8rem] rounded-xl border border-emerald-950 bg-[#dfff1a] py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-950 shadow-[0_14px_28px_-18px_rgb(6_46_34/0.95)] hover:bg-[#e8ff50]"
        >
          Add
        </button>
      </div>
    </article>
  );
}

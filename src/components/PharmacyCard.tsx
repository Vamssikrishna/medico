"use client";

import type { Pharmacy } from "@/lib/types";

export function PharmacyCard({ p }: { p: Pharmacy }) {
  const stockPercent = Math.round(p.stockScore * 100);

  return (
    <article className="group overflow-hidden rounded-[1.35rem] border border-emerald-950/10 bg-white/88 p-4 shadow-[0_20px_70px_-46px_rgb(6_46_34/0.85)] ring-1 ring-white/60 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#dfff1a]/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-neutral-950">{p.name}</h3>
          <p className="text-xs font-medium text-neutral-500">{p.distanceKm.toFixed(1)} km · Partner POS live</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${
            p.open ? "bg-emerald-950 text-[#dfff1a]" : "bg-neutral-200 text-neutral-600"
          }`}
        >
          {p.open ? "Open now" : "Closed"}
        </span>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-[11px] font-black uppercase tracking-wide text-emerald-900/70">
          <span>Stock confidence</span>
          <span>{stockPercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-emerald-950/10">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-[#dfff1a]" style={{ width: `${stockPercent}%` }} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-neutral-700">
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 tabular-nums">Rating {p.rating}</span>
        <span className="rounded-full bg-lime-100 px-2.5 py-1 text-emerald-950">{p.open ? `${p.etaMin} min ETA` : "Opens 8 AM"}</span>
      </div>
    </article>
  );
}

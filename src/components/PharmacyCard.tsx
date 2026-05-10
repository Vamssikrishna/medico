"use client";

import type { Pharmacy } from "@/lib/types";

export function PharmacyCard({ p }: { p: Pharmacy }) {
  return (
    <article className="rounded-2xl border-2 border-white bg-white p-4 shadow-[0_10px_36px_-14px_rgb(6_46_34/0.25)] ring-1 ring-emerald-950/[0.06]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-neutral-900">{p.name}</h3>
          <p className="text-xs text-neutral-500">{p.distanceKm.toFixed(1)} km · Stock score {(p.stockScore * 100).toFixed(0)}%</p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            p.open ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"
          }`}
        >
          {p.open ? "Open now" : "Closed"}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-neutral-700">
        <span className="tabular-nums text-neutral-600">Rating {p.rating}</span>
        <span>{p.open ? `${p.etaMin} min ETA` : "Opens tomorrow 8 AM"}</span>
      </div>
    </article>
  );
}

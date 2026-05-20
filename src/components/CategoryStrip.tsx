"use client";

import Link from "next/link";
import type { Category } from "@/lib/types";

const chip: Record<string, string> = {
  fever: "bg-gradient-to-br from-orange-400 to-rose-500 text-white",
  "cold-cough": "bg-gradient-to-br from-sky-400 to-indigo-500 text-white",
  diabetes: "bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white",
  heart: "bg-gradient-to-br from-rose-500 to-red-600 text-white",
  baby: "bg-gradient-to-br from-amber-300 to-orange-400 text-emerald-950",
  skin: "bg-gradient-to-br from-teal-400 to-emerald-600 text-white",
};

export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <section className="space-y-4 rounded-[1.75rem] border border-emerald-950/10 bg-white/55 p-4 shadow-[0_24px_80px_-48px_rgb(6_46_34/0.72)] backdrop-blur">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="mr-chip mb-2">
            <span className="mr-signal-dot" />
            Health graph
          </p>
          <h2 className="text-xl font-black tracking-tight text-neutral-950">Shop by need</h2>
        </div>
        <span className="text-xs font-black uppercase tracking-[0.16em] text-emerald-800/70">Swipe</span>
      </div>
      <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/search?q=${encodeURIComponent(c.slug)}`}
            className="group min-w-[7rem] flex-shrink-0 rounded-2xl border border-white/80 bg-white/82 p-3 text-center shadow-[0_16px_46px_-34px_rgb(6_46_34/0.9)] transition hover:-translate-y-1 hover:border-[#dfff1a] hover:shadow-[0_22px_60px_-34px_rgb(6_46_34/0.95)]"
          >
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-xs font-black shadow-inner ring-4 ring-white/70 transition group-hover:scale-105 ${chip[c.slug] ?? "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white"}`}
            >
              {c.abbr}
            </div>
            <div className="mt-2 text-[11px] font-black leading-tight text-neutral-800">{c.name}</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700/70">Fast match</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

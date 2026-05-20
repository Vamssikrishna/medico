"use client";

import Link from "next/link";
import type { BannerItem } from "@/lib/types";

const toneBg: Record<BannerItem["tone"], string> = {
  season: "from-emerald-700 via-emerald-600 to-teal-500",
  offer: "from-[#9ae600] via-lime-400 to-emerald-600 text-emerald-950",
  alert: "from-rose-600 via-orange-500 to-amber-500",
};

export function BannerCarousel({ items }: { items: BannerItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((b) => (
        <article
          key={b.id}
          className={`group relative min-h-[10rem] overflow-hidden rounded-[1.35rem] bg-gradient-to-br p-5 shadow-[0_22px_70px_-36px_rgb(6_46_34/0.85)] ring-1 ring-white/40 transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_90px_-42px_rgb(6_46_34/0.95)] ${toneBg[b.tone]} ${
            b.tone === "offer" ? "" : "text-white"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:26px_26px] opacity-35" />
          <div className="relative z-10 space-y-1">
            <div
              className={`mb-4 inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                b.tone === "offer" ? "bg-emerald-950/10 text-emerald-950" : "bg-white/18 text-white"
              }`}
            >
              Live campaign
            </div>
            <h3 className="text-base font-black leading-snug tracking-tight">{b.title}</h3>
            <p className={`text-sm font-medium ${b.tone === "offer" ? "text-emerald-950/80" : "text-white/90"}`}>
              {b.subtitle}
            </p>
            {b.cta && b.href && (
              <Link
                href={b.href}
                className={`mt-3 inline-flex rounded-full px-4 py-1.5 text-xs font-bold ${
                  b.tone === "offer"
                    ? "bg-emerald-950 text-[#dfff1a] hover:bg-emerald-900"
                    : "bg-white/25 text-white backdrop-blur hover:bg-white/35"
                } transition group-hover:translate-x-0.5`}
              >
                {b.cta}
              </Link>
            )}
          </div>
          <div className="pointer-events-none absolute -right-8 -bottom-10 h-36 w-36 rounded-full bg-[#dfff1a]/24 blur-3xl transition group-hover:scale-125" />
          <div className="pointer-events-none absolute right-5 top-5 h-14 w-14 rounded-full border border-white/20" />
        </article>
      ))}
    </div>
  );
}

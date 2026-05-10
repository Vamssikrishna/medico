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
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 shadow-xl ring-2 ring-white/30 ${toneBg[b.tone]} ${
            b.tone === "offer" ? "" : "text-white"
          }`}
        >
          <div className="relative z-10 space-y-1">
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
                }`}
              >
                {b.cta}
              </Link>
            )}
          </div>
          <div className="pointer-events-none absolute -right-8 -bottom-10 h-36 w-36 rounded-full bg-[#dfff1a]/20 blur-3xl" />
        </article>
      ))}
    </div>
  );
}

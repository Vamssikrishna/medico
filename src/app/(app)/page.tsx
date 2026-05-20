"use client";

import Link from "next/link";
import { BannerCarousel } from "@/components/BannerCarousel";
import { CategoryStrip } from "@/components/CategoryStrip";
import { SmartSearchBar } from "@/components/SmartSearchBar";
import { MedicineCard } from "@/components/MedicineCard";
import { useInventory } from "@/context/InventoryContext";
import { getPersonalizedBanners } from "@/lib/mock/banners";
import { categories } from "@/lib/mock/categories";

export default function HomePage() {
  const banners = getPersonalizedBanners({ flu: true });
  const { medicines } = useInventory();
  const picks = medicines.slice(0, 4);
  const pharmacyCount = new Set(medicines.map((m) => m.pharmacyName).filter(Boolean)).size;

  return (
    <>
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center">
        <div className="space-y-6">
          <span className="mr-chip mr-chip-accent">
            <span className="mr-signal-dot" />
            Live slots · OCR Rx · rider mesh
          </span>
          <h1 className="text-balance text-5xl font-black leading-[0.98] tracking-[-0.05em] text-neutral-950 md:text-7xl">
            Medicine delivery that feels{" "}
            <span className="text-transparent bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-500 bg-clip-text">
              intelligent
            </span>
            .
          </h1>
          <p className="max-w-2xl text-base font-semibold leading-relaxed text-neutral-600 md:text-lg">
            Search by brand, salt, symptom, barcode, or voice. Prescription OCR, safety checks, live pharmacy stock,
            rider batching, and OTP handoff are presented as one polished healthcare command center.
          </p>
          <SmartSearchBar variant="hero" />
          <div className="grid gap-3 text-sm text-neutral-600 sm:grid-cols-3">
            {[
              ["18 min", "median ETA"],
              [`${medicines.length}`, "uploaded items"],
              ["24/7", "safety routing"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-emerald-950/10 bg-white/65 px-4 py-3 shadow-sm backdrop-blur">
                <div className="text-2xl font-black text-emerald-950">{value}</div>
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-neutral-500">{label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
            <Link href="/guest" className="font-bold text-emerald-800 underline-offset-4 hover:underline">
              Guest fulfilment lane
            </Link>
            <span>·</span>
            <Link href="/symptom-assistant" className="font-bold text-emerald-800 underline-offset-4 hover:underline">
              Guided care assistant (non-diagnostic)
            </Link>
          </div>
        </div>
        <div className="mr-glow-card isolate rounded-[2rem] p-5 sm:p-6">
          <div className="relative space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-800/70">Fulfilment OS</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-neutral-950">Live ETA · batching-ready</h2>
              </div>
              <span className="rounded-full bg-emerald-950 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#dfff1a]">
                Online
              </span>
            </div>
            <div className="grid gap-3">
              <div className="rounded-3xl border border-emerald-950/10 bg-emerald-950 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-emerald-100">Rider pool density</span>
                  <span className="rounded-full bg-[#dfff1a] px-2 py-0.5 text-xs font-black text-emerald-950">High</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-emerald-300 to-[#dfff1a]" />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-emerald-100/80">
                  AI dispatch blends traffic, rider proximity, pharmacy stock probability and customer priority lanes.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-cyan-200/60 bg-cyan-50/70 px-4 py-3 text-sm font-semibold text-cyan-950">
                  Cold-chain tags for insulin & vaccines
                </div>
                <div className="rounded-2xl border border-lime-200/80 bg-lime-50/80 px-4 py-3 text-sm font-semibold text-emerald-950">
                  Doorstep OTP handshake active
                </div>
              </div>
              <BannerCarousel items={banners.slice(0, 1)} />
            </div>
          </div>
        </div>
      </section>

      <BannerCarousel items={banners.slice(1)} />

      <CategoryStrip categories={categories} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Pharmacy-uploaded inventory</h2>
          <Link href="/partner/pharmacy" className="text-sm font-semibold text-emerald-700 hover:underline">
            Upload stock
          </Link>
        </div>
        {picks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {picks.map((m) => (
              <MedicineCard key={m.id} m={m} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-emerald-300 bg-white/75 px-8 py-12 text-neutral-600">
            No predefined tablets are shown. A pharmacy must upload its inventory before customers can search or order.
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">Partner inventory network</h2>
        <div className="mr-glow-card rounded-3xl p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-3xl font-black text-emerald-950">{pharmacyCount}</div>
              <div className="text-xs font-black uppercase tracking-wide text-neutral-500">Uploading pharmacies</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-950">{medicines.reduce((sum, m) => sum + (m.stockQty ?? 0), 0)}</div>
              <div className="text-xs font-black uppercase tracking-wide text-neutral-500">Total stock units</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-950">{medicines.length ? "Live" : "Waiting"}</div>
              <div className="text-xs font-black uppercase tracking-wide text-neutral-500">Catalogue status</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

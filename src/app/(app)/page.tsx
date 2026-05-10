import Link from "next/link";
import { BannerCarousel } from "@/components/BannerCarousel";
import { CategoryStrip } from "@/components/CategoryStrip";
import { PharmacyCard } from "@/components/PharmacyCard";
import { SmartSearchBar } from "@/components/SmartSearchBar";
import { MedicineCard } from "@/components/MedicineCard";
import { getPersonalizedBanners } from "@/lib/mock/banners";
import { categories } from "@/lib/mock/categories";
import { pharmacies } from "@/lib/mock/pharmacies";
import { medicines } from "@/lib/mock/medicines";

export default function HomePage() {
  const banners = getPersonalizedBanners({ flu: true });
  const picks = medicines.slice(0, 4);

  return (
    <>
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-950/10 bg-[#dfff1a] px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-emerald-950 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Live slots · OCR Rx
          </span>
          <h1 className="text-balance text-4xl font-black leading-[1.08] tracking-tight text-neutral-950 md:text-[2.75rem]">
            Medicines on your doorstep in{" "}
            <span className="text-transparent bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-500 bg-clip-text">
              flash
            </span>
            .
          </h1>
          <p className="max-w-xl text-base font-medium leading-relaxed text-neutral-600">
            Search by brand or salt. Prescription uploads, rider tracking, delivery OTP — the quick-commerce experience
            for healthcare essentials.
          </p>
          <SmartSearchBar variant="hero" />
          <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
            <Link href="/guest" className="font-medium text-emerald-800 underline-offset-4 hover:underline">
              Guest fulfilment lane
            </Link>
            <span>·</span>
            <Link href="/symptom-assistant" className="font-medium text-emerald-800 underline-offset-4 hover:underline">
              Guided care assistant (non-diagnostic)
            </Link>
          </div>
        </div>
        <div className="relative isolate overflow-hidden rounded-3xl border-2 border-[#dfff1a]/60 bg-white p-6 shadow-[0_24px_60px_-20px_rgb(6_46_34/0.35)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(52,211,153,0.35),transparent_55%),radial-gradient(circle_at_90%_20%,rgba(190,242,100,0.35),transparent_55%)]" />
          <div className="relative space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900">Live ETA · batching-ready</h2>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-emerald-900">Rider pool density</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    High
                  </span>
                </div>
                <p className="mt-2 text-xs text-emerald-800/80">
                  AI dispatch blends traffic, rider proximity, pharmacy stock probability and customer priority lanes.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm">
                Cold-chain tagging for insulin & vaccines; delivery OTP handshake at doorstep.
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
          <h2 className="text-lg font-semibold text-neutral-900">Trending OTC picks</h2>
          <Link href="/search?q=fever" className="text-sm font-semibold text-emerald-700 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {picks.map((m) => (
            <MedicineCard key={m.id} m={m} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">Nearby pharmacies</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {pharmacies.map((p) => (
            <PharmacyCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}

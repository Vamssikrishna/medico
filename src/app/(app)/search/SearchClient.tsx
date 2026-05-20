"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SmartSearchBar } from "@/components/SmartSearchBar";
import { MedicineCard } from "@/components/MedicineCard";
import { useInventory } from "@/context/InventoryContext";
import { queryWasAdjusted, rankMedicines, typoCorrectDisplay } from "@/lib/search-engine";

export default function SearchClient() {
  const params = useSearchParams();
  const { medicines } = useInventory();
  const q = params.get("q") ?? "";

  const ranked = useMemo(
    () => rankMedicines(medicines, q, { distanceKm: 0.9, stockScore: 0.92, etaMin: 16 }),
    [medicines, q],
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-neutral-900">Smart search</h1>
        <p className="text-sm text-neutral-600">
          Typo correction, salt matching, symptom routing, and AI-style ranking (demo heuristics).
        </p>
        <SmartSearchBar variant="compact" placeholder="Search brand, salt, symptom or scan…" />
      </div>
      {queryWasAdjusted(q) && (
        <p className="text-sm text-emerald-800">
          Showing results for <span className="font-semibold">{typoCorrectDisplay(q)}</span>
        </p>
      )}
      {!q && (
        <p className="text-sm text-neutral-500">
          Start typing after a pharmacy uploads inventory, or go to{" "}
          <Link href="/partner/pharmacy" className="font-medium text-emerald-700">Pharmacy</Link> to add tablets.
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {ranked.map((m) => (
          <MedicineCard key={m.id} m={m} />
        ))}
      </div>
      {ranked.length === 0 && (
        <p className="rounded-3xl border border-dashed border-emerald-300 bg-white/75 px-6 py-10 text-neutral-600">
          No pharmacy-uploaded medicines found. Add inventory from the pharmacy partner dashboard first.
        </p>
      )}
    </div>
  );
}

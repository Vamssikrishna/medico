"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SmartSearchBar } from "@/components/SmartSearchBar";
import { MedicineCard } from "@/components/MedicineCard";
import { medicines } from "@/lib/mock/medicines";
import { queryWasAdjusted, rankMedicines, typoCorrectDisplay } from "@/lib/search-engine";

export default function SearchClient() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";

  const ranked = useMemo(
    () => rankMedicines(medicines, q, { distanceKm: 0.9, stockScore: 0.92, etaMin: 16 }),
    [q],
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
          Start typing on the home hero or here — try <Link href="/search?q=paracitamol" className="font-medium text-emerald-700">paracitamol</Link>.
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {ranked.map((m) => (
          <MedicineCard key={m.id} m={m} />
        ))}
      </div>
      {q && ranked.length === 0 && (
        <p className="text-neutral-600">No direct matches — broaden your phrase or browse categories.</p>
      )}
    </div>
  );
}

import type { Medicine } from "@/lib/types";

/** Lightweight typo map for demo “smart search” */
const TYPO_MAP: Record<string, string> = {
  paracitamol: "paracetamol",
  paracetamol: "paracetamol",
  crocin: "crocin",
  dolo: "dolo",
  ibuprofin: "ibuprofen",
  couph: "cough",
  diabetis: "diabetes",
};

function normalize(q: string) {
  return q.trim().toLowerCase();
}

function expandQuery(q: string) {
  const n = normalize(q);
  const words = n.split(/\s+/).filter(Boolean);
  const corrected = words.map((w) => TYPO_MAP[w] ?? w).join(" ");
  return corrected;
}

function scoreMedicine(m: Medicine, corrected: string): number {
  const haystack = [
    m.brand,
    m.slug.replace(/-/g, " "),
    ...m.genericSalts,
    ...m.symptoms,
    m.manufacturer,
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const term of corrected.split(/\s+/)) {
    if (!term) continue;
    if (haystack.includes(term)) score += 3;
    if (m.brand.toLowerCase().startsWith(term)) score += 2;
    if (m.slug.startsWith(term)) score += 1;
    for (const s of m.symptoms) {
      if (s.includes(term)) score += 1.5;
    }
    for (const g of m.genericSalts) {
      if (g.toLowerCase().includes(term)) score += 2;
    }
  }
  return score;
}

export type RankFactors = {
  distanceWeight?: number;
  stockWeight?: number;
  speedWeight?: number;
  prefs?: Record<string, number>; // symptom preference boosts
};

/**
 * Demo AI ranking — blends text relevance + mock ops signals.
 */
export function rankMedicines(
  meds: Medicine[],
  query: string,
  ops?: { distanceKm?: number; stockScore?: number; etaMin?: number },
  weights: RankFactors = {},
) {
  const corrected = expandQuery(query);
  const prefBoost = weights.prefs ?? {};

  const wD = weights.distanceWeight ?? 0.15;
  const wS = weights.stockWeight ?? 0.25;
  const wT = weights.speedWeight ?? 0.2;

  const dist = ops?.distanceKm ?? 1.2;
  const stock = ops?.stockScore ?? 0.9;
  const eta = ops?.etaMin ?? 18;

  return [...meds]
    .map((m) => {
      let text = scoreMedicine(m, corrected);
      for (const [k, v] of Object.entries(prefBoost)) {
        if (m.symptoms.some((s) => s.includes(k))) text += v;
      }
      const opsScore =
        wS * stock + wT * (1 / Math.max(5, eta)) * 10 - wD * Math.min(3, dist);
      return { m, score: text + opsScore };
    })
    .filter((row) => row.score > 0 || corrected.length < 2)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.m);
}

export function suggestMedicines(all: Medicine[], partial: string, limit = 6) {
  const q = expandQuery(partial);
  if (!q) return all.slice(0, limit);
  return rankMedicines(all, q).slice(0, limit);
}

export function typoCorrectDisplay(raw: string) {
  return expandQuery(raw);
}

/** True when typo map or token normalization changed the query. */
export function queryWasAdjusted(raw: string) {
  return expandQuery(raw) !== normalize(raw);
}

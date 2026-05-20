import type { Medicine } from "@/lib/types";

export function getGenericAlternatives(catalog: Medicine[], medicineId: string) {
  const m = catalog.find((x) => x.id === medicineId);
  if (!m) return [];
  const salt = m.genericSalts[0]?.toLowerCase();
  return catalog.filter(
    (x) =>
      x.id !== m.id && x.genericSalts.some((s) => s.toLowerCase().includes(salt ?? "")),
  );
}

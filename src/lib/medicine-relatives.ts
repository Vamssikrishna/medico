import { medicines } from "@/lib/mock/medicines";

export function getGenericAlternatives(medicineId: string) {
  const m = medicines.find((x) => x.id === medicineId);
  if (!m) return [];
  const salt = m.genericSalts[0]?.toLowerCase();
  return medicines.filter(
    (x) =>
      x.id !== m.id && x.genericSalts.some((s) => s.toLowerCase().includes(salt ?? "")),
  );
}

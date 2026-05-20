import type { Medicine } from "@/lib/types";

// Medicine inventory must come from pharmacy uploads, not bundled seed data.
export const medicines: Medicine[] = [];

export function getMedicineBySlug(slug: string) {
  return medicines.find((m) => m.slug === slug);
}

export function getMedicineById(id: string) {
  return medicines.find((m) => m.id === id);
}

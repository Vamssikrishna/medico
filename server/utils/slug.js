export function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function medicineSlug(brand, pharmacyName) {
  return slugify(`${brand}-${pharmacyName}`) || `medicine-${Date.now()}`;
}

import type { CartLine, Medicine } from "@/lib/types";
import { getMedicineById } from "@/lib/mock/medicines";

export type CartIssue = {
  type: "duplicate" | "interaction" | "dose" | "rx_required" | "age_restriction";
  message: string;
  medicineIds: string[];
};

function lineKey(m: Medicine) {
  const salt = m.genericSalts[0]?.toLowerCase() ?? m.brand.toLowerCase();
  return salt;
}

function approximateParacetamolDailyLimit(m: Medicine, qty: number) {
  const match = m.strength.match(/(\d+)/);
  const perTab = match ? Number(match[1]) : 500;
  const maxPerDayMg = 4000;
  return perTab * qty <= maxPerDayMg;
}

export function validateCart(lines: CartLine[]): CartIssue[] {
  const issues: CartIssue[] = [];
  const meds = lines
    .map((l) => {
      const m = getMedicineById(l.medicineId);
      return m ? { l, m } : null;
    })
    .filter((x): x is { l: CartLine; m: Medicine } => x !== null);

  const saltBuckets = new Map<string, string[]>();
  for (const { m } of meds) {
    const k = lineKey(m);
    const arr = saltBuckets.get(k) ?? [];
    arr.push(m.id);
    saltBuckets.set(k, arr);
  }
  for (const [, ids] of saltBuckets) {
    if (ids.length > 1) {
      issues.push({
        type: "duplicate",
        message: "Similar medicine with same active ingredient may be duplicated.",
        medicineIds: ids,
      });
    }
  }

  const alcoholInteraction = meds.filter(({ m }) =>
    m.interactions.some((i) => i.with.toLowerCase().includes("alcohol") && i.severity === "danger"),
  );
  if (alcoholInteraction.length > 1) {
    issues.push({
      type: "interaction",
      message: "Multiple items carry strong alcohol interaction warnings.",
      medicineIds: alcoholInteraction.map(({ m }) => m.id),
    });
  }

  for (const { l, m } of meds) {
    if (m.genericSalts.some((s) => s.toLowerCase().includes("paracetamol"))) {
      if (!approximateParacetamolDailyLimit(m, l.qty * 6)) {
        issues.push({
          type: "dose",
          message: `High quantity for ${m.brand} — review total paracetamol per day with a pharmacist.`,
          medicineIds: [m.id],
        });
      }
    }
  }

  for (const { l, m } of meds) {
    if (m.prescriptionsRequired && l.qty > 0) {
      issues.push({
        type: "rx_required",
        message: `${m.brand} needs a valid prescription before checkout.`,
        medicineIds: [m.id],
      });
    }
  }

  return issues;
}

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, line) => {
    const m = getMedicineById(line.medicineId);
    if (!m) return sum;
    const price = m.discountedPrice ?? m.mrp;
    return sum + price * line.qty;
  }, 0);
}

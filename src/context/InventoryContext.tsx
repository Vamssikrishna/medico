"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Medicine } from "@/lib/types";
import { apiJson } from "@/lib/api-client";

type InventoryCtx = {
  medicines: Medicine[];
  loading: boolean;
  error: string;
  upsertMedicine: (medicine: Medicine) => void;
  removeMedicine: (id: string) => void;
  clearInventory: () => void;
  getMedicineById: (id: string) => Medicine | undefined;
  getMedicineBySlug: (slug: string) => Medicine | undefined;
};

const InventoryContext = createContext<InventoryCtx | null>(null);

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeMedicineSlug(brand: string, pharmacyName: string) {
  return normalizeSlug(`${brand}-${pharmacyName}`) || `medicine-${Date.now()}`;
}

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void apiJson<{ medicines: Medicine[] }>("/api/inventory")
      .then((data) => {
        if (!active) return;
        setMedicines(data.medicines);
        setError("");
      })
      .catch((err: Error) => {
        if (!active) return;
        setMedicines([]);
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const upsertMedicine = useCallback(
    (medicine: Medicine) => {
      const previous = medicines;
      const optimistic = [medicine, ...medicines.filter((m) => m.id !== medicine.id)].sort((a, b) =>
        (b.uploadedAt ?? "").localeCompare(a.uploadedAt ?? ""),
      );
      setMedicines(optimistic);
      void apiJson<{ medicine: Medicine }>("/api/inventory", {
        method: "POST",
        body: JSON.stringify(medicine),
      })
        .then((data) => {
          setMedicines((current) => [data.medicine, ...current.filter((m) => m.id !== medicine.id && m.id !== data.medicine.id)]);
          setError("");
        })
        .catch((err: Error) => {
          setMedicines(previous);
          setError(err.message);
        });
    },
    [medicines],
  );

  const removeMedicine = useCallback(
    (id: string) => {
      const previous = medicines;
      setMedicines(medicines.filter((m) => m.id !== id));
      void apiJson("/api/inventory/" + encodeURIComponent(id), { method: "DELETE" }).catch((err: Error) => {
        setMedicines(previous);
        setError(err.message);
      });
    },
    [medicines],
  );

  const clearInventory = useCallback(() => {
    const previous = medicines;
    setMedicines([]);
    void apiJson("/api/inventory", { method: "DELETE" }).catch((err: Error) => {
      setMedicines(previous);
      setError(err.message);
    });
  }, [medicines]);

  const getMedicineById = useCallback((id: string) => medicines.find((m) => m.id === id), [medicines]);
  const getMedicineBySlug = useCallback((slug: string) => medicines.find((m) => m.slug === slug), [medicines]);

  const value = useMemo(
    () => ({ medicines, loading, error, upsertMedicine, removeMedicine, clearInventory, getMedicineById, getMedicineBySlug }),
    [medicines, loading, error, upsertMedicine, removeMedicine, clearInventory, getMedicineById, getMedicineBySlug],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be inside InventoryProvider");
  return ctx;
}

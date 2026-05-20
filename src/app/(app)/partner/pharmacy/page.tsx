"use client";

import { useMemo, useState } from "react";
import { makeMedicineSlug, useInventory } from "@/context/InventoryContext";
import type { Medicine } from "@/lib/types";

const emptyForm = {
  pharmacyName: "",
  brand: "",
  genericSalts: "",
  strength: "",
  form: "Tablet",
  mrp: "",
  discountedPrice: "",
  manufacturer: "",
  stockQty: "",
  etaMin: "18",
  prescriptionsRequired: false,
  temperatureSensitive: false,
  usesSummary: "",
};

export default function PharmacyPartnerPage() {
  const { medicines, loading, error, upsertMedicine, removeMedicine, clearInventory } = useInventory();
  const [form, setForm] = useState(emptyForm);
  const [csv, setCsv] = useState("");
  const stats = useMemo(() => {
    const lowStock = medicines.filter((m) => (m.stockQty ?? 0) <= 5).length;
    const pharmacies = new Set(medicines.map((m) => m.pharmacyName).filter(Boolean)).size;
    const stock = medicines.reduce((sum, m) => sum + (m.stockQty ?? 0), 0);
    const value = medicines.reduce((sum, m) => sum + (m.discountedPrice ?? m.mrp) * (m.stockQty ?? 0), 0);
    return { lowStock, pharmacies, stock, value };
  }, [medicines]);

  function buildMedicine(row: typeof emptyForm): Medicine {
    const brand = row.brand.trim();
    const pharmacyName = row.pharmacyName.trim();
    const salts = row.genericSalts.split(",").map((s) => s.trim()).filter(Boolean);
    const slug = makeMedicineSlug(brand, pharmacyName);
    return {
      id: `${slug}-${Math.random().toString(36).slice(2, 8)}`,
      slug,
      brand,
      pharmacyName,
      genericSalts: salts.length ? salts : [brand],
      strength: row.strength.trim() || "As labelled",
      form: row.form.trim() || "Tablet",
      mrp: Number(row.mrp) || 0,
      discountedPrice: row.discountedPrice ? Number(row.discountedPrice) : undefined,
      manufacturer: row.manufacturer.trim() || pharmacyName,
      usesSummary: row.usesSummary.trim() || "Pharmacy-uploaded medicine. Verify label and pharmacist guidance before use.",
      simplifiedAi: "This item was uploaded by a pharmacy. Follow the label, prescription, and pharmacist instructions.",
      storageInstructions: row.temperatureSensitive ? "Cold-chain storage required." : "Store as per label in a cool, dry place.",
      commonSideEffects: ["Check product leaflet"],
      severeRisks: ["Seek medical help for allergic reaction or severe symptoms"],
      whenToConsult: ["If symptoms persist or worsen", "If pregnant, elderly, or treating a child"],
      prescriptionsRequired: row.prescriptionsRequired,
      temperatureSensitive: row.temperatureSensitive,
      symptoms: [brand, ...salts].map((s) => s.toLowerCase()),
      interactions: [{ with: "Current medicines", message: "Ask pharmacist to verify interactions before use.", severity: "info" }],
      stockQty: Number(row.stockQty) || 0,
      etaMin: Number(row.etaMin) || 18,
      uploadedAt: new Date().toISOString(),
    };
  }

  function submitOne() {
    if (!form.pharmacyName.trim() || !form.brand.trim() || !form.mrp.trim()) return;
    upsertMedicine(buildMedicine(form));
    setForm((current) => ({ ...emptyForm, pharmacyName: current.pharmacyName }));
  }

  function importCsv() {
    const rows = csv.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    for (const line of rows) {
      const [pharmacyName, brand, genericSalts, strength, formValue, mrp, stockQty, manufacturer] = line.split(",").map((cell) => cell.trim());
      if (!pharmacyName || !brand || !mrp) continue;
      upsertMedicine(
        buildMedicine({
          ...emptyForm,
          pharmacyName,
          brand,
          genericSalts,
          strength,
          form: formValue || "Tablet",
          mrp,
          stockQty: stockQty || "0",
          manufacturer,
        }),
      );
    }
    setCsv("");
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="mr-chip mb-3">
          <span className="mr-signal-dot" />
          Inventory owner
        </p>
        <h1 className="text-4xl font-black tracking-tight text-neutral-950">Pharmacy partner OS</h1>
        <p className="text-sm font-medium text-neutral-600">
          No tablets are predefined. Pharmacies create the live catalogue by uploading their own available stock.
        </p>
      </header>
      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-800">
          API connection issue: {error}. Make sure MongoDB and the Express API are running.
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Uploading pharmacies", value: String(stats.pharmacies) },
          { title: "Uploaded items", value: String(medicines.length) },
          { title: "Low stock alerts", value: String(stats.lowStock) },
          { title: "Stock value", value: `₹${Math.round(stats.value)}` },
        ].map((k) => (
          <div key={k.title} className="rounded-3xl border border-emerald-950/10 bg-white/88 p-4 shadow-sm backdrop-blur">
            <div className="text-xs font-black uppercase tracking-wide text-neutral-500">{k.title}</div>
            <div className="text-2xl font-black text-emerald-800">{k.value}</div>
          </div>
        ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="mr-glow-card rounded-3xl p-6">
          <h2 className="text-lg font-black">Upload single medicine</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["pharmacyName", "Pharmacy name"],
              ["brand", "Tablet / medicine name"],
              ["genericSalts", "Salt composition"],
              ["strength", "Strength"],
              ["form", "Form"],
              ["mrp", "MRP"],
              ["discountedPrice", "Selling price"],
              ["manufacturer", "Manufacturer"],
              ["stockQty", "Stock quantity"],
              ["etaMin", "ETA minutes"],
            ].map(([key, label]) => (
              <label key={key} className="text-xs font-black uppercase tracking-wide text-neutral-500">
                {label}
                <input
                  className="mt-1 w-full rounded-xl border border-emerald-950/10 bg-white px-3 py-2 text-sm font-semibold text-neutral-900"
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))}
                />
              </label>
            ))}
          </div>
          <label className="mt-3 block text-xs font-black uppercase tracking-wide text-neutral-500">
            Use / description
            <textarea
              className="mt-1 w-full rounded-xl border border-emerald-950/10 bg-white px-3 py-2 text-sm font-semibold text-neutral-900"
              rows={3}
              value={form.usesSummary}
              onChange={(e) => setForm((current) => ({ ...current, usesSummary: e.target.value }))}
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.prescriptionsRequired} onChange={(e) => setForm((current) => ({ ...current, prescriptionsRequired: e.target.checked }))} />
              Prescription required
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.temperatureSensitive} onChange={(e) => setForm((current) => ({ ...current, temperatureSensitive: e.target.checked }))} />
              Cold chain
            </label>
          </div>
          <button type="button" onClick={submitOne} className="mt-5 rounded-full bg-[#dfff1a] px-6 py-3 text-sm font-black text-emerald-950">
            Publish to catalogue
          </button>
        </div>

        <div className="space-y-4 rounded-3xl border border-emerald-950/10 bg-white/88 p-6 shadow-sm backdrop-blur">
          <h2 className="text-lg font-black">Bulk CSV upload</h2>
          <p className="text-sm font-medium text-neutral-600">
            One item per line: pharmacy, brand, salts, strength, form, mrp, stock, manufacturer
          </p>
          <textarea
            className="min-h-40 w-full rounded-2xl border border-emerald-950/10 bg-white px-4 py-3 font-mono text-xs"
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            placeholder="City Pharmacy, Brand Name, Salt Name, Strength, Tablet, MRP, Stock, Manufacturer"
          />
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={importCsv} className="rounded-full bg-emerald-950 px-5 py-2.5 text-sm font-black text-white">
              Import CSV
            </button>
            {medicines.length > 0 && (
              <button type="button" onClick={clearInventory} className="rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-black text-rose-700">
                Clear all inventory
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-950/10 bg-white/88 p-6 shadow-sm backdrop-blur">
        <h2 className="text-lg font-black">Live uploaded catalogue</h2>
        {loading && <p className="mt-2 text-sm font-semibold text-emerald-800">Loading MongoDB inventory...</p>}
        <div className="mt-4 grid gap-3">
          {medicines.map((m) => (
            <article key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-950/10 bg-white px-4 py-3">
              <div>
                <div className="font-black text-neutral-950">{m.brand}</div>
                <div className="text-xs font-semibold text-neutral-500">
                  {m.pharmacyName} · {m.genericSalts.join(" + ")} · {m.stockQty ?? 0} units · ₹{m.discountedPrice ?? m.mrp}
                </div>
              </div>
              <button type="button" onClick={() => removeMedicine(m.id)} className="text-xs font-black text-rose-600">
                Remove
              </button>
            </article>
          ))}
          {medicines.length === 0 && (
            <p className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 px-5 py-8 text-sm font-semibold text-emerald-900">
              Inventory is empty. Upload medicines above to make them appear across home, search, cart, and checkout.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useProfile } from "@/context/ProfileContext";

const steps = ["upload", "ocr", "review", "routing"] as const;

export default function PrescriptionsPage() {
  const { prescriptions, upsertPrescription } = useProfile();
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | null) {
    if (!file) return;
    setBusy(true);
    const id = `rx_${Math.random().toString(36).slice(2, 8)}`;
    upsertPrescription({
      id,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      status: "ai_review",
    });
    await new Promise((r) => setTimeout(r, 900));
    upsertPrescription({
      id,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      status: "pharmacist",
      extracted: {
        doctor: "Dr. Demo",
        medicines: ["Tab. Dolo 650", "Syrup Allegra"],
        duration: "5 days",
      },
    });
    setBusy(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Prescription intelligence</h1>
        <p className="text-sm text-neutral-600">
          Camera / PDF / gallery → OCR + NLP pipeline → pharmacist workstation (simulated).
        </p>
      </div>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="text-lg font-semibold">Upload</h2>
          <label className="block rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-12 text-center text-sm text-emerald-900">
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
            />
            Drop file or tap to upload
          </label>
          {busy && <p className="text-xs text-emerald-800">Processing with on-device preprocessing + OCR demo…</p>}
        </div>
        <div className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold">Workflow</h2>
          <ol className="space-y-3 text-sm">
            {steps.map((s, idx) => (
              <li key={s} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <span className="capitalize">{s}</span>
              </li>
            ))}
          </ol>
          <div className="rounded-2xl bg-neutral-950 p-4 font-mono text-xs text-lime-300">
            Fraud heuristics demo: signature entropy, date tamper checks, doctor registry crosswalk.
          </div>
        </div>
      </section>
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Queue</h2>
        <div className="mt-4 space-y-3">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-4 py-3">
              <div>
                <div className="font-semibold">{rx.fileName}</div>
                <div className="text-xs text-neutral-500">{rx.status}</div>
              </div>
              {rx.extracted && (
                <div className="text-sm text-neutral-700">
                  {rx.extracted.medicines.join(", ")} · {rx.extracted.duration}
                </div>
              )}
            </div>
          ))}
          {prescriptions.length === 0 && (
            <p className="text-sm text-neutral-600">No uploads yet — attach e-Rx from televisit or scan paper.</p>
          )}
        </div>
      </section>
    </div>
  );
}

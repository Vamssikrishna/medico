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
        doctor: "Uploaded prescription",
        medicines: [`Extracted from ${file.name}`],
        duration: "Awaiting pharmacist confirmation",
      },
    });
    setBusy(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mr-chip mb-3">
          <span className="mr-signal-dot" />
          OCR pipeline
        </p>
        <h1 className="text-4xl font-black tracking-tight text-neutral-950">Prescription intelligence</h1>
        <p className="text-sm font-medium text-neutral-600">
          Camera / PDF / gallery → OCR + NLP pipeline → pharmacist workstation (simulated).
        </p>
      </div>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="mr-glow-card space-y-4 rounded-3xl p-6 lg:col-span-1">
          <h2 className="text-lg font-black">Upload</h2>
          <label className="block rounded-2xl border-2 border-dashed border-emerald-300/80 bg-emerald-50/70 px-6 py-12 text-center text-sm font-black uppercase tracking-[0.14em] text-emerald-900">
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
        <div className="space-y-4 rounded-3xl border border-emerald-950/10 bg-white/88 p-6 shadow-[0_18px_60px_-46px_rgb(6_46_34/0.75)] backdrop-blur lg:col-span-2">
          <h2 className="text-lg font-black">Workflow</h2>
          <ol className="space-y-3 text-sm">
            {steps.map((s, idx) => (
              <li key={s} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-950 text-xs font-black text-[#dfff1a]">
                  {idx + 1}
                </span>
                <span className="capitalize">{s}</span>
              </li>
            ))}
          </ol>
          <div className="rounded-2xl bg-neutral-950 p-4 font-mono text-xs text-lime-300 shadow-inner">
            Fraud heuristics demo: signature entropy, date tamper checks, doctor registry crosswalk.
          </div>
        </div>
      </section>
      <section className="rounded-3xl border border-emerald-950/10 bg-white/88 p-6 shadow-[0_18px_60px_-46px_rgb(6_46_34/0.75)] backdrop-blur">
        <h2 className="text-lg font-black">Queue</h2>
        <div className="mt-4 space-y-3">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-950/10 bg-white/72 px-4 py-3">
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

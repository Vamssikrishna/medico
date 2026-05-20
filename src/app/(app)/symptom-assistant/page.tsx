"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useInventory } from "@/context/InventoryContext";
import { suggestMedicines } from "@/lib/search-engine";

const disclaimer =
  "MediRush AI does not diagnose. This assistant suggests OTC pathways and when to seek a clinician.";

export default function SymptomAssistantPage() {
  const [text, setText] = useState("");
  const { medicines } = useInventory();
  const recs = useMemo(() => suggestMedicines(medicines, text, 6), [medicines, text]);

  return (
    <div className="mr-glow-card mx-auto max-w-4xl space-y-6 rounded-[2rem] p-8">
      <div>
        <p className="mr-chip mb-3">
          <span className="mr-signal-dot" />
          Non-diagnostic care
        </p>
        <h1 className="text-4xl font-black tracking-tight text-neutral-950">AI symptom assistant</h1>
        <p className="mt-2 text-sm font-semibold text-amber-900/90">{disclaimer}</p>
      </div>
      <textarea
        className="w-full rounded-2xl border border-emerald-950/10 bg-white/80 px-4 py-3 text-sm font-semibold shadow-inner outline-none focus:border-emerald-700"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe how you feel..."
      />
      <div className="space-y-3">
        <h2 className="text-lg font-black">Suggested OTC paths</h2>
        <div className="grid gap-3">
          {recs.map((m, index) => (
            <Link
              key={m.id}
              href={`/medicine/${m.slug}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-950/10 bg-white/78 px-4 py-3 shadow-sm transition hover:border-[#dfff1a]"
            >
              <span>
                <span className="block font-black text-neutral-950">{m.brand}</span>
                <span className="block text-xs text-neutral-500">{m.usesSummary}</span>
              </span>
              <span className="shrink-0 rounded-full bg-emerald-950 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#dfff1a]">
                Path {index + 1}
              </span>
            </Link>
          ))}
          {recs.length === 0 && (
            <p className="rounded-2xl border border-dashed border-emerald-300 bg-white/75 px-4 py-6 text-sm text-neutral-600">
              No pharmacy-uploaded medicines match these symptoms yet.
            </p>
          )}
        </div>
      </div>
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50/85 px-4 py-3 text-sm font-semibold text-cyan-950">
        Escalation: video consult + e-Rx in{" "}
        <Link className="font-semibold text-emerald-700" href="/telemedicine">
          Telemedicine
        </Link>
      </div>
    </div>
  );
}

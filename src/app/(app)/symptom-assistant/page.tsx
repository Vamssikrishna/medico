"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { medicines } from "@/lib/mock/medicines";
import { suggestMedicines } from "@/lib/search-engine";

const disclaimer =
  "MediRush AI does not diagnose. This assistant suggests OTC pathways and when to seek a clinician.";

export default function SymptomAssistantPage() {
  const [text, setText] = useState("fever headache");
  const recs = useMemo(() => suggestMedicines(medicines, text, 6), [text]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">AI symptom assistant</h1>
        <p className="text-sm text-amber-900/90">{disclaimer}</p>
      </div>
      <textarea
        className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe how you feel..."
      />
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Suggested OTC paths</h2>
        <div className="grid gap-3">
          {recs.map((m) => (
            <Link
              key={m.id}
              href={`/medicine/${m.slug}`}
              className="rounded-2xl border border-neutral-200 px-4 py-3 hover:border-emerald-200"
            >
              <div className="font-semibold">{m.brand}</div>
              <div className="text-xs text-neutral-500">{m.usesSummary}</div>
            </Link>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm">
        Escalation: video consult + e-Rx in{" "}
        <Link className="font-semibold text-emerald-700" href="/telemedicine">
          Telemedicine
        </Link>
      </div>
    </div>
  );
}

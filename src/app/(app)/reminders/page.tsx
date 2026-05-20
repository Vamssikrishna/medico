"use client";

import { useMemo, useState } from "react";
import { useInventory } from "@/context/InventoryContext";

export default function RemindersPage() {
  const [on, setOn] = useState(true);
  const [taken, setTaken] = useState<Record<string, boolean>>({});
  const { medicines } = useInventory();
  const plans = useMemo(
    () =>
      medicines.slice(0, 4).map((m) => ({
        name: m.brand,
        dose: m.strength || "As labelled",
        time: "Set schedule",
        stock: m.stockQty ?? 0,
      })),
    [medicines],
  );
  const adherence = useMemo(() => {
    if (plans.length === 0) return 0;
    const done = Object.values(taken).filter(Boolean).length;
    return Math.round((done / plans.length) * 100);
  }, [plans.length, taken]);

  return (
    <div className="mr-glow-card space-y-6 rounded-[2rem] p-8">
      <p className="mr-chip">
        <span className="mr-signal-dot" />
        Smart adherence
      </p>
      <div>
        <h1 className="text-4xl font-black tracking-tight text-neutral-950">Medicine reminders</h1>
        <p className="mt-2 max-w-2xl font-medium text-neutral-600">
          Dosage tracking, refill prediction, and push notification handoff simulated with live adherence state.
        </p>
      </div>
      <label className="flex w-fit cursor-pointer items-center gap-3 rounded-full border border-emerald-950/10 bg-white/70 px-4 py-2 text-sm font-black">
        <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
        Enable smart refill prediction
      </label>
      <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="rounded-3xl bg-emerald-950 p-5 text-white">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[#dfff1a]">Today adherence</div>
          <div className="mt-3 text-6xl font-black tracking-tight">{adherence}%</div>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[#dfff1a]" style={{ width: `${adherence}%` }} />
          </div>
        </aside>
        <section className="space-y-3">
          {plans.map((plan) => (
            <article key={plan.name} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-emerald-950/10 bg-white/82 p-4 shadow-sm">
              <div>
                <h2 className="font-black text-neutral-950">{plan.name}</h2>
                <p className="text-sm font-medium text-neutral-600">{plan.dose} · {plan.time} · {plan.stock} days stock</p>
              </div>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-xs font-black ${
                  taken[plan.name] ? "bg-[#dfff1a] text-emerald-950" : "bg-emerald-950 text-white"
                }`}
                onClick={() => setTaken((current) => ({ ...current, [plan.name]: !current[plan.name] }))}
              >
                {taken[plan.name] ? "Taken" : "Mark taken"}
              </button>
            </article>
          ))}
          {plans.length === 0 && (
            <p className="rounded-3xl border border-dashed border-emerald-300 bg-white/75 px-5 py-8 text-sm font-semibold text-neutral-600">
              No reminder medicines yet. Upload pharmacy inventory first, then reminders can be created from real items.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

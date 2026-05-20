"use client";

import Link from "next/link";
import { useState } from "react";

const rails = ["UPI instant", "Card vault", "COD risk"];

export default function PaymentsPage() {
  const [selected, setSelected] = useState(rails[0]);

  return (
    <div className="mr-glow-card space-y-6 rounded-[2rem] p-8">
      <p className="mr-chip">
        <span className="mr-signal-dot" />
        Payment mesh
      </p>
      <div>
        <h1 className="text-4xl font-black tracking-tight text-neutral-950">Payments rails</h1>
        <p className="mt-2 max-w-2xl font-medium text-neutral-600">
          UPI, cards, wallets, COD orchestration, refund ledger, and risk checks with provider-ready handoff surfaces.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {rails.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSelected(item)}
            className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
              selected === item ? "border-[#dfff1a] bg-emerald-950 text-[#dfff1a]" : "border-emerald-950/10 bg-white/75"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="rounded-3xl border border-emerald-950/10 bg-white/76 p-5">
        <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-900/70">Selected rail</div>
        <div className="mt-1 text-2xl font-black text-emerald-950">{selected}</div>
        <p className="mt-2 text-sm font-medium text-neutral-600">Fraud scoring, tokenization, settlement, and invoice handoff are represented in this simulated control surface.</p>
      </div>
      <Link href="/checkout" className="inline-flex rounded-full bg-[#dfff1a] px-5 py-2 text-sm font-black text-emerald-950">
        Go to checkout
      </Link>
    </div>
  );
}

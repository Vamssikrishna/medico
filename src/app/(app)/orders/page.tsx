"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProfile } from "@/context/ProfileContext";
import type { OrderStatus } from "@/lib/types";

const liveStages: OrderStatus[] = ["placed", "packed", "rider_assigned", "out_for_delivery", "delivered"];

function liveOrderState(placedAt: string, baseEta: number, nowMs: number) {
  const elapsedSec = Math.max(0, Math.floor((nowMs - new Date(placedAt).getTime()) / 1000));
  const stageIndex = Math.min(liveStages.length - 1, Math.floor(elapsedSec / 18));
  const eta = stageIndex >= liveStages.length - 1 ? 0 : Math.max(1, baseEta - Math.floor(elapsedSec / 12));
  return { elapsedSec, stageIndex, status: liveStages[stageIndex], eta };
}

function OrdersInner() {
  const params = useSearchParams();
  const focus = params.get("id");
  const { orders } = useProfile();
  const [now, setNow] = useState(0);
  const highlighted = useMemo(() => orders.find((o) => o.id === focus), [orders, focus]);
  const liveNow = now || (highlighted ? new Date(highlighted.placedAt).getTime() : 0);
  const live = highlighted ? liveOrderState(highlighted.placedAt, highlighted.etaMin, liveNow) : null;

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mr-chip mb-3">
            <span className="mr-signal-dot" />
            Tracking telemetry
          </p>
          <h1 className="text-4xl font-black tracking-tight text-neutral-950">Live delivery</h1>
          <p className="text-sm font-medium text-neutral-600">Rider map streaming · batching · OTP handoff.</p>
        </div>
        <Link href="/" className="text-sm font-semibold text-emerald-700">
          Order more
        </Link>
      </div>
      {highlighted && (
        <section className="mr-glow-card grid gap-6 rounded-[2rem] p-6 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-black text-emerald-950">{highlighted.id}</h2>
            <p className="text-sm text-emerald-900/85">Status · {(live?.status ?? highlighted.status).replaceAll("_", " ")}</p>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {liveStages.map((stage, index) => (
                <div key={stage} className="space-y-2">
                  <div
                    className={`h-2 rounded-full ${
                      index <= (live?.stageIndex ?? 0) ? "bg-gradient-to-r from-emerald-600 to-[#dfff1a]" : "bg-emerald-950/10"
                    }`}
                  />
                  <div className="text-[10px] font-black uppercase tracking-wide text-emerald-950/60">
                    {stage.replaceAll("_", " ")}
                  </div>
                </div>
              ))}
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {highlighted.items.map((i) => (
                <li key={i.medicineId} className="flex justify-between gap-3">
                  <span>
                    {i.name} × {i.qty}
                  </span>
                  <span className="font-mono">₹{i.price * i.qty}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 rounded-2xl border border-emerald-950/10 bg-white/80 p-4 text-sm font-semibold">
            <div>Pharmacy · {highlighted.pharmacyName}</div>
            <div>Rider · {highlighted.riderName ?? "Assigning..."}</div>
            <div>
              ETA · <span className="font-semibold">{live?.eta ?? highlighted.etaMin} min</span>
            </div>
            <div>
              Batch ID · <span className="font-mono">{highlighted.batchId}</span>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-neutral-900 px-3 py-6 text-center text-xs text-lime-300">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(190,242,100,0.14)_1px,transparent_1px),linear-gradient(180deg,rgba(190,242,100,0.14)_1px,transparent_1px)] bg-[size:22px_22px]" />
              <div className="relative">Live rider map simulation · traffic overlay active · {live?.elapsedSec ?? 0}s stream</div>
            </div>
            <div className="text-lg font-semibold text-emerald-900">
              Delivery OTP · <span className="font-mono">{highlighted.deliveryOtp}</span>
            </div>
          </div>
        </section>
      )}
      <section className="space-y-3">
        <h2 className="text-lg font-black">History</h2>
        {orders.map((o) => (
          <article key={o.id} className="rounded-3xl border border-emerald-950/10 bg-white/88 p-4 shadow-[0_18px_60px_-46px_rgb(6_46_34/0.75)] backdrop-blur">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <div className="font-semibold">{o.id}</div>
                <div className="text-xs text-neutral-500">
                  {new Date(o.placedAt).toLocaleString()} · {liveOrderState(o.placedAt, o.etaMin, now || new Date(o.placedAt).getTime()).status.replaceAll("_", " ")}
                </div>
              </div>
              <Link href={`/orders?id=${encodeURIComponent(o.id)}`} className="text-sm font-semibold text-emerald-700">
                Track
              </Link>
            </div>
          </article>
        ))}
        {orders.length === 0 && (
          <p className="text-neutral-600">No orders yet — build a cart and checkout to see live telemetry.</p>
        )}
      </section>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="text-neutral-600">Loading tracker…</div>}>
      <OrdersInner />
    </Suspense>
  );
}

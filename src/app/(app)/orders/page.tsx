"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useProfile } from "@/context/ProfileContext";

function OrdersInner() {
  const params = useSearchParams();
  const focus = params.get("id");
  const { orders } = useProfile();
  const highlighted = useMemo(() => orders.find((o) => o.id === focus), [orders, focus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Live delivery</h1>
          <p className="text-sm text-neutral-600">Rider map streaming · batching · OTP handoff.</p>
        </div>
        <Link href="/" className="text-sm font-semibold text-emerald-700">
          Order more
        </Link>
      </div>
      {highlighted && (
        <section className="grid gap-6 rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-emerald-950">{highlighted.id}</h2>
            <p className="text-sm text-emerald-900/85">Status · {highlighted.status.replaceAll("_", " ")}</p>
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
          <div className="space-y-3 rounded-2xl border border-white bg-white/80 p-4 text-sm">
            <div>Pharmacy · {highlighted.pharmacyName}</div>
            <div>Rider · {highlighted.riderName ?? "Assigning..."}</div>
            <div>
              ETA · <span className="font-semibold">{highlighted.etaMin} min</span>
            </div>
            <div>
              Batch ID · <span className="font-mono">{highlighted.batchId}</span>
            </div>
            <div className="rounded-xl bg-neutral-900 px-3 py-3 text-center text-xs text-lime-300">
              Rider map tile / traffic overlay hooks here (Mapbox / Google · not wired in demo).
            </div>
            <div className="text-lg font-semibold text-emerald-900">
              Delivery OTP · <span className="font-mono">{highlighted.deliveryOtp}</span>
            </div>
          </div>
        </section>
      )}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">History</h2>
        {orders.map((o) => (
          <article key={o.id} className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <div className="font-semibold">{o.id}</div>
                <div className="text-xs text-neutral-500">{new Date(o.placedAt).toLocaleString()}</div>
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

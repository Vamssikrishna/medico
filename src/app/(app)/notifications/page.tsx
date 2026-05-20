"use client";

import { useEffect, useState } from "react";

const seedItems = [
  { title: "Order update", body: "A customer order status changed", time: "Recent", tone: "emerald" },
  { title: "Refill reminder", body: "A saved medicine course is nearing refill", time: "Recent", tone: "amber" },
];

const liveEvents = [
  "Partner pharmacy inventory re-synced",
  "Rider density improved in your zone",
  "Prescription review queue cleared",
  "Cold-chain capacity available nearby",
];

export default function NotificationsPage() {
  const [items, setItems] = useState(seedItems);

  useEffect(() => {
    const id = window.setInterval(() => {
      setItems((current) => {
        const next = liveEvents[current.length % liveEvents.length];
        return [
          { title: "Live ops update", body: next, time: "Just now", tone: "cyan" },
          ...current.slice(0, 5),
        ];
      });
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="mr-chip mb-3">
          <span className="mr-signal-dot" />
          Realtime inbox
        </p>
        <h1 className="text-4xl font-black tracking-tight text-neutral-950">Notifications</h1>
        <p className="mt-2 text-sm font-medium text-neutral-600">Push, SMS critical, and invoice email routing simulated in-browser.</p>
      </div>
      <div className="space-y-3">
        {items.map((n) => (
          <article key={`${n.title}-${n.body}-${n.time}`} className="rounded-3xl border border-emerald-950/10 bg-white/88 p-4 shadow-[0_18px_60px_-46px_rgb(6_46_34/0.75)] backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-wide text-neutral-500">{n.time}</div>
                <div className="font-black text-neutral-950">{n.title}</div>
                <p className="text-sm font-medium text-neutral-600">{n.body}</p>
              </div>
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#dfff1a] shadow-[0_0_18px_rgba(223,255,26,0.8)]" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

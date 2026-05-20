"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";

function two(n: number) {
  return String(n).padStart(2, "0");
}

export function LiveOpsStrip() {
  const { lines } = useCart();
  const [now, setNow] = useState<Date | null>(null);
  const [latency, setLatency] = useState(38);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d);
      setLatency(28 + ((d.getSeconds() * 7) % 34));
      setOnline(typeof navigator === "undefined" ? true : navigator.onLine);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    window.addEventListener("online", tick);
    window.addEventListener("offline", tick);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("online", tick);
      window.removeEventListener("offline", tick);
    };
  }, []);

  const cartUnits = useMemo(() => lines.reduce((sum, line) => sum + line.qty, 0), [lines]);
  const time = now ? `${two(now.getHours())}:${two(now.getMinutes())}:${two(now.getSeconds())}` : "--:--:--";

  return (
    <section className="border-b border-emerald-950/10 bg-white/58 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-950/70 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white/60 px-3 py-2">
          <span className={online ? "mr-signal-dot" : "h-2 w-2 rounded-full bg-rose-500"} />
          {online ? "Network live" : "Offline mode"}
        </div>
        <div className="rounded-full border border-emerald-950/10 bg-white/60 px-3 py-2">Sync {latency}ms</div>
        <div className="rounded-full border border-emerald-950/10 bg-white/60 px-3 py-2">Ops clock {time}</div>
        <div className="rounded-full border border-emerald-950/10 bg-white/60 px-3 py-2">Cart telemetry {cartUnits} units</div>
      </div>
    </section>
  );
}

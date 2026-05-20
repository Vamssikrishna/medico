"use client";

import { useEffect, useState } from "react";

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export default function TelemedicinePage() {
  const [session, setSession] = useState<"idle" | "waiting" | "live">("idle");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (session === "idle") return undefined;
    const id = window.setInterval(() => {
      setSeconds((s) => s + 1);
      setSession((current) => (current === "waiting" && seconds > 4 ? "live" : current));
    }, 1000);
    return () => window.clearInterval(id);
  }, [seconds, session]);

  return (
    <div className="mr-glow-card space-y-6 rounded-[2rem] p-8">
      <p className="mr-chip">
        <span className="mr-signal-dot" />
        WebRTC ready
      </p>
      <h1 className="text-4xl font-black tracking-tight text-sky-950">Telemedicine studio</h1>
      <p className="max-w-2xl text-sm font-semibold text-sky-900/90">
        Secure video/audio room simulation, e-prescription signing, consent checks, and instant cart handoff.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {["Video triage", "e-Rx signing", "Cart handoff"].map((item) => (
          <div key={item} className="rounded-2xl border border-sky-200/70 bg-sky-50/80 px-4 py-3 text-sm font-black text-sky-950">
            {item}
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="relative min-h-72 overflow-hidden rounded-3xl bg-neutral-950 p-5 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(14,165,233,0.35),transparent_32%),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px]" />
          <div className="relative flex h-full min-h-60 flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-cyan-200">
                {session === "idle" ? "Studio idle" : session === "waiting" ? "Doctor joining" : "Consult live"}
              </span>
              <span className="font-mono text-sm text-cyan-200">{formatDuration(seconds)}</span>
            </div>
            <div>
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-cyan-200/40 bg-cyan-300/10 text-3xl font-black text-cyan-100">
                DR
              </div>
              <p className="mt-4 text-center text-sm font-semibold text-cyan-100/80">
                {session === "idle" ? "Start a simulated secure room." : session === "waiting" ? "Matching with available clinician." : "Dr. Asha is reviewing symptoms."}
              </p>
            </div>
          </div>
        </div>
        <aside className="space-y-3 rounded-3xl border border-sky-200/70 bg-white/75 p-4">
          {["Consent captured", "Vitals optional", "e-Rx queue ready", "Pharmacy handoff ready"].map((item) => (
            <div key={item} className="flex items-center justify-between rounded-2xl bg-sky-50 px-3 py-2 text-sm font-bold text-sky-950">
              {item}
              <span className="h-2 w-2 rounded-full bg-sky-500" />
            </div>
          ))}
        </aside>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-full bg-sky-700 px-6 py-3 text-sm font-black text-white"
          onClick={() => {
            setSeconds(0);
            setSession("waiting");
          }}
        >
          Start secure consult
        </button>
        <button
          type="button"
          className="rounded-full border border-sky-200 bg-white px-6 py-3 text-sm font-black text-sky-950"
          onClick={() => {
            setSession("idle");
            setSeconds(0);
          }}
        >
          End session
        </button>
      </div>
    </div>
  );
}

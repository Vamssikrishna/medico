"use client";

import { useEffect, useRef, useState } from "react";

export default function PillScannerPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [scan, setScan] = useState(0);
  const [message, setMessage] = useState("Camera is ready for imprint and shape matching.");

  useEffect(() => {
    if (!active) return undefined;
    let cancelled = false;
    void navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {
        setActive(false);
        setMessage("Camera permission is unavailable. You can still use image upload in a production integration.");
      });

    const progress = window.setInterval(() => {
      setScan((value) => (value >= 96 ? 72 : value + 4));
    }, 420);

    return () => {
      cancelled = true;
      window.clearInterval(progress);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [active]);

  return (
    <div className="mr-glow-card space-y-6 rounded-[2rem] p-8">
      <p className="mr-chip">
        <span className="mr-signal-dot" />
        Live vision model
      </p>
      <h1 className="text-4xl font-black tracking-tight text-neutral-950">Pill scanner</h1>
      <p className="max-w-2xl font-medium text-neutral-600">
        Live camera preview with simulated imprint, color, shape, and knowledge-graph matching for pill identification.
      </p>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative aspect-video overflow-hidden rounded-3xl bg-neutral-950">
          {active ? (
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,rgba(94,234,212,0.2),transparent_36%),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:auto,26px_26px,26px_26px] text-sm font-black uppercase tracking-[0.18em] text-cyan-100">
              Camera preview
            </div>
          )}
          <div className="absolute inset-x-8 top-1/2 h-px bg-[#dfff1a] shadow-[0_0_24px_rgba(223,255,26,0.9)]" />
          <div className="absolute bottom-4 left-4 rounded-full bg-neutral-950/80 px-3 py-1 text-xs font-black text-[#dfff1a] backdrop-blur">
            Scan confidence {scan}%
          </div>
        </div>
        <aside className="space-y-3 rounded-3xl border border-emerald-950/10 bg-white/75 p-4">
          {["Imprint detection", "Color histogram", "Shape classifier", "Drug graph match"].map((item, index) => (
            <div key={item} className="rounded-2xl bg-emerald-50 px-4 py-3">
              <div className="flex justify-between text-xs font-black uppercase tracking-wide text-emerald-950/70">
                <span>{item}</span>
                <span>{Math.min(99, scan + index * 3)}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-emerald-950/10">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-[#dfff1a]" style={{ width: `${Math.min(99, scan + index * 3)}%` }} />
              </div>
            </div>
          ))}
          <p className="text-xs font-semibold text-neutral-600">{message}</p>
        </aside>
      </div>
      <button
        type="button"
        className="rounded-full bg-emerald-950 px-5 py-2.5 text-sm font-black text-white"
        onClick={() => {
          setScan(34);
          setActive((value) => !value);
          setMessage(active ? "Scanner paused." : "Live camera stream requested. Align the pill inside the scan band.");
        }}
      >
        {active ? "Pause scanner" : "Start live scanner"}
      </button>
    </div>
  );
}

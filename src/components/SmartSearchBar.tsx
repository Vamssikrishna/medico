"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SpeechRecognitionAlternative } from "@/components/voice-types";
import { useInventory } from "@/context/InventoryContext";
import { suggestMedicines } from "@/lib/search-engine";

type Props = {
  variant?: "hero" | "compact";
  placeholder?: string;
};

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionInstanceEvent) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
}

interface SpeechRecognitionInstanceEvent extends Event {
  readonly results: SpeechRecognitionInstanceResultList;
}

interface SpeechRecognitionInstanceResultList {
  readonly length: number;
  readonly [index: number]: SpeechRecognitionInstanceResultRow;
}

interface SpeechRecognitionInstanceResultRow {
  readonly [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionInstanceConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionInstanceConstructor;
    webkitSpeechRecognition?: SpeechRecognitionInstanceConstructor;
  }
}

export function SmartSearchBar({ variant = "hero", placeholder }: Props) {
  const router = useRouter();
  const { medicines } = useInventory();
  const [q, setQ] = useState("");
  const [listening, setListening] = useState(false);

  const suggestions = useMemo(() => suggestMedicines(medicines, q, 5), [medicines, q]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      router.push(`/search?q=${encodeURIComponent(q.trim()) || "paracetamol"}`);
    },
    [q, router],
  );

  useEffect(() => {
    if (!listening) return undefined;
    if (typeof window === "undefined") return undefined;
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) {
      queueMicrotask(() => setListening(false));
      return undefined;
    }
    const recognition = new Ctor();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onresult = (event: SpeechRecognitionInstanceEvent) => {
      const alt = event.results[0]?.[0];
      setQ((alt?.transcript ?? "").trim());
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
    return () => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
    };
  }, [listening]);

  const base =
    variant === "hero"
      ? "mr-glow-card rounded-[1.35rem] border-emerald-950/20 shadow-[0_28px_90px_-42px_rgb(6_46_34/0.9)] ring-4 ring-[#dfff1a]/25"
      : "rounded-2xl border border-emerald-950/10 bg-white/88 shadow-[0_16px_46px_-30px_rgb(6_46_34/0.45)] backdrop-blur";

  const ph =
    placeholder ?? 'Try "Paracitamol", "fever strip", barcode, or salts…';

  return (
    <form onSubmit={onSubmit} className={`relative w-full ${base}`}>
      {variant === "hero" && (
        <div className="flex flex-wrap items-center gap-2 border-b border-emerald-950/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-950/60">
          <span className="mr-signal-dot" aria-hidden />
          AI ranked search · salt match · voice ready
        </div>
      )}
      <div className="flex flex-col gap-2 p-2 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white/45 px-3">
          <svg className="h-5 w-5 shrink-0 text-emerald-700 drop-shadow-sm" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="m16.5 16.5 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 border-none bg-transparent py-3 text-sm font-semibold text-neutral-900 outline-none placeholder:font-medium placeholder:text-neutral-400"
            placeholder={ph}
            aria-label="Search medicines"
          />
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          <button
            type="button"
            onClick={() => setListening(true)}
            className={`rounded-xl border px-3 py-2 text-xs font-black transition ${
              listening
                ? "border-[#dfff1a] bg-emerald-950 text-[#dfff1a] shadow-[0_0_24px_rgba(223,255,26,0.24)]"
                : "border-emerald-950/10 bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100"
            }`}
          >
            {listening ? "Listening…" : "Voice"}
          </button>
          <button
            type="button"
            onClick={() => {
              const code = window.prompt("Barcode / SKU", "");
              if (code) setQ(code);
            }}
            className="rounded-xl border border-emerald-950/10 bg-white/80 px-3 py-2 text-xs font-black text-emerald-900 hover:bg-white"
          >
            Scan
          </button>
          <button
            type="submit"
            className="rounded-xl border border-emerald-950 bg-[#dfff1a] px-6 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-950 shadow-[0_14px_30px_-18px_rgb(6_46_34/0.9)] hover:bg-[#e8ff50]"
          >
            Search
          </button>
        </div>
      </div>
      {q.length >= 2 && (
        <ul className="absolute left-0 right-0 top-full z-20 mt-2 max-h-72 overflow-auto rounded-2xl border border-emerald-950/10 bg-white/95 p-2 text-sm shadow-[0_26px_80px_-42px_rgb(6_46_34/0.9)] backdrop-blur">
          {suggestions.map((m, index) => (
            <li key={m.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-emerald-50"
                onClick={() => router.push(`/medicine/${m.slug}`)}
              >
                <span className="min-w-0">
                  <span className="block font-bold text-neutral-900">{m.brand}</span>
                  <span className="block truncate text-xs text-neutral-500">{m.genericSalts.join(" · ")}</span>
                </span>
                <span className="shrink-0 rounded-full bg-emerald-950 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#dfff1a]">
                  Match {95 - index * 6}%
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

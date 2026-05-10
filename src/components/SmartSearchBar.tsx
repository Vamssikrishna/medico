"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SpeechRecognitionAlternative } from "@/components/voice-types";
import { suggestMedicines } from "@/lib/search-engine";
import { medicines } from "@/lib/mock/medicines";

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
  const [q, setQ] = useState("");
  const [listening, setListening] = useState(false);

  const suggestions = useMemo(() => suggestMedicines(medicines, q, 5), [q]);

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
      ? "rounded-2xl border-2 border-emerald-950/80 bg-white shadow-[0_12px_40px_-10px_rgb(6_46_34/0.35)] ring-4 ring-[#dfff1a]/40"
      : "rounded-xl border border-neutral-200/90 bg-white shadow-sm";

  const ph =
    placeholder ?? 'Try "Paracitamol", "fever strip", barcode, or salts…';

  return (
    <form onSubmit={onSubmit} className={`relative w-full ${base}`}>
      <div className="flex flex-col gap-2 p-2 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-3 px-3">
          <svg className="h-5 w-5 shrink-0 text-emerald-700" viewBox="0 0 24 24" fill="none" aria-hidden>
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
            className="flex-1 border-none bg-transparent py-2 text-sm outline-none placeholder:text-neutral-400"
            placeholder={ph}
            aria-label="Search medicines"
          />
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          <button
            type="button"
            onClick={() => setListening(true)}
            className="rounded-xl border-2 border-emerald-950/10 bg-emerald-50/50 px-3 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100"
          >
            {listening ? "Listening…" : "Voice"}
          </button>
          <button
            type="button"
            onClick={() => {
              const code = window.prompt("Barcode / SKU", "");
              if (code) setQ(code);
            }}
            className="rounded-xl border-2 border-emerald-950/10 bg-white px-3 py-2 text-xs font-bold text-emerald-900 hover:bg-neutral-50"
          >
            Scan
          </button>
          <button
            type="submit"
            className="rounded-xl border-2 border-emerald-950 bg-[#dfff1a] px-6 py-2 text-xs font-black uppercase tracking-wide text-emerald-950 shadow-md hover:bg-[#e8ff50]"
          >
            Search
          </button>
        </div>
      </div>
      {q.length >= 2 && (
        <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded-xl border border-neutral-200 bg-white p-2 text-sm shadow-xl">
          {suggestions.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-emerald-50"
                onClick={() => router.push(`/medicine/${m.slug}`)}
              >
                <span className="font-medium text-neutral-900">{m.brand}</span>
                <span className="text-xs text-neutral-500">{m.genericSalts.join(" · ")}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function GuestPage() {
  const router = useRouter();
  const { enterGuest } = useAuth();
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");

  function start() {
    setError("");
    const c = contact.trim();
    if (c.length < 5) {
      setError("Enter a reachable phone number or email for delivery coordination.");
      return;
    }
    enterGuest();
    router.push("/checkout");
    router.refresh();
  }

  return (
    <div className="mr-glow-card w-full max-w-md rounded-[2rem] p-8">
      <p className="mr-chip mb-4">
        <span className="mr-signal-dot" />
        Urgent lane
      </p>
      <h1 className="text-2xl font-black tracking-tight text-neutral-950">Guest access</h1>
      <p className="mt-2 text-sm font-medium leading-relaxed text-neutral-600">
        Limited session for urgent orders. Prescription items may require identity verification at checkout. Data is
        retained only for operational demo purposes.
      </p>
      <label className="mt-6 block text-xs font-medium uppercase tracking-wide text-neutral-500">
        Contact for delivery updates
      </label>
      <input
        className="mt-1.5 w-full rounded-xl border border-emerald-950/10 bg-white/85 px-3 py-2.5 text-sm font-semibold outline-none ring-emerald-800/15 focus:border-emerald-800 focus:ring-2"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="+91 … or name@organization.com"
        autoComplete="tel email"
      />
      {error && <p className="mt-2 text-xs text-rose-700">{error}</p>}
      <button
        type="button"
        onClick={start}
        className="mt-6 w-full rounded-xl bg-emerald-950 py-2.5 text-sm font-black text-white shadow-[0_18px_42px_-28px_rgb(6_46_34/0.95)] hover:bg-emerald-900"
      >
        Continue
      </button>
      <p className="mt-6 text-center text-xs text-neutral-500">
        Prefer a full account?{" "}
        <Link href="/auth/login" className="font-semibold text-emerald-800 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

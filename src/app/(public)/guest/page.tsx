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
    <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg shadow-neutral-900/5">
      <h1 className="text-xl font-semibold text-neutral-900">Guest access</h1>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        Limited session for urgent orders. Prescription items may require identity verification at checkout. Data is
        retained only for operational demo purposes.
      </p>
      <label className="mt-6 block text-xs font-medium uppercase tracking-wide text-neutral-500">
        Contact for delivery updates
      </label>
      <input
        className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none ring-emerald-800/15 focus:border-emerald-800 focus:ring-2"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="+91 … or name@organization.com"
        autoComplete="tel email"
      />
      {error && <p className="mt-2 text-xs text-rose-700">{error}</p>}
      <button
        type="button"
        onClick={start}
        className="mt-6 w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
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

"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    PublicKeyCredential?: typeof PublicKeyCredential;
  }
}

async function webAuthnSupported() {
  if (typeof window === "undefined") return false;
  return Boolean(window.PublicKeyCredential);
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") && params.get("next")!.startsWith("/") ? params.get("next")! : "/";

  const { user, loginWithEmailOtp, loginWithProvider, biometricEnabled, setBiometricEnabled } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [hint, setHint] = useState("");
  const [busy, setBusy] = useState(false);
  const [webAuthn, setWebAuthn] = useState(false);

  useEffect(() => {
    void webAuthnSupported().then(setWebAuthn);
  }, []);

  useEffect(() => {
    if (user) {
      router.replace(next);
      router.refresh();
    }
  }, [user, router, next]);

  async function sendOtp() {
    setHint("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.ok) {
        setHint(data.error ?? "Unable to send verification code.");
        return;
      }
      setStep("otp");
      setHint("A verification code was sent to your email.");
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    setHint("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!data.ok) {
        setHint(data.error ?? "Verification failed.");
        return;
      }
      loginWithEmailOtp(email, name || email.split("@")[0]);
      router.replace(next);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function socialDemo(provider: "google" | "apple") {
    const profile =
      provider === "google"
        ? { name: "Jordan Smith", email: "jordan.smith@example.com" }
        : { name: "Alex Chen", email: "alex.chen@example.com" };
    loginWithProvider(provider, profile);
    router.replace(next);
    router.refresh();
  }

  const inputCls =
    "w-full rounded-xl border border-emerald-950/10 bg-white/80 px-3 py-2.5 text-sm font-semibold outline-none ring-emerald-800/15 transition focus:border-emerald-800 focus:ring-2";

  return (
    <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white/88 shadow-[0_34px_100px_-48px_rgb(6_46_34/0.85)] backdrop-blur md:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 p-10 text-white md:flex">
        <div className="pointer-events-none absolute -right-20 top-16 h-64 w-64 rounded-full bg-[#dfff1a]/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-52 w-52 rounded-full bg-lime-400/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:30px_30px] opacity-35" />
        <div className="relative">
          <p className="mr-chip mr-chip-on-dark">
            <span className="mr-signal-dot" />
            Secure session
          </p>
          <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-[-0.04em]">
            Your quick-commerce pharmacy command center.
          </h1>
          <p className="mt-4 text-sm font-medium leading-relaxed text-emerald-100/90">
            OTP sign-in unlocks catalogue, OCR prescriptions, carts, checkout, riders — same energy as Blinkit / Instamart,
            built for meds.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#dfff1a]/30 bg-black/15 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-[#dfff1a]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#dfff1a] opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#dfff1a]" />
            </span>
            Minutes, not hours
          </div>
        </div>
        <ul className="relative space-y-4 border-t border-white/10 pt-8 text-sm font-semibold text-emerald-100/85">
          <li className="flex gap-3">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            AES-256 at rest for PHI (configure with your cloud KMS).
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            Audit-ready order and prescription trails.
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            Regional compliance workflows (India D&amp;C Act aware UX).
          </li>
        </ul>
      </aside>

      <div className="p-8 sm:p-10">
        <div className="mb-8 md:hidden">
          <h1 className="text-2xl font-semibold text-neutral-900">Sign in</h1>
          <p className="mt-1 text-sm text-neutral-600">Email verification and federated options.</p>
        </div>

        <div className="hidden md:block">
          <p className="mr-chip mb-3">Passwordless access</p>
          <h2 className="text-2xl font-black tracking-tight text-neutral-950">Account access</h2>
          <p className="mt-1 text-sm text-neutral-600">Use your work email. Passwordless OTP.</p>
        </div>

        <div className="mt-8 space-y-5">
          {step === "email" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Full name</label>
                <input className={`${inputCls} mt-1.5`} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Work email</label>
                <input
                  type="email"
                  autoComplete="email"
                  className={`${inputCls} mt-1.5`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="button"
                disabled={busy || !email.trim()}
                onClick={sendOtp}
                className="w-full rounded-xl border border-emerald-950 bg-[#dfff1a] py-2.5 text-sm font-black text-emerald-950 shadow-[0_18px_38px_-24px_rgb(6_46_34/0.95)] hover:bg-[#e8ff50] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Sending…" : "Send verification code"}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">6-digit code</label>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`${inputCls} mt-1.5 font-mono tracking-[0.3em]`}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                />
              </div>
              <button
                type="button"
                disabled={busy || code.length !== 6}
                onClick={verify}
              className="w-full rounded-xl bg-emerald-950 py-2.5 text-sm font-black text-white shadow-[0_18px_38px_-24px_rgb(6_46_34/0.95)] hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Verifying…" : "Verify & continue"}
              </button>
              <button type="button" className="text-xs font-medium text-emerald-800 hover:underline" onClick={() => setStep("email")}>
                Use a different email
              </button>
            </div>
          )}

          {hint && <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">{hint}</p>}

          <div className="border-t border-neutral-100 pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Federated (demo)</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => socialDemo("google")}
                className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50"
              >
                Google
              </button>
              <button
                type="button"
                onClick={() => socialDemo("apple")}
                className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50"
              >
                Apple
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-700">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={biometricEnabled}
              onChange={(e) => setBiometricEnabled(e.target.checked)}
              disabled={!webAuthn}
            />
            <span>
              Prefer WebAuthn device unlock after sign-in
              {!webAuthn ? <span className="block text-xs text-neutral-500">Unavailable in this browser.</span> : null}
            </span>
          </label>

          <p className="text-center text-xs text-neutral-500">
            Urgent fulfilment without an account?{" "}
            <Link href="/guest" className="font-semibold text-emerald-800 hover:underline">
              Guest lane
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-32 w-full max-w-lg items-center justify-center rounded-2xl border border-neutral-200 bg-white text-sm text-neutral-500">
          Loading…
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}

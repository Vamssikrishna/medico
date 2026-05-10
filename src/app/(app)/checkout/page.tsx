"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { getMedicineById } from "@/lib/mock/medicines";
import { pharmacies } from "@/lib/mock/pharmacies";
import { cartSubtotal, validateCart } from "@/lib/cart-validation";
import type { Order } from "@/lib/types";

const methods = [
  "UPI / QR",
  "Credit card",
  "Debit card",
  "Wallet",
  "Cash on delivery",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear } = useCart();
  const { user, guestMode, loginWithEmailOtp } = useAuth();
  const { profile, addDemoOrder } = useProfile();
  const [priority, setPriority] = useState(false);
  const [method, setMethod] = useState(methods[0]);
  const [emailGate, setEmailGate] = useState("");
  const [otpGate, setOtpGate] = useState("");
  const [otpHint, setOtpHint] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [deliveryOtp, setDeliveryOtp] = useState("");

  const total = cartSubtotal(lines);
  const issues = validateCart(lines);

  const orderPreview = useMemo(
    () =>
      lines
        .map((l) => {
          const m = getMedicineById(l.medicineId);
          if (!m) return null;
          return {
            medicineId: l.medicineId,
            name: m.brand,
            qty: l.qty,
            price: m.discountedPrice ?? m.mrp,
          };
        })
        .filter((row): row is NonNullable<typeof row> => row !== null),
    [lines],
  );

  async function verifyGuestOtp() {
    setOtpHint("");
    if (otpGate.trim().length < 6) {
      setOtpHint("Enter the 6-digit code.");
      return;
    }
    const email = emailGate.trim().toLowerCase();
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setOtpHint("Enter a valid email before verifying.");
        return;
      }
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpGate.trim() }),
      });
      const data = await res.json();
      if (!data.ok) {
        setOtpHint(data.error ?? "Incorrect or expired code.");
        return;
      }
      loginWithEmailOtp(email, email.split("@")[0]);
    }
    setOtpVerified(true);
    setDeliveryOtp(String(Math.floor(100000 + Math.random() * 900000)));
  }

  async function sendEmailDemo() {
    setOtpHint("");
    const email = emailGate.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setOtpHint("Enter a valid email.");
      return;
    }
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.ok) {
        setOtpHint(data.error ?? "Could not send code.");
        return;
      }
      if (data.demoOtp) setOtpHint(`Code (demo): ${data.demoOtp}`);
      else setOtpHint("Check your inbox for the code.");
    } catch {
      setOtpHint("Unable to reach verification service.");
    }
  }

  function placeOrder() {
    if (orderPreview.length === 0 || orderPreview.length !== lines.length) return;
    const pharmacyName = pharmacies[0]?.name ?? "Partner pharmacy";
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const delOtp =
      deliveryOtp || String(Math.floor(100000 + Math.random() * 900000));
    setDeliveryOtp(delOtp);
    const eta = priority ? 12 : pharmacies[0]?.etaMin ?? 18;
    const order: Order = {
      id: orderId,
      placedAt: new Date().toISOString(),
      status: "out_for_delivery",
      etaMin: eta,
      deliveryOtp: delOtp,
      items: orderPreview,
      pharmacyName,
      riderName: "Ritu · MediRush partner",
      batchId: "B-" + Math.random().toString(36).slice(2, 6).toUpperCase(),
    };
    addDemoOrder(order);
    clear();
    router.push(`/orders?id=${encodeURIComponent(orderId)}`);
  }

  const authenticated = Boolean(user || guestMode || otpVerified);
  const rxBlocked = issues.some((i) => i.type === "rx_required") && !priority;
  const canPay = lines.length > 0 && authenticated && !rxBlocked;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Checkout</h1>
        <p className="text-sm text-neutral-600">Inventory soft-hold · payments · OTP handoff demo.</p>
      </div>

      {issues.some((x) => x.type === "rx_required") && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-900">
          Pending prescriptions flagged.{" "}
          <Link className="font-semibold underline" href="/prescriptions">
            Upload or attach e-Rx
          </Link>{" "}
          before dispatch. Emergency priority can override for demo.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Identity & session</h2>
          {user ? (
            <p className="text-sm text-neutral-700">
              Signed in as <span className="font-semibold">{user.email}</span>
            </p>
          ) : guestMode ? (
            <p className="text-sm text-amber-900">
              Guest lane active — confirm contact via email OTP for delivery updates.
            </p>
          ) : (
            <p className="text-sm text-neutral-600">
              Use <Link href="/auth/login" className="font-semibold text-emerald-700">sign in</Link> or{" "}
              <Link href="/guest" className="font-semibold text-emerald-700">guest mode</Link>.
            </p>
          )}
          {!user && (
            <div className="space-y-2 rounded-2xl border border-dashed border-neutral-200 p-4">
              <label className="text-xs font-semibold uppercase text-neutral-500">Email</label>
              <input
                value={emailGate}
                onChange={(e) => setEmailGate(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm"
                placeholder="you@email.com"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={sendEmailDemo}
                  className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"
                >
                  Send demo OTP
                </button>
                <input
                  value={otpGate}
                  onChange={(e) => setOtpGate(e.target.value)}
                  className="w-32 rounded-full border px-3 py-2 text-xs"
                  placeholder="OTP"
                />
                <button
                  type="button"
                  onClick={verifyGuestOtp}
                  className="rounded-full border px-4 py-2 text-xs font-semibold"
                >
                  Verify
                </button>
              </div>
              {otpHint && <p className="text-xs text-emerald-800">{otpHint}</p>}
            </div>
          )}
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={priority} onChange={(e) => setPriority(e.target.checked)} />
            Emergency priority lane (fastest rider + routing)
          </label>
        </section>

        <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Delivery</h2>
          <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
            {profile.addresses.find((a) => a.isDefault)?.line1}
            <div className="mt-1 text-xs text-neutral-500">
              {profile.addresses.find((a) => a.isDefault)?.city} ·{" "}
              {profile.addresses.find((a) => a.isDefault)?.pin}
            </div>
          </div>
          <p className="text-xs text-neutral-500">
            Dynamic ETA engine factors traffic, weather APIs, rider density — mocked at {pharmacies[0]?.etaMin ?? 18}{" "}
            min baseline.
          </p>
        </section>
      </div>

      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Payment</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {methods.map((m) => (
            <label
              key={m}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
                method === m ? "border-emerald-500 bg-emerald-50" : "border-neutral-200"
              }`}
            >
              <input type="radio" name="pay" checked={method === m} onChange={() => setMethod(m)} />
              {m}
            </label>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
          <div>
            <div className="text-sm text-neutral-500">Amount payable</div>
            <div className="text-3xl font-bold text-emerald-800">₹{total}</div>
          </div>
          <button
            type="button"
            disabled={!canPay}
            onClick={placeOrder}
            className={`rounded-full px-8 py-3 text-sm font-semibold text-white ${
              canPay ? "bg-neutral-900 hover:bg-neutral-800" : "bg-neutral-300"
            }`}
          >
            Pay & place order
          </button>
        </div>
        {!canPay && (
          <p className="mt-2 text-xs text-rose-600">
            Resolve validation issues or enable emergency override to continue.
          </p>
        )}
      </section>

      {deliveryOtp && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
          Delivery OTP generated: <span className="font-mono text-lg font-bold">{deliveryOtp}</span> — share with rider
          at handoff.
        </div>
      )}
    </div>
  );
}

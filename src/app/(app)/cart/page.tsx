"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useInventory } from "@/context/InventoryContext";
import { validateCart, cartSubtotal } from "@/lib/cart-validation";

export default function CartPage() {
  const { lines, setQty, remove, clear } = useCart();
  const { medicines, getMedicineById } = useInventory();
  const issues = validateCart(lines, medicines);
  const total = cartSubtotal(lines, medicines);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mr-chip mb-3">
            <span className="mr-signal-dot" />
            Validation engine
          </p>
          <h1 className="text-4xl font-black tracking-tight text-neutral-950">Cart</h1>
          <p className="text-sm font-medium text-neutral-600">Smart validation + prescription checks (demo).</p>
        </div>
        <div className="flex gap-3">
          {lines.length > 0 && (
            <button
              type="button"
              onClick={() => clear()}
              className="rounded-full border border-emerald-950/10 bg-white/70 px-4 py-2 text-sm font-bold hover:bg-white"
            >
              Clear
            </button>
          )}
          <Link
            href="/checkout"
            className={`rounded-full px-6 py-2 text-sm font-black ${
              lines.length === 0
                ? "pointer-events-none bg-neutral-300 text-white"
                : "bg-[#dfff1a] text-emerald-950 shadow-[0_16px_36px_-26px_rgb(6_46_34/0.95)] hover:bg-[#e8ff50]"
            }`}
          >
            Checkout
          </Link>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="space-y-3 rounded-3xl border border-amber-300 bg-amber-50/90 p-4 shadow-[0_18px_55px_-38px_rgb(180_83_9/0.6)]">
          <h2 className="font-semibold text-amber-950">Safety checks</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-amber-900">
            {issues.map((issue) => (
              <li key={issue.message}>{issue.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        <section className="space-y-3">
          {lines.length === 0 && (
            <p className="rounded-3xl border border-dashed bg-white px-8 py-12 text-neutral-600">
              Cart is empty.{" "}
              <Link href="/partner/pharmacy" className="font-semibold text-emerald-700">
                Upload pharmacy inventory
              </Link>
            </p>
          )}
          {lines.map((line) => {
            const m = getMedicineById(line.medicineId);
            if (!m) return null;
            const price = m.discountedPrice ?? m.mrp;
            return (
              <article
                key={line.medicineId}
              className="flex gap-4 rounded-3xl border border-emerald-950/10 bg-white/88 p-4 shadow-[0_18px_60px_-44px_rgb(6_46_34/0.75)] backdrop-blur"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={`https://picsum.photos/seed/${m.slug}/200`}
                    alt={m.brand}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex flex-wrap justify-between gap-2">
                    <Link href={`/medicine/${m.slug}`} className="font-semibold hover:text-emerald-700">
                      {m.brand}
                    </Link>
                    <button type="button" className="text-xs text-rose-600" onClick={() => remove(line.medicineId)}>
                      Remove
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-neutral-500">Qty</span>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full border border-emerald-950/10 bg-white font-bold hover:bg-emerald-50"
                      onClick={() => setQty(line.medicineId, Math.max(0, line.qty - 1))}
                    >
                      −
                    </button>
                    <span className="font-mono">{line.qty}</span>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full border border-emerald-950/10 bg-white font-bold hover:bg-emerald-50"
                      onClick={() => setQty(line.medicineId, line.qty + 1)}
                    >
                      +
                    </button>
                    <span className="font-semibold">₹{price * line.qty}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
        <aside className="mr-glow-card h-fit rounded-3xl p-5">
          <h2 className="text-lg font-black text-emerald-950">Order summary</h2>
          <dl className="mt-4 space-y-3 text-sm text-emerald-900">
            <div className="flex justify-between">
              <dt>To pay</dt>
              <dd className="font-semibold">₹{total}</dd>
            </div>
            <div className="flex justify-between text-xs opacity-75">
              <dt>Estimated delivery fee</dt>
              <dd>Free above ₹399</dd>
            </div>
            <div className="flex justify-between text-xs opacity-75">
              <dt>Realtime inventory</dt>
              <dd>Held from uploaded stock</dd>
            </div>
          </dl>
          <ul className="mt-6 space-y-2 text-xs font-semibold text-emerald-800/85">
            <li>Batch-ready routing for neighbouring orders · Multi-order batching (8.5)</li>
            <li>Delivery OTP at doorstep · Fraud checks queued</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

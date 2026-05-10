import Link from "next/link";

export default function PaymentsPage() {
  return (
    <div className="space-y-4 rounded-3xl border bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Payments rails</h1>
      <p className="text-neutral-600">UPI, cards, wallets, COD orchestration hooks (Razorpay / Stripe placeholders).</p>
      <Link href="/checkout" className="text-emerald-700 font-semibold">
        Go to checkout
      </Link>
    </div>
  );
}

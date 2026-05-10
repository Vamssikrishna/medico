export default function AdminPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-neutral-900">Control tower</h1>
        <p className="text-sm text-neutral-600">Users · pharmacies · orders · analytics — demo shell.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl border border-rose-100 bg-rose-50 p-6">
          <h2 className="text-lg font-semibold text-rose-950">Risk queue</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-rose-900">
            <li>Prescription mismatch · Order #44921</li>
            <li>Velocity fraud · User hash 0x8af…</li>
          </ul>
        </section>
        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">City performance</h2>
          <div className="mt-3 font-mono text-xs text-neutral-600">
            BLR · p95 delivery 24m · Rx approval 3.1m · stockouts 0.6%
          </div>
        </section>
      </div>
    </div>
  );
}

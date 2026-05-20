export default function RiderPartnerPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-neutral-900">Rider cockpit</h1>
        <p className="text-sm text-neutral-600">
          Aadhaar / RC verification · AI dispatch · navigation · earnings (shell for mobile web / PWA).
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border bg-gradient-to-br from-emerald-700 to-lime-500 p-6 text-white shadow-lg">
          <div className="text-sm opacity-80">Next assignment</div>
          <div className="mt-2 text-2xl font-bold">No assigned batch</div>
          <div className="mt-2 text-sm">Assignments appear after real orders are created</div>
        </div>
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Live traffic + reroute powered by your maps provider. Demo shows static tiles.
          </p>
        </div>
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Earnings</h2>
          <div className="mt-3 text-3xl font-bold text-emerald-800">₹0</div>
          <p className="text-xs text-neutral-500">Earnings appear from real completed deliveries</p>
        </div>
      </div>
    </div>
  );
}

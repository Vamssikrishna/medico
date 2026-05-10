export default function PharmacyPartnerPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-neutral-900">Pharmacy partner OS</h1>
        <p className="text-sm text-neutral-600">
          License ingestion · barcode inventory · order board · audits (UI shell · connect POS APIs).
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Open orders", value: "37" },
          { title: "Pending Rx", value: "6" },
          { title: "Low stock alerts", value: "12" },
          { title: "Revenue · today", value: "₹1.8L" },
        ].map((k) => (
          <div key={k.title} className="rounded-3xl border bg-white p-4 shadow-sm">
            <div className="text-xs uppercase text-neutral-500">{k.title}</div>
            <div className="text-2xl font-bold text-emerald-800">{k.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Live order stream</h2>
        <div className="mt-4 space-y-2 font-mono text-xs text-neutral-600">
          <div>08:14 · batch B-4F2A · 3 stops · cold-chain tag</div>
          <div>08:16 · Rx approval queue · Dr. Kapoor</div>
          <div>08:19 · rider reassignment · traffic delta +4m</div>
        </div>
      </div>
    </div>
  );
}

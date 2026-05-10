export default function MediRushOnePage() {
  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-3xl border bg-gradient-to-b from-neutral-950 to-neutral-900 p-8 text-white">
      <span className="rounded-full bg-lime-300/90 px-3 py-1 text-[11px] font-bold text-neutral-950">MEMBERSHIP</span>
      <h1 className="text-3xl font-bold">MediRush One</h1>
      <p className="text-neutral-300">Zero delivery fees, priority dispatch lane, surprise health credits — Stripe subscription placeholder.</p>
      <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-200">
        <li>Free deliveries above ₹199</li>
        <li>Priority batching in surge</li>
        <li>Quarterly health screening offers</li>
      </ul>
      <button type="button" className="w-full rounded-full bg-lime-300 py-3 text-sm font-bold text-neutral-950" disabled>
        Join waitlist
      </button>
    </div>
  );
}

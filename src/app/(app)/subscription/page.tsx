export default function MediRushOnePage() {
  return (
    <div className="relative mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-neutral-950 to-emerald-950 p-8 text-white shadow-[0_32px_90px_-42px_rgb(6_46_34/0.95)]">
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#dfff1a]/20 blur-3xl" />
      <div className="relative space-y-5">
      <span className="rounded-full bg-lime-300/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-neutral-950">Membership</span>
      <h1 className="text-5xl font-black tracking-tight">MediRush One</h1>
      <p className="font-medium text-neutral-300">Zero delivery fees, priority dispatch lane, surprise health credits, and subscription-ready checkout orchestration.</p>
      <ul className="space-y-2 text-sm font-semibold text-neutral-200">
        <li>Free deliveries above ₹199</li>
        <li>Priority batching in surge</li>
        <li>Quarterly health screening offers</li>
      </ul>
      <button type="button" className="w-full rounded-full bg-lime-300 py-3 text-sm font-black text-neutral-950" disabled>
        Join waitlist
      </button>
      </div>
    </div>
  );
}

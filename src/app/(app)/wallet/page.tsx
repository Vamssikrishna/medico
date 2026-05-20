export default function WalletPage() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 p-8 text-white shadow-[0_32px_90px_-42px_rgb(6_46_34/0.95)]">
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#dfff1a]/24 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:34px_34px] opacity-30" />
      <div className="relative space-y-5">
        <p className="mr-chip mr-chip-on-dark">
          <span className="mr-signal-dot" />
          Ledger preview
        </p>
        <h1 className="text-4xl font-black tracking-tight">MediRush wallet</h1>
        <p className="max-w-xl font-medium text-emerald-100">
          Cashbacks, refunds, loyalty points, and instant settlement balance. Ledger service is not connected in demo.
        </p>
        <div className="text-6xl font-black tracking-tight text-[#dfff1a]">₹240</div>
      </div>
    </div>
  );
}

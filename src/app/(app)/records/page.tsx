export default function RecordsPage() {
  return (
    <div className="mr-glow-card space-y-6 rounded-[2rem] p-8">
      <p className="mr-chip">
        <span className="mr-signal-dot" />
        Encrypted vault
      </p>
      <div>
        <h1 className="text-4xl font-black tracking-tight text-neutral-950">Health record vault</h1>
        <p className="mt-2 max-w-2xl font-medium text-neutral-600">
          Encrypted prescriptions, lab PDFs, bills, and visit summaries with storage-provider ready workflows.
        </p>
      </div>
      <div className="rounded-3xl border-2 border-dashed border-emerald-300/80 bg-white/68 px-6 py-14 text-center text-sm font-black uppercase tracking-[0.16em] text-emerald-800">
        Drag reports to backup (demo)
      </div>
    </div>
  );
}

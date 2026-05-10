export default function RecordsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Health record vault</h1>
      <p className="text-neutral-600">Encrypted prescriptions, lab PDFs, bills — S3/GCS style storage not wired.</p>
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center text-sm text-neutral-500">
        Drag reports to backup (demo)
      </div>
    </div>
  );
}

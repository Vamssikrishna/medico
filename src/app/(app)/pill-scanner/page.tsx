"use client";

export default function PillScannerPage() {
  return (
    <div className="space-y-4 rounded-3xl border bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Pill scanner</h1>
      <p className="text-neutral-600">CV model + knowledge graph hookup — capture not enabled in browser demo.</p>
      <button type="button" className="rounded-full border px-4 py-2 text-sm" onClick={() => alert("Wire camera + ONNX/TF Lite service")}>
        Open camera stub
      </button>
    </div>
  );
}

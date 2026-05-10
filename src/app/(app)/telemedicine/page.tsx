export default function TelemedicinePage() {
  return (
    <div className="space-y-4 rounded-3xl border border-sky-100 bg-sky-50 p-8">
      <h1 className="text-2xl font-bold text-sky-950">Telemedicine studio</h1>
      <p className="text-sm text-sky-900/90">
        Secure video/audio via WebRTC provider, e-prescription signing, instant cart handoff — module placeholder.
      </p>
      <button
        type="button"
        className="rounded-full bg-sky-700 px-6 py-3 text-sm font-semibold text-white"
        disabled
      >
        Start consult (wire provider)
      </button>
    </div>
  );
}

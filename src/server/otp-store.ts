/** Server OTP store for demo. In production use Redis + strict rate limits. */
type OtpRecord = { code: string; expires: number; attempts: number };

const globalStore = globalThis as unknown as { __medirushOtp?: Map<string, OtpRecord> };

function store() {
  if (!globalStore.__medirushOtp) globalStore.__medirushOtp = new Map();
  return globalStore.__medirushOtp;
}

export function setOtp(email: string, ttlMs = 5 * 60_000) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const normalized = email.trim().toLowerCase();
  store().set(normalized, { code, expires: Date.now() + ttlMs, attempts: 0 });
  return code;
}

export function verifyOtp(email: string, code: string) {
  const normalized = email.trim().toLowerCase();
  const rec = store().get(normalized);
  if (!rec) return { ok: false as const, reason: "expired" };
  if (Date.now() > rec.expires) {
    store().delete(normalized);
    return { ok: false as const, reason: "expired" };
  }
  rec.attempts += 1;
  if (rec.attempts > 8) {
    store().delete(normalized);
    return { ok: false as const, reason: "locked" };
  }
  if (rec.code !== code.trim()) return { ok: false as const, reason: "nomatch" };
  store().delete(normalized);
  return { ok: true as const };
}

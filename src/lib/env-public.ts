/** Server-readable flags (not prefixed with NEXT_PUBLIC_). */

export function shouldExposeDemoOtp(): boolean {
  if (process.env.MEDIRUSH_DEMO_OTP === "true") return true;
  return process.env.NODE_ENV !== "production";
}

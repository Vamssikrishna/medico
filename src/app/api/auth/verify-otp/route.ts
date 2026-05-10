import { NextResponse } from "next/server";
import { verifyOtp } from "@/server/otp-store";

export async function POST(req: Request) {
  let body: { email?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  const code = (body.code ?? "").trim();
  if (!email || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
  }
  const res = verifyOtp(email, code);
  if (!res.ok) {
    const map: Record<string, string> = {
      expired: "OTP expired — request again",
      nomatch: "Incorrect OTP",
      locked: "Too many attempts",
    };
    return NextResponse.json({ ok: false, error: map[res.reason] ?? "Verification failed" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

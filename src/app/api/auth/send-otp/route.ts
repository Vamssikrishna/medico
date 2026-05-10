import { NextResponse } from "next/server";
import { shouldExposeDemoOtp } from "@/lib/env-public";
import { setOtp } from "@/server/otp-store";

export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }
  const code = setOtp(email);
  const devPayload = shouldExposeDemoOtp() ? ({ demoOtp: code } as const) : ({} as const);
  return NextResponse.json({ ok: true, message: "Verification code sent", ...devPayload });
}

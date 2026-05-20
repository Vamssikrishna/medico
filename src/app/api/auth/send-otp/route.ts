import { NextResponse } from "next/server";
import { sendOtpEmail } from "@/server/email";
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
  try {
    await sendOtpEmail(email, code);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email delivery failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, message: "Verification code sent to email" });
}

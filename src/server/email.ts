import nodemailer from "nodemailer";

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing email environment variable: ${name}`);
  return value;
}

export async function sendOtpEmail(email: string, code: string) {
  const host = required("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT || 587);
  const user = required("SMTP_USER");
  const pass = required("SMTP_PASS");
  const from = required("SMTP_FROM");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: "Your MediRush verification code",
    text: `Your MediRush OTP is ${code}. It expires in 5 minutes. Do not share this code.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #dbe7df;border-radius:18px">
        <h1 style="margin:0 0 12px;color:#062e22">MediRush verification</h1>
        <p style="color:#334155">Use this one-time password to continue. It expires in 5 minutes.</p>
        <div style="font-size:32px;font-weight:800;letter-spacing:8px;color:#062e22;background:#dfff1a;padding:16px 20px;border-radius:14px;text-align:center">${code}</div>
        <p style="font-size:12px;color:#64748b;margin-top:18px">If you did not request this, ignore this email.</p>
      </div>
    `,
  });
}

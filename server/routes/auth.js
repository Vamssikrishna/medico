import express from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { sendOtpEmail } from "../services/mailer.js";
import { routeError, routeOk } from "../utils/http.js";

const router = express.Router();
const otpStore = new Map();

function codeFor(email) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(email, { code, expires: Date.now() + 5 * 60_000, attempts: 0 });
  return code;
}

router.post("/send-otp", asyncHandler(async (req, res) => {
  const { email } = z.object({ email: z.string().email() }).parse(req.body);
  const normalized = email.trim().toLowerCase();
  const code = codeFor(normalized);
  await sendOtpEmail(normalized, code);
  routeOk(res, {
    message: "Verification code sent to email",
  });
}));

router.post("/verify-otp", asyncHandler(async (req, res) => {
  const { email, code, name } = z
    .object({ email: z.string().email(), code: z.string().regex(/^\d{6}$/), name: z.string().optional() })
    .parse(req.body);
  const normalized = email.trim().toLowerCase();
  const rec = otpStore.get(normalized);
  if (!rec || rec.expires < Date.now()) return routeError(res, 400, "Code expired");
  rec.attempts += 1;
  if (rec.attempts > 8) {
    otpStore.delete(normalized);
    return routeError(res, 429, "Too many attempts");
  }
  if (rec.code !== code.trim()) return routeError(res, 400, "Incorrect code");
  otpStore.delete(normalized);
  const user = { id: normalized, email: normalized, name: name || normalized.split("@")[0], tier: "user" };
  const token = jwt.sign(user, env.jwtSecret, { expiresIn: "7d" });
  return routeOk(res, { token, user });
}));

export default router;

import mongoose from "mongoose";

export function routeOk(res, payload = {}, status = 200) {
  return res.status(status).json({ ok: true, ...payload });
}

export function routeError(res, status, error, details) {
  return res.status(status).json({ ok: false, error, ...(details ? { details } : {}) });
}

export function isObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

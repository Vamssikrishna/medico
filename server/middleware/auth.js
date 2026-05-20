import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { routeError } from "../utils/http.js";

export function requireAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return routeError(res, 401, "Authentication required");
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return routeError(res, 401, "Invalid or expired session");
  }
}

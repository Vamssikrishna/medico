import { SESSION_COOKIE_NAME } from "@/constants/session";

/** Client-side gate cookie for middleware (upgrade to httpOnly + signed token in production). */
export type SessionCookieValue = "user" | "guest";

export function setSessionCookie(kind: SessionCookieValue) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${SESSION_COOKIE_NAME}=${kind}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

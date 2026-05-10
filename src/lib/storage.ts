const AUTH_KEY = "medirush_auth_user";
const PROFILE_KEY = "medirush_profile";
const CART_KEY = "medirush_cart";
const SESSION_KEY = "medirush_session_token";
const BIOS_KEY = "medirush_biometric_pref";
const ORDERS_KEY = "medirush_orders";
const RX_KEY = "medirush_prescriptions";
const GUEST_KEY = "medirush_guest_lane";

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const storageKeys = {
  AUTH_KEY,
  PROFILE_KEY,
  CART_KEY,
  SESSION_KEY,
  BIOS_KEY,
  ORDERS_KEY,
  RX_KEY,
  GUEST_KEY,
};

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "@/lib/types";
import { clearSessionCookie, setSessionCookie } from "@/lib/session-cookie";
import { readJson, storageKeys, writeJson } from "@/lib/storage";

type AuthState = {
  user: AuthUser | null;
  guestMode: boolean;
  sessionToken: string | null;
  biometricEnabled: boolean;
  loginWithProvider: (provider: "google" | "apple", profile: { name: string; email: string }) => void;
  loginWithEmailOtp: (email: string, name: string) => void;
  enterGuest: () => void;
  logout: () => void;
  setBiometricEnabled: (v: boolean) => void;
};

const AuthContext = createContext<AuthState | null>(null);

function makeId() {
  return `u_${Math.random().toString(36).slice(2, 10)}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [guestMode, setGuestMode] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [biometricEnabled, setBio] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const u = readJson<AuthUser | null>(storageKeys.AUTH_KEY, null);
      const tok = readJson<string | null>(storageKeys.SESSION_KEY, null);
      const bio = readJson<boolean>(storageKeys.BIOS_KEY, false);
      const guestLane = readJson<boolean>(storageKeys.GUEST_KEY, false);
      setBio(bio);
      if (u) {
        setUser(u);
        setGuestMode(false);
        if (tok) setSessionToken(tok);
        setSessionCookie("user");
        localStorage.removeItem(storageKeys.GUEST_KEY);
      } else if (guestLane && tok) {
        setGuestMode(true);
        setSessionToken(tok);
        setSessionCookie("guest");
      }
    });
  }, []);

  const persistSession = useCallback((u: AuthUser | null, tok: string | null) => {
    if (u) writeJson(storageKeys.AUTH_KEY, u);
    else localStorage.removeItem(storageKeys.AUTH_KEY);
    if (tok) writeJson(storageKeys.SESSION_KEY, tok);
    else localStorage.removeItem(storageKeys.SESSION_KEY);
  }, []);

  const loginWithEmailOtp = useCallback(
    (email: string, name: string) => {
      const u: AuthUser = {
        id: makeId(),
        email,
        name,
        tier: "user",
        provider: "email-otp",
        biometricUnlock: biometricEnabled,
      };
      const tok = `sess_${Math.random().toString(36).slice(2)}`;
      setUser(u);
      setGuestMode(false);
      setSessionToken(tok);
      persistSession(u, tok);
      writeJson(storageKeys.AUTH_KEY, u);
      writeJson(storageKeys.SESSION_KEY, tok);
      localStorage.removeItem(storageKeys.GUEST_KEY);
      setSessionCookie("user");
    },
    [biometricEnabled, persistSession],
  );

  const loginWithProvider = useCallback(
    (provider: "google" | "apple", profile: { name: string; email: string }) => {
      const u: AuthUser = {
        id: makeId(),
        email: profile.email,
        name: profile.name,
        tier: "user",
        provider,
      };
      const tok = `sess_${Math.random().toString(36).slice(2)}`;
      setUser(u);
      setGuestMode(false);
      setSessionToken(tok);
      persistSession(u, tok);
      writeJson(storageKeys.AUTH_KEY, u);
      writeJson(storageKeys.SESSION_KEY, tok);
      localStorage.removeItem(storageKeys.GUEST_KEY);
      setSessionCookie("user");
    },
    [persistSession],
  );

  const enterGuest = useCallback(() => {
    setGuestMode(true);
    setUser(null);
    const tok = `guest_${Math.random().toString(36).slice(2)}`;
    setSessionToken(tok);
    persistSession(null, tok);
    writeJson(storageKeys.GUEST_KEY, true);
    setSessionCookie("guest");
  }, [persistSession]);

  const logout = useCallback(() => {
    setUser(null);
    setGuestMode(false);
    setSessionToken(null);
    persistSession(null, null);
    localStorage.removeItem(storageKeys.GUEST_KEY);
    clearSessionCookie();
  }, [persistSession]);

  const setBiometricEnabled = useCallback((v: boolean) => {
    setBio(v);
    writeJson(storageKeys.BIOS_KEY, v);
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, biometricUnlock: v };
      writeJson(storageKeys.AUTH_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      guestMode,
      sessionToken,
      biometricEnabled,
      loginWithEmailOtp,
      loginWithProvider,
      enterGuest,
      logout,
      setBiometricEnabled,
    }),
    [
      user,
      guestMode,
      sessionToken,
      biometricEnabled,
      loginWithEmailOtp,
      loginWithProvider,
      enterGuest,
      logout,
      setBiometricEnabled,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

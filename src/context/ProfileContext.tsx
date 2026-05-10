"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type {
  Order,
  Prescription,
  UserProfile,
  HealthProfile,
  FamilyMember,
} from "@/lib/types";
import { readJson, storageKeys, writeJson } from "@/lib/storage";

type ProfileCtx = {
  profile: UserProfile;
  orders: Order[];
  prescriptions: Prescription[];
  setHealth: (h: Partial<HealthProfile>) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  upsertFamily: (member: FamilyMember) => void;
  removeFamily: (id: string) => void;
  upsertPrescription: (rx: Prescription) => void;
  addDemoOrder: (order: Order) => void;
};

const ProfileContext = createContext<ProfileCtx | null>(null);

const defaultProfile: UserProfile = {
  addresses: [
    {
      id: "a1",
      label: "Home",
      line1: "12th Cross, MG Road — demo",
      city: "Bengaluru",
      pin: "560071",
      isDefault: true,
    },
  ],
  emergencyContacts: [{ name: "Emergency contact", phone: "+91 90000 00000" }],
  health: {},
  family: [],
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [orders, setOrders] = useState<Order[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setProfile(readJson<UserProfile>(storageKeys.PROFILE_KEY, defaultProfile));
      setOrders(readJson<Order[]>(storageKeys.ORDERS_KEY, []));
      setPrescriptions(readJson<Prescription[]>(storageKeys.RX_KEY, []));
    });
  }, []);

  const persistProfile = useCallback((p: UserProfile) => {
    setProfile(p);
    writeJson(storageKeys.PROFILE_KEY, p);
  }, []);

  const setHealth = useCallback(
    (h: Partial<HealthProfile>) => {
      const next: UserProfile = {
        ...profile,
        health: { ...profile.health, ...h },
      };
      persistProfile(next);
    },
    [persistProfile, profile],
  );

  const updateProfile = useCallback(
    (patch: Partial<UserProfile>) => {
      persistProfile({ ...profile, ...patch });
    },
    [persistProfile, profile],
  );

  const upsertFamily = useCallback(
    (member: FamilyMember) => {
      const others = profile.family.filter((f) => f.id !== member.id);
      persistProfile({ ...profile, family: [...others, member] });
    },
    [persistProfile, profile],
  );

  const removeFamily = useCallback(
    (id: string) => {
      persistProfile({ ...profile, family: profile.family.filter((f) => f.id !== id) });
    },
    [persistProfile, profile],
  );

  const upsertPrescription = useCallback(
    (rx: Prescription) => {
      const next = [...prescriptions.filter((p) => p.id !== rx.id), rx].sort((a, b) =>
        a.uploadedAt < b.uploadedAt ? 1 : -1,
      );
      setPrescriptions(next);
      writeJson(storageKeys.RX_KEY, next);
    },
    [prescriptions],
  );

  const addDemoOrder = useCallback(
    (order: Order) => {
      const next = [order, ...orders];
      setOrders(next);
      writeJson(storageKeys.ORDERS_KEY, next);
    },
    [orders],
  );

  const value = useMemo(
    () => ({
      profile,
      orders,
      prescriptions,
      setHealth,
      updateProfile,
      upsertFamily,
      removeFamily,
      upsertPrescription,
      addDemoOrder,
    }),
    [
      profile,
      orders,
      prescriptions,
      setHealth,
      updateProfile,
      upsertFamily,
      removeFamily,
      upsertPrescription,
      addDemoOrder,
    ],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be inside ProfileProvider");
  return ctx;
}

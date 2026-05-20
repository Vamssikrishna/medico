"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";

const tabs = ["Personal", "Health", "Family"] as const;

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, orders, prescriptions, updateProfile, setHealth, upsertFamily, removeFamily } = useProfile();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Personal");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mr-chip mb-3">
            <span className="mr-signal-dot" />
            Secure care graph
          </p>
          <h1 className="text-4xl font-black tracking-tight text-neutral-950">Profile vault</h1>
          <p className="text-sm font-medium text-neutral-600">Personal, health signals, and dependent care (local demo storage).</p>
        </div>
        {user && (
          <div className="text-right text-sm">
            <div className="font-semibold">{user.name}</div>
            <div className="text-neutral-500">{user.email}</div>
          </div>
        )}
        {!user && (
          <Link href="/auth/login" className="text-sm font-semibold text-emerald-700">
            Sign in to sync
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2 rounded-full border border-emerald-950/10 bg-white/80 p-1 shadow-[0_16px_50px_-40px_rgb(6_46_34/0.75)] backdrop-blur">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === t ? "bg-emerald-950 text-[#dfff1a]" : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Personal" && (
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-emerald-950/10 bg-white/88 p-6 shadow-[0_18px_60px_-46px_rgb(6_46_34/0.75)] backdrop-blur">
            <h2 className="text-lg font-black">Basics</h2>
            <label className="text-xs font-semibold uppercase text-neutral-500">Age</label>
            <input
              type="number"
              className="w-full rounded-xl border px-3 py-2 text-sm"
              value={profile.age ?? ""}
              onChange={(e) =>
                updateProfile({ age: e.target.value ? Number(e.target.value) : undefined })
              }
            />
            <label className="text-xs font-semibold uppercase text-neutral-500">Gender</label>
            <select
              className="w-full rounded-xl border px-3 py-2 text-sm"
              value={profile.gender ?? ""}
              onChange={(e) => updateProfile({ gender: e.target.value })}
            >
              <option value="">Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non-binary">Non-binary</option>
            </select>
          </div>
          <div className="space-y-4 rounded-3xl border border-emerald-950/10 bg-white/88 p-6 shadow-[0_18px_60px_-46px_rgb(6_46_34/0.75)] backdrop-blur">
            <h2 className="text-lg font-black">Default address</h2>
            <label className="text-xs font-semibold uppercase text-neutral-500">Line 1</label>
            <textarea
              className="w-full rounded-xl border px-3 py-2 text-sm"
              rows={3}
              value={profile.addresses[0]?.line1 ?? ""}
              onChange={(e) => {
                const next = [...profile.addresses];
                if (!next[0]) return;
                next[0] = { ...next[0], line1: e.target.value };
                updateProfile({ addresses: next });
              }}
            />
          </div>
          <div className="space-y-3 rounded-3xl border border-emerald-950/10 bg-white/88 p-6 shadow-[0_18px_60px_-46px_rgb(6_46_34/0.75)] backdrop-blur md:col-span-2">
            <h2 className="text-lg font-black">Emergency contacts</h2>
            {profile.emergencyContacts.map((c, idx) => (
              <div key={idx} className="grid gap-3 md:grid-cols-2">
                <input
                  className="rounded-xl border px-3 py-2 text-sm"
                  value={c.name}
                  onChange={(e) => {
                    const nc = [...profile.emergencyContacts];
                    nc[idx] = { ...nc[idx], name: e.target.value };
                    updateProfile({ emergencyContacts: nc });
                  }}
                />
                <input
                  className="rounded-xl border px-3 py-2 text-sm"
                  value={c.phone}
                  onChange={(e) => {
                    const nc = [...profile.emergencyContacts];
                    nc[idx] = { ...nc[idx], phone: e.target.value };
                    updateProfile({ emergencyContacts: nc });
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "Health" && (
        <section className="mr-glow-card rounded-3xl p-6">
          <h2 className="text-lg font-black text-emerald-950">Signals (optional)</h2>
          <p className="text-sm text-emerald-900/85">
            Powers safer cart checks and AI summaries. Not a diagnosis.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(profile.health?.diabetes)}
                onChange={(e) => setHealth({ diabetes: e.target.checked })}
              />
              Diabetes
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(profile.health?.bpIssues)}
                onChange={(e) => setHealth({ bpIssues: e.target.checked })}
              />
              Blood pressure
            </label>
          </div>
          <label className="mt-4 block text-xs font-semibold uppercase text-emerald-900/70">Allergies (comma sep)</label>
          <input
            className="mt-1 w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm"
            value={(profile.health?.allergies ?? []).join(", ")}
            onChange={(e) =>
              setHealth({
                allergies: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </section>
      )}

      {tab === "Family" && (
        <section className="space-y-4 rounded-3xl border border-emerald-950/10 bg-white/88 p-6 shadow-[0_18px_60px_-46px_rgb(6_46_34/0.75)] backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Dependents</h2>
              <p className="text-sm text-neutral-600">Separate Rx context + reminders · shared delivery.</p>
            </div>
            <button
              type="button"
              className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"
              onClick={() =>
                upsertFamily({
                  id: `fam_${Math.random().toString(36).slice(2, 6)}`,
                  relation: "Parent",
                  name: "New dependent",
                })
              }
            >
              Add
            </button>
          </div>
          <div className="space-y-3">
            {profile.family.map((f) => (
              <div key={f.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3">
                <div>
                  <input
                    className="font-semibold"
                    value={f.name}
                    onChange={(e) => upsertFamily({ ...f, name: e.target.value })}
                  />
                  <div className="text-xs text-neutral-500">{f.relation}</div>
                </div>
                <button type="button" className="text-xs text-rose-600" onClick={() => removeFamily(f.id)}>
                  Remove
                </button>
              </div>
            ))}
            {profile.family.length === 0 && <p className="text-sm text-neutral-500">No dependents yet.</p>}
          </div>
        </section>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-emerald-950/10 bg-white/88 p-6 shadow-[0_18px_60px_-46px_rgb(6_46_34/0.75)] backdrop-blur">
          <h2 className="text-lg font-black">Prescriptions on file</h2>
          <p className="text-sm text-neutral-600">{prescriptions.length} uploads</p>
          <Link href="/prescriptions" className="mt-3 inline-block text-sm font-semibold text-emerald-700">
            Manage
          </Link>
        </div>
        <div className="rounded-3xl border border-emerald-950/10 bg-white/88 p-6 shadow-[0_18px_60px_-46px_rgb(6_46_34/0.75)] backdrop-blur">
          <h2 className="text-lg font-black">Orders</h2>
          <p className="text-sm text-neutral-600">{orders.length} deliveries</p>
          <Link href="/orders" className="mt-3 inline-block text-sm font-semibold text-emerald-700">
            Track
          </Link>
        </div>
      </section>
    </div>
  );
}

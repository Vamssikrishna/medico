"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/symptom-assistant", label: "Care" },
  { href: "/partner/pharmacy", label: "Pharmacy" },
  { href: "/partner/rider", label: "Rider" },
  { href: "/admin", label: "Admin" },
];

export function AppHeader() {
  const { lines } = useCart();
  const { user, guestMode, logout } = useAuth();
  const pathname = usePathname();
  const count = lines.reduce((n, l) => n + l.qty, 0);

  function handleLogout() {
    logout();
    window.location.assign("/auth/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-emerald-950/88 text-white shadow-[0_18px_60px_-32px_rgba(3,29,22,0.9)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 font-bold tracking-tight">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#dfff1a]/80 bg-[#dfff1a] text-sm font-black text-emerald-950 shadow-[0_0_28px_rgba(223,255,26,0.25)] transition group-hover:scale-105">
            MR
          </span>
          <span className="hidden text-lg font-black sm:inline">MediRush</span>
        </Link>
        <div className="hidden flex-1 md:flex md:justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold text-emerald-50 shadow-inner shadow-white/5 backdrop-blur-sm">
            <span className="mr-signal-dot" aria-hidden />
            <span>
              Under <span className="font-black text-[#dfff1a]">30 min</span> delivery · verified partner grid
            </span>
          </div>
        </div>
        <nav className="ml-auto flex min-w-0 items-center justify-end gap-1 overflow-x-auto rounded-full border border-white/5 bg-white/[0.03] p-1 text-[13px] font-semibold">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3 py-1.5 transition ${
                  active ? "bg-[#dfff1a] text-emerald-950 shadow-sm" : "text-emerald-100/90 hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/cart"
            className="relative ml-1 flex shrink-0 items-center rounded-full bg-[#dfff1a] px-4 py-2 text-sm font-black tracking-tight text-emerald-950 shadow-[0_10px_28px_-12px_rgba(223,255,26,0.95)] hover:bg-[#e8ff50]"
          >
            Cart
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <div className="ml-1 flex shrink-0 items-center gap-2 border-l border-white/15 pl-3">
              <Link href="/profile" className="max-w-[9rem] truncate rounded-full px-2 py-1 hover:bg-white/10">
                {user.name.split(" ")[0]}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/25 px-3 py-1 text-xs font-semibold hover:bg-white/10"
              >
                Out
              </button>
            </div>
          ) : (
            <div className="ml-1 flex shrink-0 items-center gap-2 border-l border-white/15 pl-3">
              {guestMode && (
                <span className="rounded-full bg-[#dfff1a]/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#dfff1a]">
                  Guest
                </span>
              )}
              <Link href="/auth/login" className="rounded-full px-2 py-1 text-xs font-bold text-[#dfff1a] hover:underline">
                Sign in
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

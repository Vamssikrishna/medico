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
    <header className="sticky top-0 z-40 border-b border-emerald-950/30 bg-gradient-to-r from-emerald-950 via-[#084432] to-emerald-900 text-white shadow-lg shadow-emerald-950/20">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#dfff1a]/80 bg-[#dfff1a] text-sm text-emerald-950 shadow-sm">
            MR
          </span>
          <span className="text-lg">MediRush</span>
        </Link>
        <div className="hidden flex-1 md:flex md:justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-medium text-emerald-50 backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#dfff1a]" aria-hidden />
            <span>
              Under <span className="font-bold text-[#dfff1a]">30 min</span> delivery · live slots
            </span>
          </div>
        </div>
        <nav className="ml-auto flex flex-wrap items-center justify-end gap-1 text-[13px] font-medium">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 transition ${
                  active ? "bg-white/15 text-white" : "text-emerald-100/90 hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/cart"
            className="relative ml-1 flex items-center rounded-full bg-[#dfff1a] px-4 py-2 text-sm font-bold tracking-tight text-emerald-950 shadow-md shadow-emerald-950/30 hover:bg-[#e8ff50]"
          >
            Cart
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <div className="ml-1 flex items-center gap-2 border-l border-white/15 pl-3">
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
            <div className="ml-1 flex items-center gap-2 border-l border-white/15 pl-3">
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

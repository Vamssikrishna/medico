import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { LiveOpsStrip } from "@/components/LiveOpsStrip";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden text-neutral-900">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_18%_16%,rgba(223,255,26,0.22),transparent_34%),radial-gradient(circle_at_84%_10%,rgba(94,234,212,0.18),transparent_32%)]" />
      <AppHeader />
      <LiveOpsStrip />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 pb-14 pt-7 sm:px-6 lg:px-8">{children}</main>
      <footer className="relative overflow-hidden border-t border-emerald-300/10 bg-[linear-gradient(135deg,#031d16,#062e22_52%,#04130f)] py-12 text-sm text-emerald-100/90">
        <div className="pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-full bg-[#dfff1a]/14 blur-3xl" />
        <div className="pointer-events-none absolute left-1/4 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-[#dfff1a]/50 to-transparent" />
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-[#dfff1a] text-xs font-black text-emerald-950 shadow-[0_0_30px_rgba(223,255,26,0.28)]">
                MR
              </span>
              <span className="text-lg font-black tracking-tight text-white">MediRush</span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-emerald-200/70">
              Quick-commerce pharmacy experience. Medicine data is illustrative; always follow your
              prescriber and pharmacist.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200/80 sm:flex sm:flex-wrap">
            <Link href="/payments" className="hover:text-[#dfff1a]">
              Pay
            </Link>
            <Link href="/wallet" className="hover:text-[#dfff1a]">
              Wallet
            </Link>
            <Link href="/notifications" className="hover:text-[#dfff1a]">
              Alerts
            </Link>
            <Link href="/telemedicine" className="hover:text-[#dfff1a]">
              Telehealth
            </Link>
            <Link href="/records" className="hover:text-[#dfff1a]">
              Records
            </Link>
            <Link href="/subscription" className="hover:text-[#dfff1a]">
              Pass
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col text-neutral-900">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 pb-12 pt-8">{children}</main>
      <footer className="border-t border-emerald-950/20 bg-emerald-950 py-12 text-sm text-emerald-200/90">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#dfff1a] text-xs font-bold text-emerald-950">
                MR
              </span>
              <span className="text-lg font-bold text-white">MediRush</span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-emerald-200/70">
              Quick-commerce pharmacy experience — demo only. Medicine data is illustrative; always follow your
              prescriber and pharmacist.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-wider text-emerald-300/80">
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

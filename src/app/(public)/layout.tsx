import Link from "next/link";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden text-neutral-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_22%_0%,rgba(223,255,26,0.22),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(94,234,212,0.18),transparent_32%)]" />
      <header className="relative border-b border-white/10 bg-emerald-950/90 shadow-md backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/auth/login" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#dfff1a]/70 bg-[#dfff1a] text-xs font-black text-emerald-950 shadow-[0_0_28px_rgba(223,255,26,0.24)]">
              MR
            </span>
            <div className="leading-tight text-white">
              <div className="text-sm font-black tracking-tight">MediRush</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200/80">Care network</div>
            </div>
          </Link>
          <div className="mr-chip hidden sm:inline-flex">
            <span className="mr-signal-dot" />
            Sign in to browse & order
          </div>
        </div>
      </header>
      <div className="relative flex flex-1 flex-col items-center px-4 py-10 sm:py-16">{children}</div>
      <footer className="relative border-t border-emerald-950/10 bg-white/70 py-6 text-center text-[11px] font-medium text-neutral-500 backdrop-blur">
        Health data handling must follow applicable law, your DPA, and pharmacy policies · Demo
      </footer>
    </div>
  );
}

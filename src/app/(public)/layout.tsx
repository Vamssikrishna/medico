import Link from "next/link";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-950/5 via-[#f3fbf4] to-white text-neutral-900">
      <header className="border-b border-emerald-950/10 bg-gradient-to-r from-emerald-950 to-emerald-900 shadow-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/auth/login" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dfff1a] text-xs font-black text-emerald-950">
              MR
            </span>
            <div className="leading-tight text-white">
              <div className="text-sm font-bold tracking-tight">MediRush</div>
              <div className="text-[10px] font-medium text-emerald-200/80">Quick pharmacy</div>
            </div>
          </Link>
          <div className="text-[11px] font-medium text-[#dfff1a]/90">Sign in to browse & order</div>
        </div>
      </header>
      <div className="flex flex-1 flex-col items-center px-4 py-10 sm:py-16">{children}</div>
      <footer className="border-t border-emerald-100 bg-white py-6 text-center text-[11px] text-neutral-500">
        Health data handling must follow applicable law, your DPA, and pharmacy policies · Demo
      </footer>
    </div>
  );
}

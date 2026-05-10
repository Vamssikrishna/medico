import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-neutral-600">Loading search…</div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}

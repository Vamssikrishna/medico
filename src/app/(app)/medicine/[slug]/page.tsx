import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MedicineDetailActions } from "./MedicineDetailActions";
import { getGenericAlternatives } from "@/lib/medicine-relatives";
import { getMedicineBySlug, medicines } from "@/lib/mock/medicines";
import type { Metadata } from "next";

export function generateStaticParams() {
  return medicines.map((m) => ({ slug: m.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = getMedicineBySlug(slug);
  if (!m) return {};
  return { title: `${m.brand} · MediRush` };
}

export default async function MedicinePage({ params }: Props) {
  const { slug } = await params;
  const m = getMedicineBySlug(slug);
  if (!m) notFound();
  const alternatives = getGenericAlternatives(m.id);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <div className="space-y-4">
        <div className="relative aspect-square max-w-md overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <Image
            src={`https://picsum.photos/seed/${m.slug}/800/800`}
            alt={m.brand}
            fill
            className="object-cover"
            priority
            sizes="(max-width:1024px) 100vw, 480px"
          />
          {m.temperatureSensitive && (
            <span className="absolute left-4 top-4 rounded-full bg-sky-600 px-3 py-1 text-xs font-bold text-white">
              Cold chain
            </span>
          )}
          {typeof m.restrictedAge === "number" && (
            <span className="absolute bottom-4 left-4 rounded-full bg-neutral-950/75 px-3 py-1 text-xs text-white backdrop-blur">
              Age gated {m.restrictedAge}+
            </span>
          )}
        </div>
      </div>
      <article className="space-y-5">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-emerald-700">
            {m.manufacturer} · {m.form}
          </p>
          <h1 className="text-4xl font-bold text-neutral-950">{m.brand}</h1>
          <p className="text-neutral-600">{m.usesSummary}</p>
          <MedicineDetailActions medicineId={m.id} price={m.discountedPrice ?? m.mrp} mrp={m.mrp} />
        </header>

        <section className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5">
          <h2 className="text-lg font-semibold text-emerald-950">AI simplified</h2>
          <p className="mt-2 text-emerald-900/85">{m.simplifiedAi}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Basics</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
            <li>Salt composition: {m.genericSalts.join(", ")}</li>
            <li>Strength: {m.strength}</li>
            <li>Storage: {m.storageInstructions} · Demo batches sync via partner POS.</li>
          </ul>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <h3 className="font-semibold text-amber-950">Common side effects</h3>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-amber-900">
              {m.commonSideEffects.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
            <h3 className="font-semibold text-rose-950">Severe risks</h3>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-rose-900">
              {m.severeRisks.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h3 className="font-semibold">When to consult a doctor</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-700">
            {m.whenToConsult.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Drug interaction checker</h2>
          <div className="space-y-2">
            {m.interactions.map((i) => (
              <div
                key={i.with + i.message}
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  i.severity === "danger"
                    ? "border-rose-200 bg-rose-50 text-rose-900"
                    : i.severity === "warn"
                      ? "border-amber-200 bg-amber-50 text-amber-900"
                      : "border-slate-200 bg-slate-50 text-slate-800"
                }`}
              >
                <span className="font-semibold">{i.with}:</span> {i.message}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Generic alternatives</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {alternatives.length === 0 && (
              <p className="text-sm text-neutral-600">No alternates indexed in demo catalog.</p>
            )}
            {alternatives.map((alt) => (
              <Link
                key={alt.id}
                href={`/medicine/${alt.slug}`}
                className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm shadow-sm hover:border-emerald-200"
              >
                <div className="font-semibold text-neutral-900">{alt.brand}</div>
                <div className="text-neutral-600">₹{alt.discountedPrice ?? alt.mrp}</div>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}

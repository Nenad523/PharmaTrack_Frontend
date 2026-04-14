import Link from "next/link";
import { ArrowRight, Clock3, Pill, Search } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-14 pt-20 text-center md:pt-24">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-white/80 text-blue-600 shadow-sm">
        <Pill className="h-7 w-7" />
      </div>

      <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
        Pronađite ljekove.{" "}
        <span className="text-blue-600">Brzo i pouzdano.</span>
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
        PharmaTrack vam pomaže da pronađete dostupne ljekove u apotekama širom
        Crne Gore, provjerite dežurne apoteke i budete u toku sa zdravstvenim
        novostima.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/api/v1/medications"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
        >
          <Search className="h-4 w-4" />
          Pretražite ljekove
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          href="/api/v1/pharmacies/duty"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
        >
          <Clock3 className="h-4 w-4" />
          Pogledajte dežurne
        </Link>
      </div>
    </section>
  );
}

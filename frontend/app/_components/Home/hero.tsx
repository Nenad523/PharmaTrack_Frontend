import Link from "next/link";
import { ArrowRight, Clock3, Pill, Search } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-10 pt-14 text-center sm:px-6 md:pb-14 md:pt-24">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-white/80 text-blue-600 shadow-sm md:mb-6 md:h-14 md:w-14">
        <Pill className="h-6 w-6 md:h-7 md:w-7" />
      </div>

      <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
        Pronađite ljekove. <span className="text-blue-600">Brzo i pouzdano.</span>
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:mt-6 md:text-lg">
        PharmaTrack vam pomaže da pronađete dostupne ljekove u apotekama širom
        Crne Gore, provjerite dežurne apoteke i budete u toku sa zdravstvenim
        novostima.
      </p>

      <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-2.5 md:mt-8 md:flex md:max-w-none md:flex-row md:items-center md:justify-center md:gap-3">
        <Link
          href="/api/v1/medications"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 md:px-6"
        >
          <Search className="h-4 w-4" />
          <span>Pretraga</span>
          <ArrowRight className="hidden h-4 w-4 md:block" />
        </Link>

        <Link
          href="/api/v1/pharmacies/duty"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 md:px-6"
        >
          <Clock3 className="h-4 w-4" />
          <span>Dežurne</span>
        </Link>
      </div>
    </section>
  );
}

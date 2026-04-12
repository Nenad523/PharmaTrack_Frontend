import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Clock3,
  ExternalLink,
  MapPin,
  Pill,
  Search,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

type QuickAction =
  | {
      title: string;
      description: string;
      icon: typeof Search;
      href: string;
      locked?: false;
    }
  | {
      title: string;
      description: string;
      icon: typeof Search;
      locked: true;
      href?: never;
    };

const quickActions: QuickAction[] = [
  {
    title: "Pretraga ljekova",
    description: "Pronađite ljekove u apotekama širom Crne Gore.",
    icon: Search,
    href: "/api/v1/medications",
  },
  {
    title: "Dežurne apoteke",
    description: "Pogledajte raspored dežurnih apoteka po gradu.",
    icon: Clock3,
    href: "/api/v1/pharmacies/duty",
  },
  {
    title: "Notifikacije",
    description: "Primajte obavještenja o dostupnosti ljekova.",
    icon: Bell,
    locked: true,
  },
  {
    title: "Pretraga po simptomima",
    description: "Pronađite odgovarajuće ljekove prema simptomima.",
    icon: Stethoscope,
    locked: true,
  },
];

const features = [
  {
    title: "Pretraga ljekova",
    description:
      "Pretražite bazu podataka ljekova dostupnih u Crnoj Gori po nazivu, dozi ili aktivnoj supstanci.",
    icon: Search,
  },
  {
    title: "Lokacije apoteka",
    description:
      "Pronađite najbliže apoteke koje imaju traženi lijek na zalihama sa kontakt informacijama.",
    icon: MapPin,
  },
  {
    title: "Dežurne apoteke",
    description:
      "Provjerite koje apoteke su dežurne danas ili bilo koji dan u mjesecu putem kalendara.",
    icon: Clock3,
  },
  {
    title: "Pouzdani podaci",
    description:
      "Podaci se redovno ažuriraju u saradnji sa apotekama i nadležnim institucijama.",
    icon: ShieldCheck,
  },
];

const news = [
  {
    category: "Globalno zdravlje",
    date: "27. mar 2026",
    title: "SZO upozorava na porast otpornosti bakterija na antibiotike",
    description:
      "Svjetska zdravstvena organizacija objavila novi izvještaj o antimikrobnoj rezistenciji koja prijeti globalnom zdravlju.",
    source: "WHO",
  },
  {
    category: "Istraživanja",
    date: "25. mar 2026",
    title: "Nova studija: Vitamin D značajno smanjuje rizik od respiratornih infekcija",
    description:
      "Istraživači sa Univerziteta u Oslu potvrdili preventivno djelovanje vitamina D tokom zimskih mjeseci.",
    source: "The Lancet",
  },
  {
    category: "Farmacija",
    date: "24. mar 2026",
    title: "Evropska agencija za ljekove odobrila novu terapiju za dijabetes tipa 2",
    description:
      "EMA je izdala pozitivno mišljenje za inovativni lijek koji kombinuje dva mehanizma djelovanja.",
    source: "EMA",
  },
  {
    category: "Lokalno",
    date: "22. mar 2026",
    title: "Crna Gora uvodi digitalne recepte od jula 2026",
    description:
      "Ministarstvo zdravlja najavljuje prelazak na elektronski sistem propisivanja ljekova.",
    source: "Vijesti",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_65%)]" />
      <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />

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

      <section className="mx-auto grid max-w-6xl gap-4 px-6 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;

          if (action.locked) {
            return (
              <div
                key={action.title}
                className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <Icon className="h-5 w-5 text-slate-400" />
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                    Potrebna prijava
                  </span>
                </div>
                <h2 className="mt-5 text-lg font-semibold text-slate-900">
                  {action.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {action.description}
                </p>
              </div>
            );
          }

          return (
            <Link
              key={action.title}
              href={action.href}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <Icon className="h-5 w-5 text-blue-600" />
              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                {action.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {action.description}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Kako PharmaTrack funkcioniše
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <Icon className="h-6 w-6 text-blue-600" />
                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-slate-200/70 bg-white/70">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Aktuelnosti iz svijeta zdravlja
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                Informativni pregled važnih zdravstvenih i farmaceutskih tema dok
                čekamo povezivanje pravih izvora podataka.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {news.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-600">
                    {item.category}
                  </span>
                  <span className="text-slate-400">{item.date}</span>
                </div>

                <h3 className="mt-4 text-xl font-semibold leading-8 text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                  {item.description}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                  <ExternalLink className="h-4 w-4" />
                  {item.source}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

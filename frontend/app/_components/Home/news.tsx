import { ExternalLink } from "lucide-react";
import { news } from "./data";

export default function HomeNews() {
  return (
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
  );
}

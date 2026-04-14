import { features } from "./data";

export default function HomeFeatures() {
  return (
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
  );
}

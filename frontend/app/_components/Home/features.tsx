import { features } from "./data";

export default function HomeFeatures() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        Kako PharmaTrack funkcioniše
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-3 md:mt-8 md:gap-5">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6"
            >
              <Icon className="h-5 w-5 text-blue-600 md:h-6 md:w-6" />
              <h3 className="mt-3 text-sm font-semibold leading-5 text-slate-900 sm:text-base md:mt-5 md:text-xl">
                {feature.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm md:mt-3 md:text-base md:leading-7">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

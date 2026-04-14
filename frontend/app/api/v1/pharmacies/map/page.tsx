export default function Home() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          U izradi
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
          Mapa apoteka
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
          Ovdje ćemo prikazivati mapu apoteka sa lokacijama, radnim vremenom i
          dostupnošću lijekova. Ruta je ostavljena aktivnom da možemo lako
          nastaviti implementaciju.
        </p>
      </div>
    </section>
  );
}

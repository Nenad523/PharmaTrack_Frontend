import { X, Pill, AlertTriangle } from "lucide-react";
import { Medicine } from "../types";

type MedicineDetailsPanelProps = {
  medicine: Medicine;
  onClose: () => void;
};

export default function MedicineDetailsPanel({
  medicine,
  onClose,
}: MedicineDetailsPanelProps) {
  const availableDoses = medicine.doses.filter((dose) => dose !== "Sve");

  return (
    <>
      <div className="fixed inset-0 z-50 xl:hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70"
          aria-label="Zatvori prikaz detalja"
        />

        <div className="relative ml-auto h-full w-[min(21rem,calc(100vw-2rem))] overflow-y-auto rounded-l-[28px] border-l border-slate-200/80 bg-white shadow-xl">
          <div className="flex items-start justify-between gap-4 px-6 py-5">
            <div className="w-full text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {medicine.name}
              </h2>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-slate-500">
                {availableDoses.map((dose, index) => (
                  <span key={dose}>
                    {dose}
                    {index < availableDoses.length - 1 ? " ·" : ""}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-600 transition hover:bg-blue-50"
              aria-label={`Zatvori detalje za lijek ${medicine.name}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-6 px-6 pb-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Opis</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {medicine.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Aktivna supstanca
              </h3>
              <div className="mt-3">
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                  {medicine.activeSubstance}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Dostupne doze
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {availableDoses.map((dose) => (
                  <span
                    key={dose}
                    className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    {dose}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white/80 p-2 text-amber-500">
                  <AlertTriangle className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm leading-7 text-slate-700">
                    Prikazane informacije služe isključivo u{" "}
                    <span className="font-semibold">informativne svrhe</span> i
                    ne predstavljaju zamjenu za savjet ljekara ili farmaceuta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="hidden w-full xl:sticky xl:top-24 xl:block">
        <div className="overflow-hidden rounded-[28px] border border-blue-200/80 bg-white/95 shadow-[0_24px_55px_-30px_rgba(15,23,42,0.45),0_14px_30px_-22px_rgba(37,99,235,0.55)] ring-1 ring-blue-100/60 backdrop-blur">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
                Detalji lijeka
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {medicine.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
              aria-label={`Zatvori detalje za lijek ${medicine.name}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-6 pt-5">
            <div className="flex flex-wrap gap-2">
              {availableDoses.map((dose) => (
                <span
                  key={dose}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                >
                  {dose}
                </span>
              ))}
            </div>
          </div>

          <div className="px-6 pt-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-blue-100 bg-white p-3 text-blue-600 shadow-sm">
                  <Pill className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Kratak pregled
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {medicine.name} je dostupan u više jačina i može se dalje
                    pretraživati po odabranoj dozi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-6 py-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Opis</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {medicine.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Aktivna supstanca
              </h3>
              <div className="mt-3">
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                  {medicine.activeSubstance}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white/80 p-2 text-amber-500">
                  <AlertTriangle className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Informativni prikaz
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {medicine.warning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

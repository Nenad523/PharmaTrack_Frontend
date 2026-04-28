import { AlertCircle, RotateCw } from "lucide-react";
import { formatFullDate } from "./date_utils";
import DutyPharmacyCard from "./duty_pharmacy_card";
import { ALL_CITIES_VALUE, DutyPharmacy } from "./types";

type DutyPharmacyListProps = {
  selectedDate: string;
  selectedCity: string;
  pharmacies: DutyPharmacy[];
  totalCount: number;
  isLoading: boolean;
  error: string;
  detailsPharmacyId: number | null;
  onToggleDetails: (pharmacyId: number) => void;
  onRetry: () => void;
};

export default function DutyPharmacyList({
  selectedDate,
  selectedCity,
  pharmacies,
  totalCount,
  isLoading,
  error,
  detailsPharmacyId,
  onToggleDetails,
  onRetry,
}: DutyPharmacyListProps) {
  const cityLabel =
    selectedCity === ALL_CITIES_VALUE ? "Svi gradovi" : selectedCity;
  const countLabel = pharmacies.length === 1 ? "apoteka" : "apoteka";

  return (
    <section className="min-w-0">
      <div className="mb-5 flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            {formatFullDate(selectedDate)}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Dežurne apoteke
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isLoading
              ? "Učitavanje rasporeda..."
              : `${pharmacies.length} ${countLabel} za prikaz`}
          </p>
        </div>

        <div className="inline-flex w-fit rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
          {cityLabel}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex animate-pulse gap-4">
                <div className="h-10 w-10 rounded-2xl bg-slate-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-2/5 rounded bg-slate-200" />
                  <div className="h-4 w-4/5 rounded bg-slate-100" />
                  <div className="h-4 w-1/2 rounded bg-slate-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-red-50 p-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Nije moguće učitati dežurne apoteke.
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{error}</p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <RotateCw className="h-4 w-4" />
                Pokušaj ponovo
              </button>
            </div>
          </div>
        </div>
      ) : pharmacies.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-slate-100 p-2 text-slate-500">
              <AlertCircle className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Nema dežurnih apoteka.
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Za izabrani datum i grad trenutno nema dostupnih zapisa.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {totalCount !== pharmacies.length && (
            <p className="text-sm text-slate-500">
              Prikazano {pharmacies.length} od {totalCount} apoteka za ovaj
              datum.
            </p>
          )}

          {pharmacies.map((pharmacy) => (
            <DutyPharmacyCard
              key={pharmacy.id}
              pharmacy={pharmacy}
              detailsPharmacyId={detailsPharmacyId}
              onToggleDetails={onToggleDetails}
            />
          ))}
        </div>
      )}
    </section>
  );
}

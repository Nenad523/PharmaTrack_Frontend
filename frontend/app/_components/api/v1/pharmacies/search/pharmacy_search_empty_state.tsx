import {
  AlertCircle,
  CheckCircle2,
  Info,
  Pill,
  RotateCw,
  Search,
  X,
} from "lucide-react";
import { MedicationAlternative, MedicationDose } from "./types";

type PharmacySearchEmptyStateProps = {
  medicineId: number | null;
  hasActiveFilters: boolean;
  alternatives: MedicationAlternative[];
  isAlternativesLoading: boolean;
  alternativesError: string;
  selectedAlternative: MedicationAlternative | null;
  selectedAlternativeDoses: MedicationDose[];
  selectedAlternativeDoseIds: number[];
  isAlternativeDosesLoading: boolean;
  alternativeDosesError: string;
  onLoadAlternatives: () => void;
  onSelectAlternative: (alternative: MedicationAlternative) => void;
  onToggleAlternativeDose: (doseId: number) => void;
  onSearchAlternative: () => void;
  onResetFilters: () => void;
  onLoadMedicineDetails: (medicineId: number) => void;
};

export default function PharmacySearchEmptyState({
  medicineId,
  hasActiveFilters,
  alternatives,
  isAlternativesLoading,
  alternativesError,
  selectedAlternative,
  selectedAlternativeDoses,
  selectedAlternativeDoseIds,
  isAlternativeDosesLoading,
  alternativeDosesError,
  onLoadAlternatives,
  onSelectAlternative,
  onToggleAlternativeDose,
  onSearchAlternative,
  onResetFilters,
  onLoadMedicineDetails,
}: PharmacySearchEmptyStateProps) {
  const hasLoadedAlternatives =
    alternatives.length > 0 || Boolean(alternativesError);
  const canSearchAlternative =
    Boolean(selectedAlternative) && selectedAlternativeDoseIds.length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-in">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-slate-100 p-2 text-slate-500">
          <AlertCircle className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-slate-900">
            Nema apoteka za prikaz.
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {hasActiveFilters
              ? "Nema rezultata za odabrani lijek sa trenutnim filterima."
              : "Nema rezultata za odabrani lijek i dozu."}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onLoadAlternatives}
              disabled={!medicineId || isAlternativesLoading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {isAlternativesLoading ? (
                <RotateCw className="h-4 w-4 animate-spin" />
              ) : (
                <Pill className="h-4 w-4" />
              )}
              {isAlternativesLoading ? "Učitavanje..." : "Prikaži alternative"}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
              >
                <X className="h-4 w-4" />
                Očisti filtere
              </button>
            )}
          </div>

          {!medicineId && (
            <p className="mt-3 text-sm font-semibold text-amber-700">
              Lijek nije dostupan u URL parametrima, pa alternative nije moguće
              učitati sa ove stranice.
            </p>
          )}

          {hasLoadedAlternatives && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              {alternativesError && (
                <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                  {alternativesError}
                </p>
              )}

              {alternatives.length > 0 && (
                <>
                  <p className="text-sm font-bold text-slate-900">
                    Odaberite alternativni lijek
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {alternatives.map((alternative) => {
                      const selected = selectedAlternative?.id === alternative.id;

                      return (
                        <article
                          key={alternative.id}
                          className={`rounded-2xl border p-4 transition ${
                            selected
                              ? "border-blue-300 bg-blue-50 shadow-sm shadow-blue-100"
                              : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                                selected
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {selected ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <Pill className="h-4 w-4" />
                              )}
                            </span>
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-slate-900">
                                {alternative.name}
                              </h3>
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                {alternative.description ||
                                  "Opis alternative nije dostupan."}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => onSelectAlternative(alternative)}
                              aria-pressed={selected}
                              className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
                                selected
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                              }`}
                            >
                              {selected && <CheckCircle2 className="h-4 w-4" />}
                              Odaberi
                            </button>

                            <button
                              type="button"
                              onClick={() => onLoadMedicineDetails(alternative.id)}
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                            >
                              <Info className="h-4 w-4" />
                              Detalji
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </>
              )}

              {selectedAlternative && (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">
                    Doze za {selectedAlternative.name}
                  </p>

                  {isAlternativeDosesLoading ? (
                    <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                      <RotateCw className="h-4 w-4 animate-spin" />
                      Učitavanje doza...
                    </p>
                  ) : alternativeDosesError ? (
                    <p className="mt-3 text-sm font-semibold text-amber-700">
                      {alternativeDosesError}
                    </p>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedAlternativeDoses.map((dose) => {
                        const selected = selectedAlternativeDoseIds.includes(
                          dose.id
                        );

                        return (
                          <button
                            key={dose.id}
                            type="button"
                            onClick={() => onToggleAlternativeDose(dose.id)}
                            aria-pressed={selected}
                            className={`min-h-10 rounded-full border px-3 py-1.5 text-sm font-bold transition ${
                              selected
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:text-emerald-700"
                            }`}
                          >
                            {dose.strength}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={onSearchAlternative}
                    disabled={!canSearchAlternative || isAlternativeDosesLoading}
                    className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <Search className="h-4 w-4" />
                    Pretraži ovu alternativu
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

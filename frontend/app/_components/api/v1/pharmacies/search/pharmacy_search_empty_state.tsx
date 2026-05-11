import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
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
  const allAlternativeDosesSelected =
    selectedAlternativeDoses.length > 0 &&
    selectedAlternativeDoses.every((dose) =>
      selectedAlternativeDoseIds.includes(dose.id)
    );

  const handleToggleAllAlternativeDoses = () => {
    if (allAlternativeDosesSelected) {
      selectedAlternativeDoseIds.forEach((doseId) =>
        onToggleAlternativeDose(doseId)
      );
      return;
    }

    selectedAlternativeDoses.forEach((dose) => {
      if (!selectedAlternativeDoseIds.includes(dose.id)) {
        onToggleAlternativeDose(dose.id);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-fade-in sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
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

          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
            <button
              type="button"
              onClick={onLoadAlternatives}
              disabled={!medicineId || isAlternativesLoading}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto"
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
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 sm:w-auto"
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
            <div className="mt-5 border-t border-slate-100 pt-4 sm:mt-6 sm:pt-5">
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

                  <div className="mt-4 grid gap-2.5 sm:gap-3">
                    {alternatives.map((alternative) => {
                      const selected = selectedAlternative?.id === alternative.id;
                      const detailsId = `alternative-details-${alternative.id}`;

                      return (
                        <article
                          key={alternative.id}
                          className={`overflow-hidden rounded-2xl border bg-white transition ${
                            selected
                              ? "border-blue-300 shadow-sm shadow-blue-100"
                              : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50"
                          }`}
                        >
                          <div className="p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                                <button
                                  type="button"
                                  onClick={() => onSelectAlternative(alternative)}
                                  className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition ${
                                    selected
                                      ? "border-blue-300 bg-blue-100 text-blue-700"
                                      : "border-blue-200/80 bg-blue-50/60 text-blue-500 hover:border-blue-300 hover:text-blue-700"
                                  }`}
                                  aria-label={`Izaberi alternativu ${alternative.name}`}
                                >
                                  {selected ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    "○"
                                  )}
                                </button>

                                <div className="min-w-0 flex-1">
                                  <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                                    {alternative.name}
                                  </h3>
                                  <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">
                                    {alternative.description ||
                                      "Opis alternative nije dostupan."}
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-2 self-stretch sm:self-start">
                                <button
                                  type="button"
                                  onClick={() => onLoadMedicineDetails(alternative.id)}
                                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-blue-200/80 bg-blue-50/70 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm shadow-blue-100/80 transition hover:bg-blue-100 sm:w-auto"
                                >
                                  Detalji
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {selected && (
                            <div
                              id={detailsId}
                              className="border-t border-slate-200 px-4 py-4"
                            >
                              <p className="mb-3 text-sm font-semibold text-slate-700 sm:mb-4">
                                Odaberite dozu
                              </p>

                              {isAlternativeDosesLoading ? (
                                <div className="flex flex-wrap gap-2">
                                  {[1, 2, 3, 4].map((item) => (
                                    <div
                                      key={item}
                                      className="h-7 w-16 animate-pulse rounded-full bg-slate-200"
                                    />
                                  ))}
                                </div>
                              ) : alternativeDosesError ? (
                                <p className="text-sm font-semibold text-amber-700">
                                  {alternativeDosesError}
                                </p>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={handleToggleAllAlternativeDoses}
                                    disabled={selectedAlternativeDoses.length === 0}
                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                      allAlternativeDosesSelected
                                        ? "border border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    }`}
                                  >
                                    Sve
                                  </button>

                                  {selectedAlternativeDoses.map((dose) => {
                                    const doseSelected =
                                      selectedAlternativeDoseIds.includes(dose.id);

                                    return (
                                      <button
                                        key={dose.id}
                                        type="button"
                                        onClick={() => onToggleAlternativeDose(dose.id)}
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                          doseSelected
                                            ? "border border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                                            : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                      >
                                        {dose.strength}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </>
              )}

              {selectedAlternative && (
                <button
                  type="button"
                  onClick={onSearchAlternative}
                  disabled={!canSearchAlternative || isAlternativeDosesLoading}
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Search className="h-4 w-4" />
                  Pretraži ovu alternativu
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

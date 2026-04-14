import { ChevronRight, Info } from "lucide-react";
import { Medicine } from "./types";

type SearchResultsProps = {
  trimmedSearch: string;
  filteredMedicines: Medicine[];
  selectedMedicineId: number | null;
  detailsMedicineId: number | null;
  handleSelectMedicine: (medicineId: number) => void;
  handleToggleDetails: (medicineId: number) => void;
};

export default function SearchResults({
  trimmedSearch,
  filteredMedicines,
  selectedMedicineId,
  detailsMedicineId,
  handleSelectMedicine,
  handleToggleDetails,
}: SearchResultsProps) {
    return (
        <div className="mt-8">
            <div className="mb-5">
                <p className="text-sm text-slate-500">
                Rezultati pretrage:{" "}
                <span className="font-semibold text-slate-900">
                    {trimmedSearch}
                </span>
                </p>
            </div>

            {filteredMedicines.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 text-slate-500">
                    <Info className="h-5 w-5" />
                    </div>

                    <div>
                    <h3 className="text-base font-semibold text-slate-900">
                        Nema rezultata
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        Nismo pronašli lijek za pojam <b>{trimmedSearch}</b>.
                    </p>
                    </div>
                </div>
                </div>
            ) : (
                <div className="grid gap-4">
                {filteredMedicines.map((medicine) => {
                    const isSelected = selectedMedicineId === medicine.id;
                    const detailsOpen = detailsMedicineId === medicine.id;

                    return (
                        <article
                            key={medicine.id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_26px_-18px_rgba(15,23,42,0.35),0_6px_16px_-12px_rgba(37,99,235,0.32)]"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                                <button
                                type="button"
                                onClick={() => handleSelectMedicine(medicine.id)}
                                className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition ${
                                    isSelected
                                    ? "border-blue-300 bg-blue-100 text-blue-700"
                                    : "border-blue-200/80 bg-blue-50/60 text-blue-500 hover:border-blue-300 hover:text-blue-700"
                                }`}
                                aria-label={`Izaberi lijek ${medicine.name}`}
                                >
                                {isSelected ? "●" : "○"}
                                </button>

                                <div>
                                <h3 className="text-xl font-semibold text-slate-900">
                                    {medicine.name}
                                </h3>
                                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                                    {medicine.description}
                                </p>
                                </div>
                            </div>

                            <div className="flex gap-2 self-start">
                                <button
                                type="button"
                                onClick={() => handleToggleDetails(medicine.id)}
                                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                                    detailsOpen
                                                                        ? "border-blue-200 bg-blue-600 text-white shadow-md shadow-blue-200/70 hover:bg-blue-700"
                                                                        : "border-blue-200/80 bg-blue-50/70 text-blue-700 shadow-sm shadow-blue-100/80 hover:bg-blue-100"
                                }`}
                                >
                                Detalji
                                                                <ChevronRight
                                                                    className={`h-4 w-4 transition-transform duration-200 ${
                                                                        detailsOpen ? "rotate-90" : "rotate-0"
                                                                    }`}
                                                                />
                                </button>

                                
                            </div>
                            </div>
                        </article>
                    );
                })}
                </div>
            )}
            </div>
        )
}

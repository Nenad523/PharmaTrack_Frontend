import { Info } from "lucide-react";


export default function SearchResults({
  trimmedSearch,
  filteredMedicines,
  selectedMedicineId,
  detailsMedicineId,
  handleSelectMedicine,
  handleToggleDetails,
}: any) {
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
                {filteredMedicines.map((medicine: any) => {
                    const isSelected = selectedMedicineId === medicine.id;
                    const detailsOpen = detailsMedicineId === medicine.id;

                    return (
                        <article
                            key={medicine.id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                                <button
                                type="button"
                                onClick={() => handleSelectMedicine(medicine.id)}
                                className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition ${
                                    isSelected
                                    ? "border-blue-200 bg-blue-50 text-blue-600"
                                    : "border-slate-200 bg-white text-slate-400 hover:border-blue-200 hover:text-blue-600"
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
                                    ? "border-blue-200 bg-blue-600 text-white hover:bg-blue-700"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-600"
                                }`}
                                >
                                Detalji
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

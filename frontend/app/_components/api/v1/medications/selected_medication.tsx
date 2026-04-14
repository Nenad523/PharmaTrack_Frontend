import { CheckCircle2 } from "lucide-react";
import { Medicine } from "./types";

type SelectedMedicationProps = {
  selectedMedicine: Medicine;
  detailsMedicineId: number | null;
  handleSelectMedicine: (medicineId: number) => void;
  handleToggleDetails: (medicineId: number) => void;
  handleDoseClick: (dose: string, allDoses: string[]) => void;
  isDoseActive: (dose: string, allDoses: string[]) => boolean;
};

export default function SelectedMedication({
  selectedMedicine,
  detailsMedicineId,
  handleSelectMedicine,
  handleToggleDetails,
  handleDoseClick,
  isDoseActive,
}: SelectedMedicationProps) {
    return(
                  <div className="mt-8">
                    <article className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
                      <div className="p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-start gap-4">
                            <button
                              type="button"
                              onClick={() => handleSelectMedicine(selectedMedicine.id)}
                              className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                              aria-label={`Poništi izbor lijeka ${selectedMedicine.name}`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
    
                            <div>
                              <h3 className="text-xl font-semibold text-slate-900">
                                {selectedMedicine.name}
                              </h3>
                              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                                {selectedMedicine.description}
                              </p>
                            </div>
                          </div>
    
                          <div className="flex gap-2 self-start">
                            <button
                              type="button"
                              onClick={() => handleToggleDetails(selectedMedicine.id)}
                              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                                detailsMedicineId === selectedMedicine.id
                                  ? "border-blue-200 bg-blue-600 text-white hover:bg-blue-700"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-600"
                              }`}
                            >
                              Detalji
                            </button>
    
                            
                          </div>
                        </div>
                      </div>
    
                      <div className="border-t border-slate-200 px-5 py-5">
                        <p className="mb-4 text-sm font-semibold text-slate-700">
                          Odaberite dozu
                        </p>
    
                        <div className="flex flex-wrap gap-2">
                          {selectedMedicine.doses.map((dose) => {
                            const active = isDoseActive(dose, selectedMedicine.doses);
    
                            return (
                              <button
                                key={dose}
                                type="button"
                                onClick={() =>
                                  handleDoseClick(dose, selectedMedicine.doses)
                                }
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                  active
                                    ? "border border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                }`}
                              >
                                {dose}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </article>
                  </div>
    )
}

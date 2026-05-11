import { AlertTriangle } from "lucide-react";
import PopularMedicine from "./popular_medicine";
import SearchBar from "./search_bar";
import SearchBarTitleText from "./search_bar_title";
import SearchButton from "./search_button";
import SearchResults from "./search_results";
import SelectedMedication from "./selected_medication";
import { MedicationDose, MedicineSearchResult } from "./types";

type MedicationsContentProps = {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
  hasMinimumChars: boolean;
  popularMedicines: string[];
  handlePopularClick: (medicineName: string) => void;
  trimmedSearch: string;
  filteredMedicines: MedicineSearchResult[];
  selectedMedicineId: number | null;
  selectedMedicineDoses: MedicationDose[];
  isLoadingDoses: boolean;
  detailsMedicineId: number | null;
  selectedMedicine: MedicineSearchResult | undefined;
  handleSelectMedicine: (medicineId: number) => void;
  handleToggleDetails: (medicineId: number) => void;
  handleDoseClick: (dose: MedicationDose | "all") => void;
  isDoseActive: (dose: MedicationDose | "all") => boolean;
  isSearchButtonEnabled: boolean;
  onSearchPharmacies: () => void;
  mode?: "medication" | "symptom";
};

export default function MedicationsContent({
  handleSearchChange,
  searchTerm,
  hasMinimumChars,
  popularMedicines,
  handlePopularClick,
  trimmedSearch,
  filteredMedicines,
  selectedMedicineId,
  selectedMedicineDoses,
  isLoadingDoses,
  detailsMedicineId,
  selectedMedicine,
  handleSelectMedicine,
  handleToggleDetails,
  handleDoseClick,
  isDoseActive,
  isSearchButtonEnabled,
  onSearchPharmacies,
  mode = "medication",
}: MedicationsContentProps) {
  return (
    <div className="flex-1 max-w-2xl rounded-[24px] border border-blue-200/90 bg-white p-4 shadow-[0_22px_50px_-24px_rgba(37,99,235,0.5),0_10px_20px_-14px_rgba(15,23,42,0.3),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur sm:p-5 md:rounded-[28px] md:p-8">
      <SearchBarTitleText mode={mode} />

      <SearchBar
        handleSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        mode={mode}
      />

      {!hasMinimumChars && mode === "symptom" && (
        <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 px-3 py-3 sm:mt-8 sm:px-4 sm:py-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white/80 p-2 text-amber-500 shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Važna napomena</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Preporuke na osnovu simptoma služe isključivo u{" "}
                <span className="font-semibold">informativne svrhe</span> i ne
                predstavljaju zamjenu za stručno mišljenje farmaceuta ili ljekara.
                Prije upotrebe bilo kojeg lijeka obavezno pročitajte uputstvo i
                konsultujte se sa stručnim licem.
              </p>
            </div>
          </div>
        </div>
      )}

      {!hasMinimumChars && mode === "medication" && (
        <PopularMedicine
          popularMedicines={popularMedicines}
          handlePopularClick={handlePopularClick}
        />
      )}

      {hasMinimumChars && !selectedMedicine && (
        <SearchResults
          trimmedSearch={trimmedSearch}
          filteredMedicines={filteredMedicines}
          selectedMedicineId={selectedMedicineId}
          detailsMedicineId={detailsMedicineId}
          handleSelectMedicine={handleSelectMedicine}
          handleToggleDetails={handleToggleDetails}
        />
      )}

      {hasMinimumChars && selectedMedicine && (
        <SelectedMedication
          selectedMedicine={selectedMedicine}
          selectedMedicineDoses={selectedMedicineDoses}
          isLoadingDoses={isLoadingDoses}
          detailsMedicineId={detailsMedicineId}
          handleSelectMedicine={handleSelectMedicine}
          handleToggleDetails={handleToggleDetails}
          handleDoseClick={handleDoseClick}
          isDoseActive={isDoseActive}
        />
      )}

      <SearchButton
        isSearchButtonEnabled={isSearchButtonEnabled}
        onSearchPharmacies={onSearchPharmacies}
      />
    </div>
  );
}

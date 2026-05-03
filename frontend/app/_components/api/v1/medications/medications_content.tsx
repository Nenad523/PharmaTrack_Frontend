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
}: MedicationsContentProps) {
  return (
    <div className="flex-1 rounded-[28px] border border-blue-200/90 bg-white p-6 shadow-[0_22px_50px_-24px_rgba(37,99,235,0.5),0_10px_20px_-14px_rgba(15,23,42,0.3),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur md:p-8">
      <SearchBarTitleText />

      <SearchBar
        handleSearchChange={handleSearchChange}
        searchTerm={searchTerm}
      />

      {!hasMinimumChars && (
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

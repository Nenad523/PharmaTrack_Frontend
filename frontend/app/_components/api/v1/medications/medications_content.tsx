import PopularMedicine from "./popular_medicine";
import SearchBar from "./search_bar";
import SearchBarTitleText from "./search_bar_title";
import SearchButton from "./search_button";
import SearchResults from "./search_results";
import SelectedMedication from "./selected_medication";
import { Medicine } from "./types";

type MedicationsContentProps = {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
  hasMinimumChars: boolean;
  popularMedicines: string[];
  handlePopularClick: (medicineName: string) => void;
  trimmedSearch: string;
  filteredMedicines: Medicine[];
  selectedMedicineId: number | null;
  detailsMedicineId: number | null;
  selectedMedicine: Medicine | undefined;
  handleSelectMedicine: (medicineId: number) => void;
  handleToggleDetails: (medicineId: number) => void;
  handleDoseClick: (dose: string, allDoses: string[]) => void;
  isDoseActive: (dose: string, allDoses: string[]) => boolean;
  isSearchButtonEnabled: boolean;
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
  detailsMedicineId,
  selectedMedicine,
  handleSelectMedicine,
  handleToggleDetails,
  handleDoseClick,
  isDoseActive,
  isSearchButtonEnabled,
}: MedicationsContentProps) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur md:p-8 flex-1">
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
          detailsMedicineId={detailsMedicineId}
          handleSelectMedicine={handleSelectMedicine}
          handleToggleDetails={handleToggleDetails}
          handleDoseClick={handleDoseClick}
          isDoseActive={isDoseActive}
        />
      )}

      <SearchButton isSearchButtonEnabled={isSearchButtonEnabled} />
    </div>
  );
}

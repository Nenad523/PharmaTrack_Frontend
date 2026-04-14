"use client";

import { useMemo, useState } from "react";
import SearchBarTitleText from "../../../_components/api/v1/medications/search_bar_title";
import SearchBar from "../../../_components/api/v1/medications/search_bar";
import PopularMedicine from "../../../_components/api/v1/medications/popular_medicine";
import SearchResults from "../../../_components/api/v1/medications/search_results";
import SelectedMedication from "../../../_components/api/v1/medications/selected_medication";
import SearchButton from "../../../_components/api/v1/medications/search_button";
import MedicineDetailsPanel from "../../../_components/api/v1/medications/MedicineDetailsPanel/medicine_details_panel";



type Medicine = {
  id: number;
  name: string;
  description: string;
  doses: string[];
  activeSubstance: string;
  warning: string;
};

const popularMedicines = [
  "Paracetamol",
  "Ibuprofen",
  "Amoksicilin",
  "Aspirin",
  "Brufen",
  "Andol",
  "Panklav",
];

const medicines: Medicine[] = [
  {
    id: 1,
    name: "Paracetamol",
    description:
      "Analgetik i antipiretik za ublažavanje bola i snižavanje temperature.",
    doses: ["Sve", "500 mg", "1000 mg", "1500 mg"],
    activeSubstance: "Paracetamol",
    warning: "Ne prelaziti preporučenu dnevnu dozu. Koristiti oprezno kod bolesti jetre.",
  },
  {
    id: 2,
    name: "Paracetamol Extra",
    description: "Paracetamol sa kofeinom za pojačano djelovanje protiv bola.",
    doses: ["Sve", "500 mg"],
    activeSubstance: "Paracetamol + kofein",
    warning: "Sadrži kofein. Izbjegavati kasno uveče i kod osjetljivosti na stimulanse.",
  },
  {
    id: 3,
    name: "Ibuprofen",
    description: "Nesteroidni antiinflamatorni lijek za bol i upale.",
    doses: ["Sve", "200 mg", "400 mg"],
    activeSubstance: "Ibuprofen",
    warning: "Ne preporučuje se osobama sa čirom na želucu bez savjeta ljekara.",
  },
  {
    id: 4,
    name: "Brufen",
    description: "Lijek za ublažavanje bolova, upala i povišene temperature.",
    doses: ["Sve", "200 mg", "400 mg", "600 mg"],
    activeSubstance: "Ibuprofen",
    warning: "Koristiti oprezno kod problema sa želucem, bubrezima i pritiskom.",
  },
];



export default function MedicationsSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicineId, setSelectedMedicineId] = useState<number | null>(null);
  const [selectedDoses, setSelectedDoses] = useState<string[]>([]);
  const [detailsMedicineId, setDetailsMedicineId] = useState<number | null>(null);
  
  const trimmedSearch = searchTerm.trim();
  const hasMinimumChars = trimmedSearch.length >= 3;

  const filteredMedicines = useMemo(() => {
    if (!hasMinimumChars) return [];

    return medicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(trimmedSearch.toLowerCase())
    );
  }, [trimmedSearch, hasMinimumChars]);

  const selectedMedicine = filteredMedicines.find(
    (medicine) => medicine.id === selectedMedicineId
  );

  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedMedicineId(null);
    setSelectedDoses([]);
    setDetailsMedicineId(null);
  };

  const handlePopularClick = (medicineName: string) => {
    setSearchTerm(medicineName);
    setSelectedMedicineId(null);
    setSelectedDoses([]);
    setDetailsMedicineId(null);
  };

  const handleSelectMedicine = (medicineId: number) => {
    setSelectedMedicineId((prev) => (prev === medicineId ? null : medicineId));
    setSelectedDoses([]);
  };

  const handleToggleDetails = (medicineId: number) => {
    setDetailsMedicineId((prev) => (prev === medicineId ? null : medicineId));
  };

  const handleDoseClick = (dose: string, allDoses: string[]) => {
    const individualDoses = allDoses.filter((d) => d !== "Sve");

    if (dose === "Sve") {
      const allSelected = individualDoses.every((d) => selectedDoses.includes(d));

      if (allSelected) {
        setSelectedDoses([]);
      } else {
        setSelectedDoses(individualDoses);
      }

      return;
    }
    

    setSelectedDoses((prev) =>
      prev.includes(dose) ? prev.filter((d) => d !== dose) : [...prev, dose]
    );
  };

  const detailsMedicine =
      filteredMedicines.find((medicine) => medicine.id === detailsMedicineId) ??
      medicines.find((medicine) => medicine.id === detailsMedicineId) ??
      null;
  const isDoseActive = (dose: string, allDoses: string[]) => {
    const individualDoses = allDoses.filter((d) => d !== "Sve");

    if (dose === "Sve") {
      return (
        individualDoses.length > 0 &&
        individualDoses.every((d) => selectedDoses.includes(d))
      );
    }

    return selectedDoses.includes(dose);
  };

  const isSearchButtonEnabled =
    Boolean(selectedMedicine) && selectedDoses.length > 0;


  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_65%)]" />
      <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 md:pt-20">
        <div className="flex justify-center">
          <div
            className={`flex gap-8 ${
              detailsMedicine
                ? "max-w-7xl"
                : "max-w-7xl justify-center"
            }`}
          >
          <div
            className={`rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur md:p-8 flex-1`}
          >  
            {/* tekst na vrhu search boxa */}
            <SearchBarTitleText /> 

            {/* input za pretragu */}
            <SearchBar
              handleSearchChange={handleSearchChange}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedMedicineId={selectedMedicineId}
              setSelectedMedicineId={setSelectedMedicineId}
              selectedDoses={selectedDoses}
              setSelectedDoses={setSelectedDoses}
              detailsMedicineId={detailsMedicineId}
              setDetailsMedicineId={setDetailsMedicineId}
            />

            {/* ako nema dovoljno karaktera, prikazuju se popularni lijekovi */}

            {!hasMinimumChars && (
                <PopularMedicine
                popularMedicines={popularMedicines}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                hasMinimumChars={hasMinimumChars}
                handlePopularClick={handlePopularClick}
                />
            )}
            
            {/* ako ima dovoljno karaktera, prikazuju se rezultati pretrage */}

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

            {/* ako je odabran lijek, prikazuju se informacije o njemu */}

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

            {/* dugme za pretragu */}
            <SearchButton 
            isSearchButtonEnabled={isSearchButtonEnabled}
            />
          </div>

          {/* DESNI PANEL */}
          {detailsMedicine && (
            <div className="w-[380px] transition-all duration-300">
              <MedicineDetailsPanel
                medicine={detailsMedicine}
                onClose={() => setDetailsMedicineId(null)}
              />
            </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}



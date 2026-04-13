"use client";

import { useMemo, useState } from "react";
import SearchBarTitleText from "../../../_components/api/v1/medications/search_bar_title";
import SearchBar from "../../../_components/api/v1/medications/search_bar";
import PopularMedicine from "../../../_components/api/v1/medications/popular_medicine";
import SearchResults from "../../../_components/api/v1/medications/search_results";
import SelectedMedication from "../../../_components/api/v1/medications/selected_medication";
import SearchButton from "../../../_components/api/v1/medications/search_button";




type Medicine = {
  id: number;
  name: string;
  description: string;
  doses: string[];
  activeSubstance: string;
  usage: string;
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
    usage: "Koristi se za snižavanje temperature i ublažavanje blagih do umjerenih bolova.",
    warning: "Ne prelaziti preporučenu dnevnu dozu. Koristiti oprezno kod bolesti jetre.",
  },
  {
    id: 2,
    name: "Paracetamol Extra",
    description: "Paracetamol sa kofeinom za pojačano djelovanje protiv bola.",
    doses: ["Sve", "500 mg"],
    activeSubstance: "Paracetamol + kofein",
    usage: "Za glavobolju, zubobolju i bolove uz pojačano analgetsko djelovanje.",
    warning: "Sadrži kofein. Izbjegavati kasno uveče i kod osjetljivosti na stimulanse.",
  },
  {
    id: 3,
    name: "Ibuprofen",
    description: "Nesteroidni antiinflamatorni lijek za bol i upale.",
    doses: ["Sve", "200 mg", "400 mg"],
    activeSubstance: "Ibuprofen",
    usage: "Koristi se za bolove, upalne procese i snižavanje temperature.",
    warning: "Ne preporučuje se osobama sa čirom na želucu bez savjeta ljekara.",
  },
  {
    id: 4,
    name: "Brufen",
    description: "Lijek za ublažavanje bolova, upala i povišene temperature.",
    doses: ["Sve", "200 mg", "400 mg", "600 mg"],
    activeSubstance: "Ibuprofen",
    usage: "Za bolove u mišićima, zglobovima, temperaturu i različite upalne tegobe.",
    warning: "Koristiti oprezno kod problema sa želucem, bubrezima i pritiskom.",
  },
];

function MedicineDetailsPanel({
  medicine,
  onClose,
}: {
  medicine: Medicine;
  onClose: () => void;
}) {
  const availableDoses = medicine.doses.filter((dose) => dose !== "Sve");

  return (
    <aside className="w-full xl:sticky xl:top-24">
      <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
              Detalji lijeka
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {medicine.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
            aria-label={`Zatvori detalje za lijek ${medicine.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 pt-5">
          <div className="flex flex-wrap gap-2">
            {availableDoses.map((dose) => (
              <span
                key={dose}
                className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
              >
                {dose}
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 pt-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-blue-100 bg-white p-3 text-blue-600 shadow-sm">
                <Pill className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Kratak pregled
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {medicine.name} je dostupan u više jačina i može se dalje
                  pretraživati po odabranoj dozi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Opis</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {medicine.description}
            </p>
          </div>

          <div className="grid gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Aktivna supstanca
              </h3>
              <div className="mt-3">
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                  {medicine.activeSubstance}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">Upotreba</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {medicine.usage}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white/80 p-2 text-amber-500">
                <AlertTriangle className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Informativni prikaz
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {medicine.warning}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

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

      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 md:pt-20">
        <div className="flex justify-center">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur md:p-8">
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

          
        </div>
      </section>
    </div>
  );
}

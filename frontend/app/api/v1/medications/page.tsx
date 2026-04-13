"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Pill,
  Search,
  TrendingUp,
  X,
} from "lucide-react";

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
    doses: ["Sve", "100 mg", "200 mg", "500 mg", "1000 mg"],
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

  const detailsMedicine =
    filteredMedicines.find((medicine) => medicine.id === detailsMedicineId) ??
    medicines.find((medicine) => medicine.id === detailsMedicineId) ??
    null;
  const isDetailsPanelOpen = Boolean(detailsMedicine);

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

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 md:pt-20">
        <div
          className={`grid items-start gap-8 transition-all duration-300 ${
            isDetailsPanelOpen ? "xl:grid-cols-[minmax(0,1fr)_24rem]" : ""
          }`}
        >
          <div
            className={`w-full transition-all duration-300 ${
              isDetailsPanelOpen ? "max-w-5xl xl:mr-auto" : "mx-auto max-w-5xl"
            }`}
          >
            <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur md:p-8">
              <div className="mb-8 flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-sm">
                    <Pill className="h-7 w-7" />
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Pretraga ljekova
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
                    Pronađite dostupne ljekove, odaberite željenu dozu i nastavite
                    ka pretrazi apoteka širom Crne Gore.
                  </p>
                </div>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Unesite naziv lijeka (min. 3 karaktera)"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white"
                />
              </div>

              {!hasMinimumChars && (
                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-slate-500" />
                    <h2 className="text-sm font-semibold text-slate-700">
                      Popularno
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {popularMedicines.map((medicine) => (
                      <button
                        key={medicine}
                        type="button"
                        onClick={() => handlePopularClick(medicine)}
                        className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
                      >
                        {medicine}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {hasMinimumChars && !selectedMedicine && (
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
            )}

            {hasMinimumChars && selectedMedicine && (
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
            )}

            <div className="mt-8">
              <button
                type="button"
                disabled={!isSearchButtonEnabled}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold transition ${
                  isSearchButtonEnabled
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                    : "cursor-not-allowed bg-slate-200 text-slate-500"
                }`}
              >
                <Search className="h-4 w-4" />
                Pretraži apoteke
              </button>
            </div>
            </div>
          </div>

          {detailsMedicine && (
            <MedicineDetailsPanel
              medicine={detailsMedicine}
              onClose={() => setDetailsMedicineId(null)}
            />
          )}
        </div>
      </section>
    </div>
  );
}

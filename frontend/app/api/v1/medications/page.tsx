"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";
import { popularMedicines } from "../../../_components/api/v1/medications/data";
import MedicationsContent from "../../../_components/api/v1/medications/medications_content";
import MedicineDetailsPanel from "../../../_components/api/v1/medications/MedicineDetailsPanel/medicine_details_panel";
import {
  MedicineDetails,
  MedicationDetailsApiResponse,
  MedicationDosesApiResponse,
  MedicationSearchApiResponse,
  MedicineSearchResult,
} from "../../../_components/api/v1/medications/types";

const DEFAULT_WARNING =
  "Prikazane informacije služe isključivo u informativne svrhe i ne predstavljaju zamjenu za savjet ljekara ili farmaceuta.";

export default function MedicationsSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicineId, setSelectedMedicineId] = useState<number | null>(null);
  const [selectedDoses, setSelectedDoses] = useState<string[]>([]);
  const [selectedMedicineDoses, setSelectedMedicineDoses] = useState<string[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<MedicineSearchResult[]>([]);
  const [isLoadingDoses, setIsLoadingDoses] = useState(false);
  const [detailsMedicineId, setDetailsMedicineId] = useState<number | null>(null);
  const [detailsMedicine, setDetailsMedicine] = useState<MedicineDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const trimmedSearch = searchTerm.trim();
  const hasMinimumChars = trimmedSearch.length >= 3;
  const shouldShowDetailsPanel =
    isDetailsLoading || Boolean(detailsError) || Boolean(detailsMedicine);

  const selectedMedicine = filteredMedicines.find(
    (medicine) => medicine.id === selectedMedicineId
  );

  useEffect(() => {
    if (!hasMinimumChars) {
      setFilteredMedicines([]);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          apiUrl(`/api/v1/medication/search?name=${encodeURIComponent(trimmedSearch)}`),
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch medicines.");
        }

        const data = (await response.json()) as MedicationSearchApiResponse;
        setFilteredMedicines(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        if (
          error instanceof Error &&
          (error.name === "AbortError" || controller.signal.aborted)
        ) {
          return;
        }

        setFilteredMedicines([]);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [trimmedSearch, hasMinimumChars]);

  useEffect(() => {
    if (selectedMedicineId === null) {
      setSelectedMedicineDoses([]);
      setIsLoadingDoses(false);
      return;
    }

    const controller = new AbortController();

    const loadSelectedDoses = async () => {
      setIsLoadingDoses(true);

      try {
        const response = await fetch(
          apiUrl(`/api/v1/medication/${selectedMedicineId}/doses`),
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doses.");
        }

        const data = (await response.json()) as MedicationDosesApiResponse;
        const doses = Array.isArray(data.data)
          ? data.data.map((dose) => dose.strength).filter(Boolean)
          : [];

        setSelectedMedicineDoses(doses);
      } catch (error) {
        if (
          error instanceof Error &&
          (error.name === "AbortError" || controller.signal.aborted)
        ) {
          return;
        }

        setSelectedMedicineDoses([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingDoses(false);
        }
      }
    };

    void loadSelectedDoses();

    return () => {
      controller.abort();
    };
  }, [selectedMedicineId]);

  const closeDetailsPanel = () => {
    setDetailsMedicineId(null);
    setDetailsMedicine(null);
    setDetailsError("");
    setIsDetailsLoading(false);
  };

  const getErrorMessage = async (response: Response) => {
    try {
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = (await response.json()) as {
          error?: { message?: string | string[] };
          message?: string | string[];
        };

        const message = data.error?.message ?? data.message;

        if (Array.isArray(message)) {
          return message.join(", ");
        }

        return message || "Detalji nijesu dostupni.";
      }

      const text = await response.text();
      return text || "Detalji nijesu dostupni.";
    } catch {
      return "Detalji nijesu dostupni.";
    }
  };

  const mapDetailsToMedicine = (
    details: MedicationDetailsApiResponse,
    doses: MedicationDosesApiResponse
  ): MedicineDetails => {
    const activeIngredients = Array.isArray(details.data.activeIngredients)
      ? details.data.activeIngredients
      : [];
    const availableDoses = Array.isArray(doses.data)
      ? doses.data.map((dose) => dose.strength)
      : [];

    return {
      id: details.data.id,
      name: details.data.name,
      description: details.data.description,
      doses: ["Sve", ...availableDoses],
      activeSubstance:
        activeIngredients.length > 0
          ? activeIngredients.map((item) => item.name).join(", ")
          : "Nije dostupno",
      warning: DEFAULT_WARNING,
      activeIngredients,
    };
  };

  const loadMedicineDetails = async (medicineId: number) => {
    if (detailsMedicineId === medicineId) {
      closeDetailsPanel();
      return;
    }

    setDetailsMedicineId(medicineId);
    setDetailsMedicine(null);
    setDetailsError("");
    setIsDetailsLoading(true);

    try {
      const [detailsResponse, dosesResponse] = await Promise.all([
        fetch(apiUrl(`/api/v1/medication/${medicineId}`)),
        fetch(apiUrl(`/api/v1/medication/${medicineId}/doses`)),
      ]);

      if (!detailsResponse.ok) {
        setDetailsError(await getErrorMessage(detailsResponse));
        return;
      }

      if (!dosesResponse.ok) {
        setDetailsError(await getErrorMessage(dosesResponse));
        return;
      }

      const detailsData =
        (await detailsResponse.json()) as MedicationDetailsApiResponse;
      const dosesData = (await dosesResponse.json()) as MedicationDosesApiResponse;

      setDetailsMedicine(mapDetailsToMedicine(detailsData, dosesData));
    } catch {
      setDetailsError("Došlo je do greške pri učitavanju detalja lijeka.");
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedMedicineId(null);
    setSelectedDoses([]);
    setSelectedMedicineDoses([]);
    closeDetailsPanel();
  };

  const handlePopularClick = (medicineName: string) => {
    setSearchTerm(medicineName);
    setSelectedMedicineId(null);
    setSelectedDoses([]);
    setSelectedMedicineDoses([]);
    closeDetailsPanel();
  };

  const handleSelectMedicine = (medicineId: number) => {
    setSelectedMedicineId((prev) => (prev === medicineId ? null : medicineId));
    setSelectedDoses([]);
    setSelectedMedicineDoses([]);
  };

  const handleToggleDetails = (medicineId: number) => {
    void loadMedicineDetails(medicineId);
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-100/70 via-sky-50/80 to-white">
      <div className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.24),_transparent_70%)]" />
      <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/50 blur-3xl" />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 md:pt-20">
        <div className="flex justify-center">
          <div
            className={`flex gap-8 ${
              shouldShowDetailsPanel
                ? "max-w-7xl"
                : "max-w-7xl justify-center"
            }`}
          >
            <MedicationsContent
              handleSearchChange={handleSearchChange}
              searchTerm={searchTerm}
              hasMinimumChars={hasMinimumChars}
              popularMedicines={popularMedicines}
              handlePopularClick={handlePopularClick}
              trimmedSearch={trimmedSearch}
              filteredMedicines={filteredMedicines}
              selectedMedicineId={selectedMedicineId}
              selectedMedicineDoses={selectedMedicineDoses}
              isLoadingDoses={isLoadingDoses}
              detailsMedicineId={detailsMedicineId}
              selectedMedicine={selectedMedicine}
              handleSelectMedicine={handleSelectMedicine}
              handleToggleDetails={handleToggleDetails}
              handleDoseClick={handleDoseClick}
              isDoseActive={isDoseActive}
              isSearchButtonEnabled={isSearchButtonEnabled}
            />

            {shouldShowDetailsPanel && (
              <div className="xl:relative xl:z-20 xl:-ml-2 xl:w-[380px] xl:self-start">
                {isDetailsLoading ? (
                  <div className="rounded-[28px] border border-blue-200/80 bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold text-blue-600">
                      Učitavanje detalja...
                    </p>
                  </div>
                ) : detailsError ? (
                  <div className="rounded-[28px] border border-red-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold text-red-600">
                      Detalji nijesu dostupni.
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{detailsError}</p>
                    <button
                      type="button"
                      onClick={closeDetailsPanel}
                      className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Zatvori
                    </button>
                  </div>
                ) : (
                  detailsMedicine && (
                    <MedicineDetailsPanel
                      medicine={detailsMedicine}
                      onClose={closeDetailsPanel}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

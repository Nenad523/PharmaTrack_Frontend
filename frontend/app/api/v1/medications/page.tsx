/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { popularMedicines } from "../../../_components/api/v1/medications/data";
import MedicationsContent from "../../../_components/api/v1/medications/medications_content";
import MedicineDetailsPanel from "../../../_components/api/v1/medications/MedicineDetailsPanel/medicine_details_panel";
import { MedicineSearchResult, MedicineDetails } from "../../../_components/api/v1/medications/types";

export default function MedicationsSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicineId, setSelectedMedicineId] = useState<number | null>(null);
  const [selectedDoses, setSelectedDoses] = useState<string[]>([]);
  const [detailsMedicineId, setDetailsMedicineId] = useState<number | null>(null);
  const [medicineDoses, setMedicineDoses] = useState<string[]>([]);
  const [selectedMedicineDoses, setSelectedMedicineDoses] = useState<string[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<MedicineSearchResult[]>([]);
  const [detailsMedicineData, setDetailsMedicineData] = useState<MedicineDetails | null>(null);
  const [isLoadingDoses, setIsLoadingDoses] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const trimmedSearch = searchTerm.trim();
  const hasMinimumChars = trimmedSearch.length >= 3;

  useEffect(() => {
    if (!hasMinimumChars) {
      setFilteredMedicines([]);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/medication/search?name=${trimmedSearch}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch medicines.");
        }
        const data = await response.json();
        setFilteredMedicines(data.data);
      } catch (error: any) {
        if (error.name === "AbortError") return; // fetch je prekinut, ignoriši
        console.error(error);
        setFilteredMedicines([]);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [trimmedSearch, hasMinimumChars, apiUrl]);

  const selectedMedicine = filteredMedicines.find(
    (medicine) => medicine.id === selectedMedicineId
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedMedicineId(null);
    setSelectedDoses([]);
    setSelectedMedicineDoses([]);
    setDetailsMedicineId(null);
  };

  const handlePopularClick = (medicineName: string) => {
    setSearchTerm(medicineName);
    setSelectedMedicineId(null);
    setSelectedDoses([]);
    setSelectedMedicineDoses([]);
    setDetailsMedicineId(null);
  };

  const handleSelectMedicine = (medicineId: number) => {
    setSelectedMedicineId((prev) => (prev === medicineId ? null : medicineId));
    setSelectedDoses([]);
    setSelectedMedicineDoses([]);
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



  useEffect(() => {
    if (detailsMedicineId === null) {
      setMedicineDoses([]);
      setDetailsMedicineData(null);
      return;
    }

    const loadDetails = async () => {
      try {
        const [dosesResponse, detailsResponse] = await Promise.all([
          fetch(`${apiUrl}/api/v1/medication/${detailsMedicineId}/doses`),
          fetch(`${apiUrl}/api/v1/medication/${detailsMedicineId}`),
        ]);

        if (!dosesResponse.ok) throw new Error("Failed to fetch doses");
        if (!detailsResponse.ok) throw new Error("Failed to fetch details");

        const dosesData = await dosesResponse.json();
        const detailsData = await detailsResponse.json();

        const doses = dosesData.data
          .map((row: { strength: string }) => row.strength)
          .filter((s: string) => Boolean(s));

        setMedicineDoses(doses);
        setDetailsMedicineData(detailsData.data);
      } catch (error) {
        console.error(error);
        setMedicineDoses([]);
        setDetailsMedicineData(null);
      }
    };

    loadDetails();
  }, [detailsMedicineId, apiUrl]);

  useEffect(() => {
    if (selectedMedicineId === null) {
      setSelectedMedicineDoses([]);
      setIsLoadingDoses(false);
      return;
    }

    setIsLoadingDoses(true);

    const loadSelectedDoses = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/medication/${selectedMedicineId}/doses`);
        if (!response.ok) {
          throw new Error("Failed to fetch doses");
        }

        const data = await response.json();
        const doses = data.data.map((row: { strength: string }) => row.strength).filter((s: string) => Boolean(s));
        setSelectedMedicineDoses(doses);
      } catch (error) {
        console.error(error);
        setSelectedMedicineDoses([]);
      } finally {
        setIsLoadingDoses(false);
      }
    };

    loadSelectedDoses();
  }, [selectedMedicineId, apiUrl]);


  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-100/70 via-sky-50/80 to-white">
      <div className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.24),_transparent_70%)]" />
      <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/50 blur-3xl" />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 md:pt-20">
        <div className="flex justify-center">
          <div
            className={`flex gap-8 ${
              detailsMedicineData
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

            {detailsMedicineData && (
              <div className="xl:relative xl:z-20 xl:-ml-2 xl:w-[380px] xl:self-start">
                <MedicineDetailsPanel
                  medicine={detailsMedicineData}
                  doses={medicineDoses}
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
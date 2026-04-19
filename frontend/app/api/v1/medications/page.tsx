"use client";

import { useMemo, useState, useEffect } from "react";
import { medicines, popularMedicines } from "../../../_components/api/v1/medications/data";
import MedicationsContent from "../../../_components/api/v1/medications/medications_content";
import MedicineDetailsPanel from "../../../_components/api/v1/medications/MedicineDetailsPanel/medicine_details_panel";

export default function MedicationsSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicineId, setSelectedMedicineId] = useState<number | null>(null);
  const [selectedDoses, setSelectedDoses] = useState<string[]>([]);
  const [detailsMedicineId, setDetailsMedicineId] = useState<number | null>(null);
  const [medicineDoses, setMedicineDoses] = useState<string[]>([]);
  const [selectedMedicineDoses, setSelectedMedicineDoses] = useState<string[]>([]);

 
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
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

  const detailsMedicine =
    filteredMedicines.find((medicine) => medicine.id === detailsMedicineId) ??
    medicines.find((medicine) => medicine.id === detailsMedicineId) ??
    null;

  const detailsMedicineWithDoses = detailsMedicine
    ? { ...detailsMedicine, doses: medicineDoses }
    : null;

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

  useEffect(()=>{
      if(detailsMedicineId===null){
        setMedicineDoses([]);
        return;
      }
      const loadDoses = async () => {
        
        try{
          const response = await fetch(`${apiUrl}/api/v1/medication/${detailsMedicineId}/doses`);
          if(!response.ok){
            throw new Error("Failed to fetch doses");
          }

          const data = await response.json();
          
          const doses = data.data.map((row: { strength: string }) => row.strength).filter((s: string) => Boolean(s));
          setMedicineDoses(doses);
        }catch(error){
          console.error(error);
          setMedicineDoses([]);
        }
      };

      loadDoses();

  }, [detailsMedicineId, apiUrl]);

  useEffect(() => {
    if (selectedMedicineId === null) {
      setSelectedMedicineDoses([]);
      return;
    }

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
              detailsMedicine
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
              detailsMedicineId={detailsMedicineId}
              selectedMedicine={selectedMedicine}
              handleSelectMedicine={handleSelectMedicine}
              handleToggleDetails={handleToggleDetails}
              handleDoseClick={handleDoseClick}
              isDoseActive={isDoseActive}
              isSearchButtonEnabled={isSearchButtonEnabled}
            />

            {detailsMedicineWithDoses && (
              <div className="xl:relative xl:z-20 xl:-ml-2 xl:w-[380px] xl:self-start">
                <MedicineDetailsPanel
                  medicine={detailsMedicineWithDoses}
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
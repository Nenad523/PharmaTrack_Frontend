"use client";

import { useState, useMemo } from "react";

type Medicine = {
  id: number;
  name: string;
  description: string;
  doses: string[];
  
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
},
  {
    id: 2,
    name: "Paracetamol Extra",
    description: "Paracetamol sa kofeinom za pojačano djelovanje protiv bola.",
    doses: ["Sve", "500 mg"],
},
  {
    id: 3,
    name: "Ibuprofen",
    description: "Nesteroidni antiinflamatorni lijek za bol i upale.",
    doses: ["Sve", "200 mg", "400 mg"],
},
  {
    id: 4,
    name: "Brufen",
    description: "Lijek za ublažavanje bolova, upala i povišene temperature.",
    doses: ["Sve", "200 mg", "400 mg", "600 mg"],
  },
];

export default function MedicationsSearchPage() {
  const [searchTerm, setSearchTerm] = useState(""); //sta korisnik kuca u input
  const [selectedMedicineId, setSelectedMedicineId] = useState<number | null>(null);
  const [selectedDoses, setSelectedDoses] = useState<string[]>([]);
  
    const trimmedSearch = searchTerm.trim(); ///razmaci sa pocetka i kraja uklonjeni
    const hasMinimumChars = trimmedSearch.length >= 3;

    // vraca listu lijekova
    const filteredMedicines = useMemo(() => {
        
        if (!hasMinimumChars) return [];

        return medicines.filter((medicine) =>
            medicine.name.toLowerCase().includes(trimmedSearch.toLowerCase())
        );
    }, [trimmedSearch, hasMinimumChars]); 

    const selectedMedicine = filteredMedicines.find(
        (m) => m.id === selectedMedicineId
    );

    

  return (
    <div>
      
    </div>
  );
}

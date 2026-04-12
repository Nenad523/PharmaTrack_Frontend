"use client";

import { useState, useMemo } from "react";
import  Link  from "next/link";
import { ArrowLeft } from "lucide-react";

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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value); 
        setSelectedMedicineId(null);  
        setSelectedDoses([]);          
     
    };
    
    const handleSelectMedicine = (medicineId: number) => {
        setSelectedMedicineId((prev)=> prev === medicineId ? null : medicineId);
        setSelectedDoses([]);
    };

    const handleDoseClick = (dose: string, allDoses: string[]) => {
        const individualDoses = allDoses.filter((d) => d !== "Sve");

        if (dose === "Sve") {
           
            const allSelected = individualDoses.every((d) => selectedDoses.includes(d));
            setSelectedDoses(allSelected ? [] : individualDoses);
            return;
        }

        setSelectedDoses((prev) =>
            prev.includes(dose)
            ? prev.filter((d) => d !== dose) 
            : [...prev, dose]                 
        );
    }

    const isSearchButtonEnabled= Boolean(selectedMedicine && selectedDoses);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_65%)]" />
      <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-16 md:pt-20">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Nazad
          </Link>
        </div>

      
      </section>
    </div>
  );
}

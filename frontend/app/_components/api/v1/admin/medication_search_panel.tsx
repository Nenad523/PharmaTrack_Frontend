"use client";

import { Loader2, Search } from "lucide-react";
import type { MedicationDetails, MedicationSearchResult } from "./types";

type MedicationSearchPanelProps = {
  searchTerm: string;
  results: MedicationSearchResult[];
  selectedMedication: MedicationDetails | null;
  isSearching: boolean;
  onSearchChange: (value: string) => void;
  onSelectMedication: (medicationId: number) => void;
};

export function MedicationSearchPanel({
  searchTerm,
  results,
  selectedMedication,
  isSearching,
  onSearchChange,
  onSelectMedication,
}: MedicationSearchPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-950">Lijekovi</h2>
          <p className="mt-1 text-sm text-slate-500">
            Pretraga postojećih lijekova i izbor za administraciju.
          </p>
        </div>
        {isSearching && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
      </div>

      <label className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-300 focus-within:bg-white">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Unesi najmanje 3 karaktera"
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </label>

      <div className="mt-4 space-y-2">
        {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
          <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Za pretragu su potrebna najmanje 3 karaktera.
          </p>
        )}

        {searchTerm.trim().length >= 3 && !isSearching && results.length === 0 && (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
            Nema rezultata za ovu pretragu.
          </p>
        )}

        {results.map((medication) => {
          const isSelected = selectedMedication?.id === medication.id;

          return (
            <button
              key={medication.id}
              type="button"
              onClick={() => onSelectMedication(medication.id)}
              className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                isSelected
                  ? "border-blue-300 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-950">
                    {medication.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                    {medication.description || "Opis nije unesen."}
                  </p>
                </div>
                <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                  #{medication.id}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

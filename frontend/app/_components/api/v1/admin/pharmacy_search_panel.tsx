"use client";

import { Search } from "lucide-react";
import type { PharmacyDetails, PharmacySearchResult } from "./pharmacy_types";

type Props = {
  searchTerm: string;
  results: PharmacySearchResult[];
  selectedPharmacy: PharmacyDetails | null;
  isSearching: boolean;
  onSearchChange: (value: string) => void;
  onSelectPharmacy: (id: number) => void;
};

export function PharmacySearchPanel({
  searchTerm,
  results,
  selectedPharmacy,
  isSearching,
  onSearchChange,
  onSelectPharmacy,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-base font-semibold text-slate-900">Apoteke</h2>
      <p className="mb-3 text-xs text-slate-500">Pretraga postojećih apoteka i izbor za administraciju.</p>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Unesi naziv apoteke..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
        />
      </div>

      {isSearching && (
        <p className="mt-2 text-xs text-slate-400">Pretraga...</p>
      )}

      {results.length > 0 && (
        <ul className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-slate-100">
          {results.map((pharmacy) => (
            <li key={pharmacy.id}>
              <button
                type="button"
                onClick={() => onSelectPharmacy(pharmacy.id)}
                className={`w-full px-3 py-2 text-left text-sm transition hover:bg-blue-50 ${
                  selectedPharmacy?.id === pharmacy.id
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-slate-700"
                }`}
              >
                <div className="font-medium">{pharmacy.name}</div>
                <div className="text-xs text-slate-400">{pharmacy.address}</div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!isSearching && searchTerm.length >= 2 && results.length === 0 && (
        <p className="mt-3 text-xs text-slate-400">
          Nema rezultata za &quot;{searchTerm}&quot;.
        </p>
      )}
    </div>
  );
}

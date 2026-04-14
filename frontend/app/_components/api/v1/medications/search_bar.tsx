"use client";

import { Search } from "lucide-react";

type SearchBarProps = {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
};

export default function SearchBar({
  handleSearchChange,
  searchTerm,
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none 
            absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 
            text-slate-400"
      />
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Unesite naziv lijeka (min. 3 karaktera)"
        className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white"
      />
    </div>
  );
}

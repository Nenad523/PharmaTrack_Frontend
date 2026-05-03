import {
  ChevronDown,
  Filter,
  LocateFixed,
  MapPin,
  SlidersHorizontal,
} from "lucide-react";
import { SearchSort, SearchViewMode, UserLocation } from "./types";

type MobileSearchControlsProps = {
  activeFiltersCount: number;
  selectedCityLabel: string;
  sort: SearchSort;
  userLocation: UserLocation | null;
  isLocating: boolean;
  viewMode: SearchViewMode;
  onOpenFilters: () => void;
  onRequestLocation: () => void;
  onSortChange: (value: SearchSort) => void;
  onViewModeChange: (mode: SearchViewMode) => void;
};

export default function MobileSearchControls({
  activeFiltersCount,
  selectedCityLabel,
  sort,
  userLocation,
  isLocating,
  viewMode,
  onOpenFilters,
  onRequestLocation,
  onSortChange,
  onViewModeChange,
}: MobileSearchControlsProps) {
  return (
    <div className="sticky top-16 z-30 -mx-4 mb-4 border-y border-blue-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:hidden">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800"
        >
          <Filter className="h-4 w-4 text-blue-600" />
          Filteri
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <label className="relative inline-flex h-11 shrink-0 items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <SlidersHorizontal className="ml-3 h-4 w-4 text-blue-600" />
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SearchSort)}
            className="h-full appearance-none bg-transparent pl-2 pr-8 text-sm font-bold text-slate-800 outline-none"
          >
            <option value="az">A-Z</option>
            <option value="distance" disabled={!userLocation}>
              Udaljenost
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
        </label>

        <button
          type="button"
          onClick={onRequestLocation}
          disabled={isLocating}
          className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border px-3 text-sm font-bold transition sm:px-4 ${
            userLocation
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-50 text-slate-800"
          } disabled:cursor-wait disabled:opacity-70`}
          aria-label={userLocation ? "Lokacija aktivna" : "Moja lokacija"}
        >
          <LocateFixed className="h-4 w-4" />
          <span className="hidden min-[430px]:inline">
            {userLocation ? "Lokacija aktivna" : "Moja lokacija"}
          </span>
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="inline-flex min-w-0 items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {selectedCityLabel === "all" ? "Svi gradovi" : selectedCityLabel}
          </span>
        </div>

        <div className="inline-grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
              viewMode === "list"
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Lista
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("map")}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
              viewMode === "map"
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Mapa
          </button>
        </div>
      </div>
    </div>
  );
}

import { Filter, LocateFixed, MapPin, RotateCcw, SlidersHorizontal } from "lucide-react";
import { City, SearchFilters, UserLocation } from "./types";

type SearchFilterPanelProps = {
  filters: SearchFilters;
  cities: City[];
  isCitiesLoading: boolean;
  userLocation: UserLocation | null;
  isLocating: boolean;
  locationError: string;
  onFilterChange: <Key extends keyof SearchFilters>(
    key: Key,
    value: SearchFilters[Key]
  ) => void;
  onRequestLocation: () => void;
  onResetFilters: () => void;
  variant?: "desktop" | "mobile";
};

export default function SearchFilterPanel({
  filters,
  cities,
  isCitiesLoading,
  userLocation,
  isLocating,
  locationError,
  onFilterChange,
  onRequestLocation,
  onResetFilters,
  variant = "desktop",
}: SearchFilterPanelProps) {
  const isMobile = variant === "mobile";

  return (
    <aside
      className={
        isMobile
          ? "bg-white px-1 pb-1"
          : "rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
      }
    >
      {isMobile ? (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
            aria-label="Resetuj filtere"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Filter className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Filteri
              </p>
              <h2 className="text-sm font-bold text-slate-900">
                Prilagodi prikaz
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
            aria-label="Resetuj filtere"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid gap-4">
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-slate-500">
            Naziv apoteke
          </span>
          <input
            value={filters.name}
            onChange={(event) => onFilterChange("name", event.target.value)}
            placeholder="Unesite naziv"
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-slate-500">
            Adresa apoteke
          </span>
          <input
            value={filters.address}
            onChange={(event) => onFilterChange("address", event.target.value)}
            placeholder="Unesite adresu"
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <div className="grid gap-1.5">
          <span className="text-xs font-semibold text-slate-500">Grad</span>
          <div className="rounded-2xl border border-slate-200 bg-white p-2">
            <div className="mb-2 flex flex-wrap gap-2 px-1">
              <button
                type="button"
                onClick={() => onFilterChange("cities", [])}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  filters.cities.length === 0
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Svi gradovi
              </button>
              <button
                type="button"
                onClick={() => onFilterChange("cities", [])}
                disabled={filters.cities.length === 0}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Očisti izbor
              </button>
            </div>

            {isCitiesLoading ? (
              <p className="px-2 py-2 text-sm text-slate-500">Ucitavanje gradova...</p>
            ) : (
              <div className="grid max-h-52 gap-2 overflow-y-auto pr-1">
                {cities.map((city) => {
                  const checked = filters.cities.includes(city.name);

                  return (
                    <label
                      key={city.id}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition ${
                        checked
                          ? "border-blue-200 bg-blue-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <span className="text-sm font-semibold text-slate-700">
                        {city.name}
                      </span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          const nextCities = event.target.checked
                            ? [...filters.cities, city.name]
                            : filters.cities.filter((item) => item !== city.name);

                          onFilterChange("cities", nextCities);
                        }}
                        className="h-5 w-5 rounded border-slate-300 accent-blue-600"
                      />
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <ToggleRow
            label="Otvorena sada"
            checked={filters.openNow}
            onChange={(checked) => onFilterChange("openNow", checked)}
          />
          <ToggleRow
            label="Dežurna"
            checked={filters.onDuty}
            onChange={(checked) => onFilterChange("onDuty", checked)}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <MapPin className="h-4 w-4 text-blue-600" />
                Lokacija
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {userLocation
                  ? "Udaljenost i radius su dostupni."
                  : "Potrebna za sortiranje po udaljenosti."}
              </p>
            </div>

            <button
              type="button"
              onClick={onRequestLocation}
              disabled={isLocating}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-white text-blue-700 transition hover:bg-blue-50 disabled:cursor-wait disabled:opacity-70"
              aria-label="Koristi moju lokaciju"
            >
              <LocateFixed className="h-4 w-4" />
            </button>
          </div>

          {locationError && (
            <p className="mt-2 text-xs font-medium leading-5 text-red-600">
              {locationError}
            </p>
          )}
        </div>

        <div className={userLocation ? "" : "opacity-55"}>
          <ToggleRow
            label="Radius pretrage"
            checked={filters.radiusEnabled}
            disabled={!userLocation}
            onChange={(checked) => onFilterChange("radiusEnabled", checked)}
          />

          <label className="mt-3 grid gap-2">
            <span className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Udaljenost</span>
              <span>{filters.radius} km</span>
            </span>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.radius}
              disabled={!userLocation || !filters.radiusEnabled}
              onChange={(event) =>
                onFilterChange("radius", Number(event.target.value))
              }
              className="accent-blue-600 disabled:cursor-not-allowed"
            />
          </label>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-blue-50 px-3 py-2 text-xs font-semibold leading-5 text-blue-700">
          <SlidersHorizontal className="h-4 w-4 shrink-0" />
          Filteri se primjenjuju odmah.
        </div>
      </div>
    </aside>
  );
}

function ToggleRow({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-slate-300 accent-blue-600 disabled:cursor-not-allowed"
      />
    </label>
  );
}

import { MapPin } from "lucide-react";
import { ALL_CITIES_VALUE, City } from "./types";

type CityFilterProps = {
  cities: City[];
  selectedCity: string;
  isLoading: boolean;
  onCityChange: (city: string) => void;
};

export default function CityFilter({
  cities,
  selectedCity,
  isLoading,
  onCityChange,
}: CityFilterProps) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <MapPin className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Grad</p>
          <h2 className="text-sm font-bold text-slate-900">Odaberi grad</h2>
        </div>
      </div>

      <select
        value={selectedCity}
        onChange={(event) => onCityChange(event.target.value)}
        disabled={isLoading}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      >
        <option value={ALL_CITIES_VALUE}>Svi gradovi</option>
        {cities.map((city) => (
          <option key={city.id} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </section>
  );
}

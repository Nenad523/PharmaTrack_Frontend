import { CalendarDays, MapPin } from "lucide-react";
import { ALL_CITIES_VALUE, City } from "./types";

type MobileDutyControlsProps = {
  selectedDate: string;
  selectedCity: string;
  cities: City[];
  isCitiesLoading: boolean;
  onDateChange: (dateKey: string) => void;
  onCityChange: (city: string) => void;
};

export default function MobileDutyControls({
  selectedDate,
  selectedCity,
  cities,
  isCitiesLoading,
  onDateChange,
  onCityChange,
}: MobileDutyControlsProps) {
  return (
    <div className="sticky top-16 z-30 -mx-4 mb-4 border-y border-blue-100 bg-sky-50/95 px-4 py-3 shadow-sm backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:hidden">
      <div className="grid grid-cols-2 gap-2">
        <label className="min-w-0">
          <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-slate-500">
            <CalendarDays className="h-3.5 w-3.5 text-blue-600" />
            Datum
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => {
              if (event.target.value) {
                onDateChange(event.target.value);
              }
            }}
            className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="min-w-0">
          <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-blue-600" />
            Grad
          </span>
          <select
            value={selectedCity}
            onChange={(event) => onCityChange(event.target.value)}
            disabled={isCitiesLoading}
            className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value={ALL_CITIES_VALUE}>Svi gradovi</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

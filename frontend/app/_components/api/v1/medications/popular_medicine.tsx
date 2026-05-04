import { TrendingUp } from "lucide-react";

type PopularMedicineProps = {
  popularMedicines: string[];
  handlePopularClick: (medicineName: string) => void;
};

export default function PopularMedicine({
  popularMedicines,
  handlePopularClick,
}: PopularMedicineProps) {
  if (popularMedicines.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-700">Popularno</h2>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {popularMedicines.map((medicine) => (
          <button
            key={medicine}
            type="button"
            onClick={() => handlePopularClick(medicine)}
            className="truncate rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
          >
            {medicine}
          </button>
        ))}
      </div>
    </div>
  );
}

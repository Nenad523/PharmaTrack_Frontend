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
    <div className="mt-6 sm:mt-8">
      <div className="mb-3 flex items-center gap-2 sm:mb-4">
        <TrendingUp className="h-4 w-4 text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-700">Popularno</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {popularMedicines.map((medicine) => (
          <button
            key={medicine}
            type="button"
            onClick={() => handlePopularClick(medicine)}
            className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100 sm:px-3 sm:py-1.5 sm:text-xs"
          >
            {medicine}
          </button>
        ))}
      </div>
    </div>
  );
}

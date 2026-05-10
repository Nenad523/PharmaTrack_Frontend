import { Search } from "lucide-react";
type SearchButtonProps = {
  isSearchButtonEnabled: boolean;
  onSearchPharmacies: () => void;
};

export default function SearchButton({
  isSearchButtonEnabled,
  onSearchPharmacies,
}: SearchButtonProps) {
  return (
    <div className="mt-6 sm:mt-8">
      <button
        type="button"
        disabled={!isSearchButtonEnabled}
        onClick={onSearchPharmacies}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition sm:px-6 sm:py-4 ${
          isSearchButtonEnabled
            ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
            : "cursor-not-allowed bg-slate-200 text-slate-500"
        }`}
      >
        <Search className="h-4 w-4" />
        Pretraži apoteke
      </button>
    </div>
  );
}

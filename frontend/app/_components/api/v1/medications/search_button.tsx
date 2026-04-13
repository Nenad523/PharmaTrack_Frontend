import { Search } from "lucide-react";
export default function SearchButton({isSearchButtonEnabled}: any) {
    return (
        <div className="mt-8">
            <button
            type="button"
            disabled={!isSearchButtonEnabled}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold transition ${
                isSearchButtonEnabled
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                : "cursor-not-allowed bg-slate-200 text-slate-500"
            }`}
            >
            <Search className="h-4 w-4" />
            Pretraži apoteke
            </button>
        </div>
    )
}
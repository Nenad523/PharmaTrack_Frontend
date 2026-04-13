
import {TrendingUp} from "lucide-react";


export default function PopularMedicine({popularMedicines, searchTerm, setSearchTerm, hasMinimumChars, handlePopularClick}: any) {

    return(
                <div className="mt-8">
                    <div className="mb-4 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-slate-500" />
                        <h2 className="text-sm font-semibold text-slate-700">Popularno</h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {popularMedicines.map((medicine: Medicine) => (
                        <button
                            key={medicine}
                            type="button"
                            onClick={() => handlePopularClick(medicine)}
                            className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
                        >
                            {medicine}
                        </button>
                        ))}
                    </div>
                </div>
            )
}
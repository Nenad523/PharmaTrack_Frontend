import { List, Map } from "lucide-react";
import { SearchViewMode } from "./types";

type ViewToggleProps = {
  viewMode: SearchViewMode;
  onViewModeChange: (mode: SearchViewMode) => void;
};

export default function ViewToggle({
  viewMode,
  onViewModeChange,
}: ViewToggleProps) {
  return (
    <div className="inline-grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
      <button
        type="button"
        onClick={() => onViewModeChange("list")}
        className={`inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition ${
          viewMode === "list"
            ? "bg-white text-slate-950 shadow-sm"
            : "text-slate-500 hover:text-blue-700"
        }`}
      >
        <List className="h-4 w-4" />
        Lista
      </button>
      <button
        type="button"
        onClick={() => onViewModeChange("map")}
        className={`inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition ${
          viewMode === "map"
            ? "bg-white text-slate-950 shadow-sm"
            : "text-slate-500 hover:text-blue-700"
        }`}
      >
        <Map className="h-4 w-4" />
        Mapa
      </button>
    </div>
  );
}

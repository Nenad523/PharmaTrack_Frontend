import { Building2, ChevronRight, Clock3, MapPin, Phone } from "lucide-react";
import { formatDutyTimeRange } from "./date_utils";
import { DutyPharmacy } from "./types";

type DutyPharmacyCardProps = {
  pharmacy: DutyPharmacy;
  detailsPharmacyId: number | null;
  onToggleDetails: (pharmacyId: number) => void;
};

export default function DutyPharmacyCard({
  pharmacy,
  detailsPharmacyId,
  onToggleDetails,
}: DutyPharmacyCardProps) {
  const detailsOpen = detailsPharmacyId === pharmacy.id;
  const phones = pharmacy.phone
    ? pharmacy.phone.split(",").map((phone) => phone.trim()).filter(Boolean)
    : []

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_14px_28px_-20px_rgba(15,23,42,0.42),0_6px_16px_-12px_rgba(37,99,235,0.35)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Building2 className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {pharmacy.name}
                </h3>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {pharmacy.city}
                </span>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-slate-600">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span>{pharmacy.address}</span>
                </p>

                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                  <span>{phones.length > 0 ? phones.join(", ") : "Nije dostupno"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <div className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
            <Clock3 className="h-4 w-4" />
            {formatDutyTimeRange(pharmacy.dutyStart, pharmacy.dutyEnd)}
          </div>

          <button
            type="button"
            onClick={() => onToggleDetails(pharmacy.id)}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              detailsOpen
                ? "border-blue-200 bg-blue-600 text-white shadow-md shadow-blue-200/70 hover:bg-blue-700"
                : "border-blue-200/80 bg-white text-blue-700 shadow-sm shadow-blue-100/80 hover:bg-blue-50"
            }`}
          >
            Detalji
            <ChevronRight
              className={`h-4 w-4 transition-transform duration-200 ${
                detailsOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>
        </div>
      </div>
    </article>
  );
}

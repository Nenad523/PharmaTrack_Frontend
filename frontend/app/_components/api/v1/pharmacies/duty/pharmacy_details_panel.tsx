import {
  Building2,
  CalendarClock,
  MapPin,
  Phone,
  Power,
  X,
} from "lucide-react";
import { formatDateTime, formatTime } from "./date_utils";
import { PharmacyDetails } from "./types";

type DetailsStateProps = {
  pharmacy: PharmacyDetails | null;
  isLoading: boolean;
  error: string;
  onClose: () => void;
};

function DetailsBody({
  pharmacy,
  isLoading,
  error,
  onClose,
}: DetailsStateProps) {
  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-blue-200/80 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-blue-600">
          Učitavanje detalja...
        </p>
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="rounded-[28px] border border-red-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-red-600">
          Detalji nijesu dostupni.
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {error || "Nije moguće prikazati podatke za odabranu apoteku."}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Zatvori
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-blue-200/80 bg-white/95 shadow-[0_24px_55px_-30px_rgba(15,23,42,0.45),0_14px_30px_-22px_rgba(37,99,235,0.55)] ring-1 ring-blue-100/60 backdrop-blur xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-6 py-5 xl:sticky xl:top-0 xl:z-10 xl:backdrop-blur">
        <div>
          <p className="text-xs font-semibold uppercase text-blue-600">
            Detalji apoteke
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {pharmacy.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {pharmacy.city}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-smooth hover:border-blue-200 hover:text-blue-600"
          aria-label={`Zatvori detalje za apoteku ${pharmacy.name}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-5 px-6 py-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl border border-blue-100 bg-white p-3 text-blue-600 shadow-sm">
              <Building2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900">
                Osnovne informacije
              </h3>
              <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-slate-600">
                
                {pharmacy.address}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Kontakt</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {pharmacy.phones.length > 0 ? (
              pharmacy.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {phone}
                </a>
              ))
            ) : (
              <p className="text-sm text-slate-500">Nije dostupno.</p>
            )}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <Power
                className={`mt-0.5 h-5 w-5 ${
                  pharmacy.isActive ? "text-emerald-600" : "text-slate-400"
                }`}
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Dostupnost
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {pharmacy.isActive ? "Aktivna apoteka" : "Neaktivna apoteka"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {pharmacy.dutySchedule && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Dežurni termin
            </h3>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p>
                    Od{" "}
                    <span className="font-semibold text-slate-900">
                      {formatDateTime(pharmacy.dutySchedule.startDatetime)}
                    </span>
                  </p>
                  <p className="mt-1">
                    Do{" "}
                    <span className="font-semibold text-slate-900">
                      {formatDateTime(pharmacy.dutySchedule.endDatetime)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Radno vrijeme</h3>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {pharmacy.workingHours.length > 0 ? (
              pharmacy.workingHours.map((item, index) => (
                <div
                  key={`${item.day_of_week}-${item.open_time}-${index}`}
                  className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0"
                >
                  <span className="font-semibold text-slate-800">
                    {item.day_of_week}
                  </span>
                  <span className="text-slate-600">
                    {formatTime(item.open_time)} - {formatTime(item.close_time)}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-slate-500">
                Radno vrijeme nije dostupno.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PharmacyDetailsPanel(props: DetailsStateProps) {
  return (
    <aside className="hidden w-full xl:block animate-scale-in">
      <DetailsBody {...props} />
    </aside>
  );
}

export function MobilePharmacyDetailsOverlay(props: DetailsStateProps) {
  if (!props.isLoading && !props.error && !props.pharmacy) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 xl:hidden animate-fade-in">
      <button
        type="button"
        onClick={props.onClose}
        className="absolute inset-0 bg-slate-950/70"
        aria-label="Zatvori prikaz detalja"
      />

      <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[28px] bg-white px-3 pt-3 shadow-2xl animate-slide-in-right">
        <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-200" />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-3">
          <DetailsBody {...props} />
        </div>
      </div>
    </div>
  );
}

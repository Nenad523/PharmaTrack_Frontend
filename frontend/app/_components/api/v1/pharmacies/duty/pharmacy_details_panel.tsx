import { useState } from "react";
import {
  Building2,
  CalendarClock,
  Check,
  Clock3,
  Copy,
  MapPin,
  Navigation,
  Phone,
  Power,
  Route,
  Sparkles,
  X,
} from "lucide-react";
import { formatDateTime, formatWorkingHoursRange } from "./date_utils";
import { PharmacyDetails } from "./types";

type PharmacyMedicineContext = {
  medicineName: string;
  selectedDoseStrengths: string[];
  availableDoseStrengths: string[];
  distanceLabel?: string | null;
  latestUpdateLabel?: string | null;
};

type DetailsStateProps = {
  pharmacy: PharmacyDetails | null;
  isLoading: boolean;
  error: string;
  onClose: () => void;
  onShowOnMap?: (pharmacy: PharmacyDetails) => void;
  medicineContext?: PharmacyMedicineContext | null;
};

const buildMapsAddress = (pharmacy: PharmacyDetails) => {
  const address = pharmacy.address.trim();
  const city = pharmacy.city.trim();
  const hasCity = address.toLowerCase().includes(city.toLowerCase());

  return [address, hasCity ? null : city, "Crna Gora"].filter(Boolean).join(", ");
};

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const parseLocalDateTime = (value: string) => {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:T| )(\d{2}):(\d{2})(?::(\d{2}))?/
  );

  if (!match) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6] ?? 0)
  );
};

function getDutyStatus(pharmacy: PharmacyDetails) {
  if (pharmacy.isOnDuty) {
    return {
      isHighlighted: true,
      title: "Dežurna sada",
    };
  }

  if (!pharmacy.dutySchedule) {
    return {
      isHighlighted: false,
      title: "Nije trenutno dežurna",
    };
  }

  const start = parseLocalDateTime(pharmacy.dutySchedule.startDatetime);
  const end = parseLocalDateTime(pharmacy.dutySchedule.endDatetime);
  const now = new Date();

  if (start && now < start) {
    return {
      isHighlighted: false,
      title: "Dežurstvo zakazano",
    };
  }

  if (end && now > end) {
    return {
      isHighlighted: false,
      title: "Dežurstvo završeno",
    };
  }

  return {
    isHighlighted: false,
    title: "Nije trenutno dežurna",
  };
}

function DetailsBody({
  pharmacy,
  isLoading,
  error,
  onClose,
  onShowOnMap,
  medicineContext,
}: DetailsStateProps) {
  const [copiedAddress, setCopiedAddress] = useState("");

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

  const dutyStatus = getDutyStatus(pharmacy);
  const mapsAddress = buildMapsAddress(pharmacy);
  const isAddressCopied = copiedAddress === mapsAddress;

  const handleCopyAddress = async () => {
    await copyText(mapsAddress);
    setCopiedAddress(mapsAddress);
    window.setTimeout(() => {
      setCopiedAddress((current) => (current === mapsAddress ? "" : current));
    }, 1800);
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-blue-200/80 bg-white/95 shadow-[0_24px_55px_-30px_rgba(15,23,42,0.45),0_14px_30px_-22px_rgba(37,99,235,0.55)] ring-1 ring-blue-100/60 backdrop-blur xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-6 py-5 xl:sticky xl:top-0 xl:z-10 xl:backdrop-blur">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase text-blue-600">
            Detalji apoteke
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {pharmacy.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {pharmacy.city}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {onShowOnMap && (
              <button
                type="button"
                onClick={() => onShowOnMap(pharmacy)}
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <Route className="h-4 w-4" />
                Prikaži na mapi
              </button>
            )}
            {pharmacy.latitude != null && pharmacy.longitude != null && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Navigation className="h-4 w-4" />
                Navigiraj
              </a>
            )}
          </div>
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
        {pharmacy.img_url && (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <img
              src={pharmacy.img_url}
              alt={`Fotografija apoteke ${pharmacy.name}`}
              className="h-48 w-full object-cover"
            />
          </div>
        )}

        {medicineContext && (
          <div className="overflow-hidden rounded-3xl border border-emerald-200/80 bg-[linear-gradient(135deg,rgba(236,253,245,0.95)_0%,rgba(255,255,255,1)_52%,rgba(239,246,255,0.95)_100%)] shadow-sm">
            <div className="border-b border-emerald-100/80 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Trazeni lijek
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">
                {medicineContext.medicineName}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Apoteka ima izdvojene doze koje odgovaraju trenutnoj pretrazi.
              </p>
            </div>

            <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Trazene doze
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {medicineContext.selectedDoseStrengths.length > 0 ? (
                    medicineContext.selectedDoseStrengths.map((dose) => (
                      <span
                        key={`selected-${dose}`}
                        className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"
                      >
                        {dose}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">
                      Nema izdvojenih doza.
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Dostupno u apoteci
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {medicineContext.availableDoseStrengths.length > 0 ? (
                    medicineContext.availableDoseStrengths.map((dose) => (
                      <span
                        key={`available-${dose}`}
                        className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                      >
                        {dose}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">
                      Stanje doza nije dostupno.
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <Navigation className="mt-0.5 h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Udaljenost
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {medicineContext.distanceLabel || "Nije dostupna"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Zadnje azuriranje
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {medicineContext.latestUpdateLabel || "Nije dostupno"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <Power
                className={`mt-0.5 h-5 w-5 ${
                  pharmacy.isActive ? "text-emerald-600" : "text-slate-400"
                }`}
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Status apoteke
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {pharmacy.isActive ? "Aktivna apoteka" : "Neaktivna apoteka"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <Sparkles
                className={`mt-0.5 h-5 w-5 ${
                  dutyStatus.isHighlighted ? "text-blue-600" : "text-slate-400"
                }`}
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Dežurstvo
                </p>
                <p
                  className={`mt-1 text-sm font-semibold ${
                    dutyStatus.isHighlighted ? "text-blue-700" : "text-slate-700"
                  }`}
                >
                  {dutyStatus.title}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl border border-blue-100 bg-white p-3 text-blue-600 shadow-sm">
              <Building2 className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Lokacija
                </h3>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition ${
                    isAddressCopied
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                  }`}
                  aria-label={`Kopiraj adresu apoteke ${pharmacy.name}`}
                >
                  {isAddressCopied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {isAddressCopied ? "Kopirano" : "Kopiraj"}
                </button>
              </div>
              <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-slate-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                {pharmacy.address}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {pharmacy.city}
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
                    {formatWorkingHoursRange(item.open_time, item.close_time)}
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

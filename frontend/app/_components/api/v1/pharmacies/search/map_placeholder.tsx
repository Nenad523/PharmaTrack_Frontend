import { Building2, Map, MapPin } from "lucide-react";
import { PharmacySearchResult } from "./types";

type MapPlaceholderProps = {
  pharmacies: PharmacySearchResult[];
};

export default function MapPlaceholder({ pharmacies }: MapPlaceholderProps) {
  return (
    <section className="min-h-[32rem] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm animate-fade-in">
      <div className="relative flex min-h-[32rem] items-center justify-center bg-[linear-gradient(135deg,#eef6ff_0%,#f8fbff_45%,#ecfdf5_100%)] p-6">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute left-8 top-10 h-px w-[80%] rotate-6 bg-blue-200" />
          <div className="absolute bottom-16 left-12 h-px w-[70%] -rotate-12 bg-emerald-200" />
          <div className="absolute left-1/3 top-0 h-full w-px rotate-12 bg-slate-200" />
          <div className="absolute right-1/4 top-0 h-full w-px -rotate-6 bg-blue-100" />
        </div>

        {pharmacies.slice(0, 7).map((pharmacy, index) => (
          <span
            key={pharmacy.id}
            className="absolute inline-flex h-11 w-11 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-600 shadow-lg shadow-blue-200/70"
            style={{
              left: `${18 + ((index * 19) % 62)}%`,
              top: `${18 + ((index * 23) % 58)}%`,
            }}
            title={pharmacy.name}
          >
            <MapPin className="h-5 w-5" />
          </span>
        ))}

        <div className="relative max-w-md rounded-[24px] border border-white/80 bg-white/90 p-6 text-center shadow-[0_24px_50px_-26px_rgba(15,23,42,0.5)] backdrop-blur">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Map className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-2xl font-bold text-slate-950">
            Mapa stiže uskoro
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Ovdje ćemo ubaciti React Leaflet prikaz za iste rezultate, filtere i
            odabranu apoteku.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">
            <Building2 className="h-4 w-4 text-blue-600" />
            {pharmacies.length} apoteka spremno za prikaz
          </div>
        </div>
      </div>
    </section>
  );
}

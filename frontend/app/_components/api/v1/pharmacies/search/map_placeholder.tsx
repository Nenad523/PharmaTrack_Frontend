"use client";

import dynamic from "next/dynamic";
import { PharmacySearchResult, UserLocation } from "./types";

const PharmacyMapView = dynamic(() => import("./pharmacy_map_view"), {
  ssr: false,
  loading: () => (
    <section className="relative h-[calc(100vh-13rem)] min-h-[32rem] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm xl:h-full">
      <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#eff6ff_0%,#f8fbff_45%,#ecfdf5_100%)] p-6 text-center">
        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Učitavanje mape
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Pripremamo interaktivni prikaz apoteka i njihovih dostupnih doza.
        </p>
      </div>
    </section>
  ),
});

type MapPlaceholderProps = {
  pharmacies: PharmacySearchResult[];
  userLocation: UserLocation | null;
  isLocating: boolean;
  onRequestLocation: () => void;
};

export default function MapPlaceholder({
  pharmacies,
  userLocation,
  isLocating,
  onRequestLocation,
}: MapPlaceholderProps) {
  return (
    <PharmacyMapView
      pharmacies={pharmacies}
      userLocation={userLocation}
      isLocating={isLocating}
      onRequestLocation={onRequestLocation}
    />
  );
}

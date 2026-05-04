"use client";

import { divIcon, type LatLngBoundsExpression } from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { Building2, Clock3, MapPin, Navigation, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatTime } from "../duty/date_utils";
import {
  formatRelativeUpdate,
  getLatestInventoryUpdate,
  normalizeNumber,
} from "./search_utils";
import { PharmacySearchResult, UserLocation } from "./types";

type PharmacyMapViewProps = {
  pharmacies: PharmacySearchResult[];
  userLocation: UserLocation | null;
};

const DEFAULT_CENTER: [number, number] = [42.4411, 19.2636];

function createMarkerIcon(selected: boolean) {
  return divIcon({
    className: "",
    html: `
      <div class="pharmacy-map-marker ${
        selected ? "pharmacy-map-marker--selected" : ""
      }">
        <span style="position: relative; z-index: 1; font-size: 16px; font-weight: 900; line-height: 1;">+</span>
      </div>
    `,
    iconSize: [34, 42],
    iconAnchor: [17, 40],
    popupAnchor: [0, -36],
  });
}

function createUserMarkerIcon() {
  return divIcon({
    className: "",
    html: `
      <div class="pharmacy-map-marker pharmacy-map-marker--user">
        <span style="position: relative; z-index: 1; font-size: 12px; font-weight: 900; line-height: 1;">Ja</span>
      </div>
    `,
    iconSize: [40, 46],
    iconAnchor: [20, 42],
    popupAnchor: [0, -38],
  });
}

function MapBoundsController({
  points,
}: {
  points: Array<[number, number]>;
}) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();

    if (points.length === 0) {
      map.setView(DEFAULT_CENTER, 8, { animate: true });
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 14, { animate: true });
      return;
    }

    const bounds = points as LatLngBoundsExpression;
    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 14,
      animate: true,
    });
  }, [map, points]);

  return null;
}

function PharmacyPopup({ pharmacy }: { pharmacy: PharmacySearchResult }) {
  const latestUpdate = getLatestInventoryUpdate(pharmacy.doses);
  const openLabel = pharmacy.isOnDuty
    ? pharmacy.openUntil
      ? `Dežurna do ${formatTime(pharmacy.openUntil)}`
      : "Dežurna"
    : pharmacy.isOpenNow
      ? pharmacy.openUntil
        ? `Otvoreno do ${formatTime(pharmacy.openUntil)}`
        : "Otvoreno sada"
      : "Trenutno zatvoreno";

  return (
    <div className="w-[280px] space-y-3 p-1">
      <div className="space-y-1">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Building2 className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold leading-5 text-slate-900">
              {pharmacy.name}
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              {pharmacy.city}
            </p>
          </div>
        </div>

        <p className="flex items-start gap-2 text-xs leading-5 text-slate-600">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>{pharmacy.address}</span>
        </p>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
        <Clock3 className="h-3.5 w-3.5" />
        {openLabel}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Dostupne doze
        </p>
        <div className="flex flex-wrap gap-2">
          {pharmacy.doses.slice(0, 3).map((dose) => (
            <span
              key={`${pharmacy.id}-${dose.doseId}`}
              className="inline-flex flex-col rounded-xl border border-emerald-100 bg-emerald-50 px-2.5 py-2"
            >
              <span className="text-[11px] font-bold leading-4 text-emerald-700">
                {dose.strength}
              </span>
              <span className="text-[10px] font-semibold leading-4 text-emerald-700/75">
                {dose.lastUpdated
                  ? formatRelativeUpdate(new Date(dose.lastUpdated)).toLowerCase()
                  : "Bez ažuriranja"}
              </span>
            </span>
          ))}

          {pharmacy.doses.length > 3 && (
            <span className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-semibold text-slate-500">
              +{pharmacy.doses.length - 3} još
            </span>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Navigation className="h-3.5 w-3.5 text-blue-600" />
          <span>
            {latestUpdate
              ? `Zadnje ažuriranje ${formatRelativeUpdate(latestUpdate).toLowerCase()}`
              : "Ažuriranje nije dostupno"}
          </span>
        </div>
      </div>

      {pharmacy.isOnDuty && (
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
          <Sparkles className="h-3.5 w-3.5" />
          Dežurna apoteka
        </div>
      )}
    </div>
  );
}

export default function PharmacyMapView({
  pharmacies,
  userLocation,
}: PharmacyMapViewProps) {
  const [activePharmacyId, setActivePharmacyId] = useState<number | null>(null);

  const pharmaciesWithCoordinates = useMemo(
    () =>
      pharmacies
        .map((pharmacy) => {
          const latitude = normalizeNumber(pharmacy.latitude);
          const longitude = normalizeNumber(pharmacy.longitude);

          if (latitude === null || longitude === null) {
            return null;
          }

          return {
            ...pharmacy,
            latitude,
            longitude,
          };
        })
        .filter(
          (
            pharmacy
          ): pharmacy is PharmacySearchResult & {
            latitude: number;
            longitude: number;
          } => pharmacy !== null
        ),
    [pharmacies]
  );

  const userPoint = useMemo(() => {
    if (!userLocation) {
      return null;
    }

    const latitude = normalizeNumber(userLocation.latitude);
    const longitude = normalizeNumber(userLocation.longitude);

    if (latitude === null || longitude === null) {
      return null;
    }

    return [latitude, longitude] as [number, number];
  }, [userLocation]);

  const mapPoints = useMemo(
    () => [
      ...pharmaciesWithCoordinates.map(
        (pharmacy) => [pharmacy.latitude, pharmacy.longitude] as [number, number]
      ),
      ...(userPoint ? [userPoint] : []),
    ],
    [pharmaciesWithCoordinates, userPoint]
  );

  const selectedPharmacyId =
    activePharmacyId !== null &&
    pharmaciesWithCoordinates.some((pharmacy) => pharmacy.id === activePharmacyId)
      ? activePharmacyId
      : null;

  if (pharmacies.length === 0) {
    return (
      <section className="relative h-[calc(100vh-13rem)] min-h-[32rem] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#eff6ff_0%,#f8fbff_45%,#ecfdf5_100%)] p-6">
          <div className="max-w-md text-center">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
              <MapPin className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Nema rezultata za mapu
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Kada pretraga vrati apoteke sa koordinatama, ovdje će se pojaviti
              interaktivna mapa sa markerima i brzim pregledom.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[calc(100vh-13rem)] min-h-[32rem] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm animate-fade-in">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={8}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <MapBoundsController points={mapPoints} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userPoint && (
          <Marker position={userPoint} icon={createUserMarkerIcon()} title="Ja">
            <Tooltip
              direction="top"
              offset={[0, -14]}
              opacity={1}
              permanent
              interactive={false}
              className="pharmacy-map-tooltip pharmacy-map-tooltip--user"
            >
              Ja
            </Tooltip>
          </Marker>
        )}

        {pharmaciesWithCoordinates.map((pharmacy) => (
          <Marker
            key={pharmacy.id}
            position={[pharmacy.latitude, pharmacy.longitude]}
            icon={createMarkerIcon(selectedPharmacyId === pharmacy.id)}
            title={pharmacy.name}
            eventHandlers={{
              click: () => {
                setActivePharmacyId(pharmacy.id);
              },
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -14]}
              opacity={1}
              permanent
              interactive={false}
              className="pharmacy-map-tooltip"
            >
              {pharmacy.name}
            </Tooltip>
            <Popup className="pharmacy-map-popup" minWidth={280}>
              <PharmacyPopup pharmacy={pharmacy} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
}

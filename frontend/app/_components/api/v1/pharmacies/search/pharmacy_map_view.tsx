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
import {
  Building2,
  Clock3,
  LocateFixed,
  MapPin,
  Navigation,
  Power,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatTime } from "../duty/date_utils";
import {
  formatDistance,
  formatRelativeUpdate,
  getLatestInventoryUpdate,
  normalizeNumber,
} from "./search_utils";
import { PharmacySearchResult, UserLocation } from "./types";

function buildGoogleMapsUrl(
  pharmacy: PharmacySearchResult & { latitude: number; longitude: number },
  userLocation: UserLocation | null
) {
  const dest = `${pharmacy.latitude},${pharmacy.longitude}`;
  const origin =
    userLocation
      ? `&origin=${normalizeNumber(userLocation.latitude)},${normalizeNumber(userLocation.longitude)}`
      : "";
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}${origin}`;
}

type PharmacyMapViewProps = {
  pharmacies: PharmacySearchResult[];
  userLocation: UserLocation | null;
  isLocating: boolean;
  isInteractionDisabled?: boolean;
  onRequestLocation: () => void;
  medicineName: string;
  doseStrengths: string[];
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
        <span style="position: relative; z-index: 1; font-size: 13px; font-weight: 900; line-height: 1; color: #ffffff;">Ja</span>
      </div>
    `,
    iconSize: [46, 54],
    iconAnchor: [23, 52],
    popupAnchor: [0, -48],
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

function PharmacyPopup({
  pharmacy,
  medicineName,
  doseStrengths,
  userLocation,
}: {
  pharmacy: PharmacySearchResult;
  medicineName: string;
  doseStrengths: string[];
  userLocation: UserLocation | null;
}) {
  const openLabel = pharmacy.isOnDuty
    ? pharmacy.openUntil
      ? `Dezurna do ${formatTime(pharmacy.openUntil)}`
      : "Dezurna"
    : pharmacy.isOpenNow
      ? pharmacy.openUntil
        ? `Otvoreno do ${formatTime(pharmacy.openUntil)}`
        : "Otvoreno sada"
      : "Trenutno zatvoreno";

  const statusBadge = pharmacy.isOnDuty
    ? {
        label: "Dezurna",
        className: "border border-blue-100 bg-blue-50 text-blue-700",
        icon: Sparkles,
      }
    : pharmacy.isOpenNow
      ? {
          label: "Radi",
          className: "border border-emerald-100 bg-emerald-50 text-emerald-700",
          icon: Clock3,
        }
      : {
          label: "Ne radi",
          className: "border border-red-100 bg-red-50 text-red-700",
          icon: Power,
        };

  const MetaStatusIcon = statusBadge.icon;
  const distanceLabel = formatDistance(pharmacy.distance);
  const latestUpdate = getLatestInventoryUpdate(pharmacy.doses);
  const latestUpdateLabel = latestUpdate
    ? formatRelativeUpdate(latestUpdate)
    : "Nije dostupno";

  return (
    <div className="w-[228px] max-w-[74vw] overflow-hidden rounded-[14px] bg-white md:w-[320px] md:max-w-[320px]">
      <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_50%,#ecfdf5_100%)] px-1.5 py-1.5 md:px-3 md:py-2.5">
        <div className="flex items-start gap-1 md:gap-2">
          <span className="inline-flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md bg-white text-blue-600 shadow-sm ring-1 ring-blue-100 md:h-8 md:w-8">
            <Building2 className="h-3 w-3 md:h-4 md:w-4" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-1 md:gap-2">
              <h3 className="line-clamp-2 min-w-0 flex-1 text-[9px] font-bold leading-[1.05rem] text-slate-900 md:text-sm md:leading-5">
                {pharmacy.name}
              </h3>
            </div>

            {distanceLabel && (
              <div className="mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-0 text-[7px] font-semibold leading-none text-slate-500 md:mt-1 md:text-[11px]">
                <span className="inline-flex items-center gap-0.5 text-slate-600">
                  <Navigation className="h-2 w-2 md:h-3 md:w-3" />
                  {distanceLabel}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-1 rounded-md bg-white/95 px-1.5 py-1 ring-1 ring-slate-100 md:mt-2 md:px-2.5 md:py-1.5">
          <div className="flex items-start gap-1 text-[7px] leading-[0.8rem] text-slate-600 md:gap-1.5 md:text-[11px] md:leading-4">
            <MapPin className="mt-px h-2 w-2 shrink-0 text-slate-400 md:h-3 md:w-3" />
            <span className="line-clamp-1">{pharmacy.address}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 px-1.5 py-1 md:space-y-2.5 md:px-3 md:py-2.5">
        <div className="flex flex-wrap items-center gap-0.5 md:gap-1">
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1 py-0.5 text-[7px] font-bold leading-none md:gap-1 md:px-2 md:py-1 md:text-[11px] ${statusBadge.className}`}
          >
            <MetaStatusIcon className="h-2 w-2 md:h-3 md:w-3" />
            {statusBadge.label === "Ne radi" ? "Trenutno zatvoreno" : openLabel}
          </span>
          <span className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-50 px-1 py-0.5 text-[7px] font-bold leading-none text-slate-700 md:gap-1 md:px-2 md:py-1 md:text-[11px]">
            <Clock3 className="h-2 w-2 md:h-3 md:w-3" />
            {latestUpdateLabel}
          </span>
          <span className={`inline-flex items-center rounded-full border px-1 py-0.5 text-[7px] font-bold leading-none md:px-2 md:py-1 md:text-[11px] ${
            pharmacy.is_state
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-50 text-slate-500"
          }`}>
            {pharmacy.is_state ? "Državna" : "Privatna"}
          </span>
        </div>

        <div className="rounded-md border border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_100%)] px-1.5 py-1.5 md:px-2.5 md:py-2">
          <div className="flex items-center justify-between gap-1">
            <p className="text-[7px] font-bold uppercase tracking-wide text-emerald-700 md:text-[11px]">
              Traženi lijek
            </p>
            <span className="rounded-full border border-slate-200 bg-white px-1 py-0.5 text-[7px] font-bold leading-none text-slate-600 md:px-1.5 md:py-0.5 md:text-[10px]">
              {pharmacy.doses.length} {pharmacy.doses.length === 1 ? "doza" : "doze"}
            </span>
          </div>
          <h4 className="mt-0.5 line-clamp-1 text-[9px] font-bold leading-tight text-slate-900 md:text-xs">
            {medicineName}
          </h4>
          <div className="mt-1 flex flex-wrap gap-0.5 md:gap-1">
            {pharmacy.doses.map((dose) => {
              const refundable = pharmacy.is_state && dose.is_refundable;
              return (
                <span
                  key={`${pharmacy.id}-${dose.doseId}`}
                  className={`inline-flex items-center gap-0.5 rounded-full border px-1 py-0.5 text-[7px] font-bold leading-none md:gap-1 md:px-2 md:py-1 md:text-[11px] ${
                    refundable
                      ? "border-emerald-300 bg-white text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {dose.strength}
                  {refundable && (
                    <span className="rounded bg-emerald-600 px-0.5 text-[5px] font-black text-white md:text-[8px]">
                      RFZO
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        {(() => {
          const lat = normalizeNumber(pharmacy.latitude);
          const lng = normalizeNumber(pharmacy.longitude);
          if (lat === null || lng === null) return null;
          return (
            <a
              href={buildGoogleMapsUrl({ ...pharmacy, latitude: lat, longitude: lng }, userLocation)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#ffffff" }}
              className="mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-[10px] font-bold leading-none transition hover:bg-blue-700 md:text-xs"
            >
              <Navigation className="h-3 w-3 md:h-3.5 md:w-3.5" style={{ color: "#ffffff" }} />
              Navigiraj
            </a>
          );
        })()}
      </div>
    </div>
  );
}

function getTooltipDotClass(pharmacy: PharmacySearchResult) {
  if (pharmacy.isOnDuty) {
    return "bg-blue-500";
  }

  if (pharmacy.isOpenNow) {
    return "bg-emerald-500";
  }

  return "bg-red-500";
}

export default function PharmacyMapView({
  pharmacies,
  userLocation,
  isLocating,
  isInteractionDisabled = false,
  onRequestLocation,
  medicineName,
  doseStrengths,
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
      <section className="relative isolate h-[calc(100svh-16rem)] min-h-[28rem] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm xl:h-full">
        <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#eff6ff_0%,#f8fbff_45%,#ecfdf5_100%)] p-6">
          <div className="max-w-md text-center">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
              <MapPin className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Nema rezultata za mapu
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Kada pretraga vrati apoteke sa koordinatama, ovdje ce se pojaviti
              interaktivna mapa sa markerima i brzim pregledom.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate h-[calc(100svh-16rem)] min-h-[28rem] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm animate-fade-in xl:h-full">
      <div
        className={`absolute z-[500] transition-all ${
          activePharmacyId === null
            ? "right-4 top-4"
            : "bottom-4 right-3 top-auto sm:bottom-4 sm:right-4"
        }`}
      >
        <button
          type="button"
          onClick={onRequestLocation}
          disabled={isLocating}
          className={`inline-flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-bold shadow-lg backdrop-blur transition ${
            userLocation
              ? "border-emerald-200 bg-emerald-50/95 text-emerald-700"
              : "border-slate-200 bg-white/95 text-slate-800 hover:border-blue-200 hover:text-blue-700"
          } disabled:cursor-wait disabled:opacity-70`}
          aria-label={userLocation ? "Lokacija aktivna" : "Prikazi moju lokaciju"}
        >
          <LocateFixed className="h-4 w-4" />
          {userLocation ? "Moja lokacija" : "Prikazi lokaciju"}
        </button>
      </div>

      {activePharmacyId === null && (
        <div className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-2xl border border-slate-200/90 bg-white/95 px-2.5 py-2 shadow-lg backdrop-blur">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-slate-500">
            Status
          </p>
          <div className="flex flex-wrap items-center gap-1 text-xs font-semibold text-slate-700">
            <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[9px] font-bold leading-none text-blue-700">
              Dezurna
            </span>
            <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold leading-none text-emerald-700">
              Radi
            </span>
            <span className="inline-flex rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[9px] font-bold leading-none text-red-700">
              Ne radi
            </span>
          </div>
        </div>
      )}


      <MapContainer
        center={DEFAULT_CENTER}
        zoom={8}
        scrollWheelZoom={false}
        dragging={!isInteractionDisabled}
        doubleClickZoom={!isInteractionDisabled}
        touchZoom={!isInteractionDisabled}
        keyboard={!isInteractionDisabled}
        className={`h-full w-full ${isInteractionDisabled ? "pointer-events-none" : ""}`}
      >
        <MapBoundsController points={mapPoints} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userPoint && (
          <Marker position={userPoint} icon={createUserMarkerIcon()} title="Ja" />
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
              <span className="inline-flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${getTooltipDotClass(
                    pharmacy
                  )}`}
                />
                <span>{pharmacy.name}</span>
              </span>
            </Tooltip>
            <Popup
              className="pharmacy-map-popup"
              minWidth={228}
              maxWidth={228}
              eventHandlers={{
                remove: () => {
                  if (activePharmacyId === pharmacy.id) {
                    setActivePharmacyId(null);
                  }
                },
              }}
            >
              <PharmacyPopup
                pharmacy={pharmacy}
                medicineName={medicineName}
                doseStrengths={doseStrengths}
                userLocation={userLocation}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
}

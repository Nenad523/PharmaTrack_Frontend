import { PharmacyDetails, WorkingHours } from "../duty/types";
import { PharmacyDetailsApiResponse } from "./types";

type ApiErrorBody = {
  error?: {
    message?: string | string[];
  };
  message?: string | string[];
};

const FALLBACK_WORKING_DAY_NAMES = [
  "Ponedjeljak",
  "Utorak",
  "Srijeda",
  "Četvrtak",
  "Petak",
  "Subota",
  "Nedjelja",
];

export const ALL_CITIES_VALUE = "all";

export const isAbortError = (error: unknown) =>
  error instanceof Error && error.name === "AbortError";

export const getErrorMessage = async (response: Response) => {
  try {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = (await response.json()) as ApiErrorBody;
      const message = data.error?.message ?? data.message;

      if (Array.isArray(message)) {
        return message.join(", ");
      }

      return message || "Podaci nijesu dostupni.";
    }

    const text = await response.text();
    return text || "Podaci nijesu dostupni.";
  } catch {
    return "Podaci nijesu dostupni.";
  }
};

export const normalizeNumber = (value: number | string | null | undefined) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

export const normalizeWorkingHours = (items: WorkingHours[] | undefined) =>
  Array.isArray(items)
    ? items.map((item, index) => ({
        ...item,
        day_of_week:
          typeof item?.day_of_week === "string" && item.day_of_week.trim()
            ? item.day_of_week
            : FALLBACK_WORKING_DAY_NAMES[index % FALLBACK_WORKING_DAY_NAMES.length],
      }))
    : [];

export const normalizePharmacyDetails = (
  response: PharmacyDetailsApiResponse
): PharmacyDetails => ({
  id: response.data.id,
  name: response.data.name,
  address: response.data.address,
  city: response.data.city,
  latitude: normalizeNumber(response.data.latitude),
  longitude: normalizeNumber(response.data.longitude),
  isActive: response.data.isActive === true || response.data.isActive === 1,
  isOnDuty: response.data.isOnDuty,
  phones: Array.isArray(response.data.phones) ? response.data.phones : [],
  workingHours: normalizeWorkingHours(response.data.workingHours),
  dutySchedule: response.data.dutySchedule ?? null,
});

export const formatDistance = (value: number | string | null | undefined) => {
  const distance = normalizeNumber(value);

  if (distance === null) {
    return null;
  }

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }

  return `${distance.toFixed(distance < 10 ? 1 : 0)} km`;
};

export const getLatestInventoryUpdate = (doses: { lastUpdated?: string | null }[]) => {
  const timestamps = doses
    .map((dose) => (dose.lastUpdated ? new Date(dose.lastUpdated).getTime() : null))
    .filter((value): value is number => value !== null && Number.isFinite(value));

  if (timestamps.length === 0) {
    return null;
  }

  return new Date(Math.max(...timestamps));
};

export const formatRelativeUpdate = (date: Date | null) => {
  if (!date) {
    return "Ažuriranje nije dostupno";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.round(diffMs / 60000));

  if (diffMinutes < 1) {
    return "Upravo ažurirano";
  }

  if (diffMinutes < 60) {
    return `Prije ${diffMinutes} min`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `Prije ${diffHours} h`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `Prije ${diffDays} d`;
};

export const buildPharmacySearchParams = ({
  doseIds,
  sort,
  filters,
  userLocation,
  trackSearch,
}: {
  doseIds: number[];
  sort: "az" | "distance";
  filters: {
    name: string;
    address: string;
    cities: string[];
    openNow: boolean;
    onDuty: boolean;
    radiusEnabled: boolean;
    radius: number;
  };
  userLocation: { latitude: number; longitude: number } | null;
  trackSearch?: boolean;
}) => {
  const params = new URLSearchParams();

  doseIds.forEach((doseId) => params.append("doseIds", String(doseId)));

  if (sort === "distance" && userLocation) {
    params.set("sort", "distance");
  } else {
    params.set("sort", "az");
  }

  if (userLocation && (sort === "distance" || filters.radiusEnabled)) {
    params.set("uLat", String(userLocation.latitude));
    params.set("uLng", String(userLocation.longitude));
  }

  if (filters.radiusEnabled && userLocation) {
    params.set("radius", String(filters.radius));
  }

  if (filters.openNow) {
    params.set("openNow", "true");
  }

  if (filters.onDuty) {
    params.set("onDuty", "true");
  }

  if (filters.cities.length > 0) {
    filters.cities.forEach((city) => params.append("city", city));
  }

  if (filters.name.trim()) {
    params.set("name", filters.name.trim());
  }

  if (filters.address.trim()) {
    params.set("address", filters.address.trim());
  }

  if (trackSearch) {
    params.set("trackSearch", "true");
  }

  return params;
};

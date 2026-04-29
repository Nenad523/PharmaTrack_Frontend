"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiUrl } from "@/lib/api";
import CityFilter from "@/app/_components/api/v1/pharmacies/duty/city_filter";
import DutyCalendar from "@/app/_components/api/v1/pharmacies/duty/duty_calendar";
import DutyPharmacyList from "@/app/_components/api/v1/pharmacies/duty/duty_pharmacy_list";
import PharmacyDetailsPanel, {
  MobilePharmacyDetailsOverlay,
} from "@/app/_components/api/v1/pharmacies/duty/pharmacy_details_panel";
import { getLocalDateKey } from "@/app/_components/api/v1/pharmacies/duty/date_utils";
import {
  ALL_CITIES_VALUE,
  CitiesApiResponse,
  City,
  DutyPharmaciesApiResponse,
  DutyPharmacy,
  FALLBACK_CITIES,
  PharmacyDetails,
  PharmacyDetailsApiResponse,
} from "@/app/_components/api/v1/pharmacies/duty/types";

type ApiErrorBody = {
  error?: {
    message?: string | string[];
  };
  message?: string | string[];
};

const isAbortError = (error: unknown) =>
  error instanceof Error && error.name === "AbortError";

const getErrorMessage = async (response: Response) => {
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

const normalizeCities = (items: unknown): City[] => {
  if (!Array.isArray(items)) {
    return FALLBACK_CITIES;
  }

  const normalized = items.flatMap((item, index) => {
    if (typeof item === "string" && item.trim()) {
      return [{ id: index + 1, name: item.trim() }];
    }

    if (item && typeof item === "object" && "name" in item) {
      const city = item as { id?: unknown; name?: unknown };

      if (typeof city.name === "string" && city.name.trim()) {
        return [
          {
            id: typeof city.id === "number" ? city.id : index + 1,
            name: city.name.trim(),
          },
        ];
      }
    }

    return [];
  });

  return normalized.length > 0 ? normalized : FALLBACK_CITIES;
};

const normalizeNumber = (value: number | string | null) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
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

const normalizeWorkingHours = (items: PharmacyDetails["workingHours"] | undefined) =>
  Array.isArray(items)
    ? items.map((item, index) => ({
        ...item,
        day_of_week:
          typeof item?.day_of_week === "string" && item.day_of_week.trim()
            ? item.day_of_week
            : FALLBACK_WORKING_DAY_NAMES[index % FALLBACK_WORKING_DAY_NAMES.length],
      }))
    : [];

const normalizePharmacyDetails = (
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

export default function DutyPharmaciesPage() {
  const [selectedDate, setSelectedDate] = useState(() =>
    getLocalDateKey(new Date())
  );
  const [selectedCity, setSelectedCity] = useState(ALL_CITIES_VALUE);
  const [cities, setCities] = useState<City[]>(FALLBACK_CITIES);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState<DutyPharmacy[]>([]);
  const [isDutyLoading, setIsDutyLoading] = useState(true);
  const [dutyError, setDutyError] = useState("");
  const [detailsPharmacyId, setDetailsPharmacyId] = useState<number | null>(null);
  const [detailsPharmacy, setDetailsPharmacy] = useState<PharmacyDetails | null>(
    null
  );
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const detailsRequestId = useRef(0);

  const shouldShowDetailsPanel =
    isDetailsLoading || Boolean(detailsError) || Boolean(detailsPharmacy);

  const closeDetailsPanel = useCallback(() => {
    detailsRequestId.current += 1;
    setDetailsPharmacyId(null);
    setDetailsPharmacy(null);
    setDetailsError("");
    setIsDetailsLoading(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadCities = async () => {
      setIsCitiesLoading(true);

      try {
        const response = await fetch(apiUrl("/api/v1/cities"), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cities.");
        }

        const data = (await response.json()) as CitiesApiResponse;
        setCities(normalizeCities(data.data));
      } catch (error) {
        if (isAbortError(error) || controller.signal.aborted) {
          return;
        }

        setCities(FALLBACK_CITIES);
      } finally {
        if (!controller.signal.aborted) {
          setIsCitiesLoading(false);
        }
      }
    };

    void loadCities();

    return () => {
      controller.abort();
    };
  }, []);

  const loadDutyPharmacies = useCallback(
    async (signal?: AbortSignal) => {
      setIsDutyLoading(true);
      setDutyError("");

      try {
        const response = await fetch(
          apiUrl(`/api/v1/pharmacies/duty?date=${selectedDate}`),
          { signal }
        );

        if (!response.ok) {
          const message = await getErrorMessage(response);

          if (
            response.status === 404 &&
            message.toLowerCase().includes("nema dežurnih apoteka")
          ) {
            setPharmacies([]);
            return;
          }

          setDutyError(message);
          setPharmacies([]);
          return;
        }

        const data = (await response.json()) as DutyPharmaciesApiResponse;
        setPharmacies(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        if (isAbortError(error) || signal?.aborted) {
          return;
        }

        setPharmacies([]);
        setDutyError("Došlo je do greške pri učitavanju dežurnih apoteka.");
      } finally {
        if (!signal?.aborted) {
          setIsDutyLoading(false);
        }
      }
    },
    [selectedDate]
  );

  useEffect(() => {
    const controller = new AbortController();

    void loadDutyPharmacies(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadDutyPharmacies]);

  const filteredPharmacies = useMemo(() => {
    if (selectedCity === ALL_CITIES_VALUE) {
      return pharmacies;
    }

    return pharmacies.filter((pharmacy) => pharmacy.city === selectedCity);
  }, [pharmacies, selectedCity]);

  const handleDateChange = (dateKey: string) => {
    setSelectedDate(dateKey);
    closeDetailsPanel();
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    closeDetailsPanel();
  };

  const loadPharmacyDetails = useCallback(
    async (pharmacyId: number) => {
      if (detailsPharmacyId === pharmacyId) {
        closeDetailsPanel();
        return;
      }

      const requestId = detailsRequestId.current + 1;
      detailsRequestId.current = requestId;

      setDetailsPharmacyId(pharmacyId);
      setDetailsPharmacy(null);
      setDetailsError("");
      setIsDetailsLoading(true);

      try {
        const response = await fetch(apiUrl(`/api/v1/pharmacies/${pharmacyId}`));

        if (requestId !== detailsRequestId.current) {
          return;
        }

        if (!response.ok) {
          setDetailsError(await getErrorMessage(response));
          return;
        }

        const data = (await response.json()) as PharmacyDetailsApiResponse;

        if (requestId !== detailsRequestId.current) {
          return;
        }

        setDetailsPharmacy(normalizePharmacyDetails(data));
      } catch {
        if (requestId === detailsRequestId.current) {
          setDetailsError("Došlo je do greške pri učitavanju detalja apoteke.");
        }
      } finally {
        if (requestId === detailsRequestId.current) {
          setIsDetailsLoading(false);
        }
      }
    },
    [closeDetailsPanel, detailsPharmacyId]
  );

  const handleToggleDetails = (pharmacyId: number) => {
    void loadPharmacyDetails(pharmacyId);
  };

  const handleRetry = () => {
    void loadDutyPharmacies();
  };

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          <aside className="space-y-4 xl:sticky xl:top-24 xl:w-[300px] xl:flex-none">
            <DutyCalendar
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />
            <CityFilter
              cities={cities}
              selectedCity={selectedCity}
              isLoading={isCitiesLoading}
              onCityChange={handleCityChange}
            />
          </aside>

          <div className="min-w-0 flex-1">
            <DutyPharmacyList
              selectedDate={selectedDate}
              selectedCity={selectedCity}
              pharmacies={filteredPharmacies}
              totalCount={pharmacies.length}
              isLoading={isDutyLoading}
              error={dutyError}
              detailsPharmacyId={detailsPharmacyId}
              onToggleDetails={handleToggleDetails}
              onRetry={handleRetry}
            />
          </div>

          {shouldShowDetailsPanel && (
            <div className="hidden xl:block xl:w-[390px] xl:flex-none">
              <PharmacyDetailsPanel
                pharmacy={detailsPharmacy}
                isLoading={isDetailsLoading}
                error={detailsError}
                onClose={closeDetailsPanel}
              />
            </div>
          )}
        </div>
      </section>

      {shouldShowDetailsPanel && (
        <MobilePharmacyDetailsOverlay
          pharmacy={detailsPharmacy}
          isLoading={isDetailsLoading}
          error={detailsError}
          onClose={closeDetailsPanel}
        />
      )}
    </div>
  );
}

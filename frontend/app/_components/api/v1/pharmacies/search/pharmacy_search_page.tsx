"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Info,
  X,
  LocateFixed,
  Pill,
  RotateCw,
  Search,
} from "lucide-react";
import { apiUrl } from "@/lib/api";
import PharmacyDetailsPanel, {
  MobilePharmacyDetailsOverlay,
} from "../duty/pharmacy_details_panel";
import MedicineDetailsPanel, {
  MobileDetailsOverlay as MobileMedicineDetailsOverlay,
} from "../../medications/MedicineDetailsPanel/medicine_details_panel";
import { MedicineDetails } from "../../medications/types";
import {
  CitiesApiResponse,
  FALLBACK_CITIES,
  PharmacyDetails,
} from "../duty/types";
import MapPlaceholder from "./map_placeholder";
import PharmacySearchCard from "./pharmacy_search_card";
import MobileSearchControls from "./mobile_search_controls";
import SearchFilterPanel from "./search_filter_panel";
import {
  buildPharmacySearchParams,
  getErrorMessage,
  isAbortError,
  normalizePharmacyDetails,
} from "./search_utils";
import {
  City,
  MedicationAlternative,
  MedicationAlternativesApiResponse,
  MedicationDetailsApiResponse,
  MedicationDose,
  MedicationDosesApiResponse,
  PharmacyDetailsApiResponse,
  PharmacySearchApiResponse,
  PharmacySearchResult,
  SearchFilters,
  SearchSort,
  SearchViewMode,
  UserLocation,
} from "./types";
import ViewToggle from "./view_toggle";

const DEFAULT_FILTERS: SearchFilters = {
  name: "",
  address: "",
  cities: [],
  openNow: false,
  onDuty: false,
  radiusEnabled: false,
  radius: 10,
};

const DEFAULT_WARNING =
  "Prikazane informacije služe isključivo u informativne svrhe i ne predstavljaju zamjenu za savjet ljekara ili farmaceuta.";

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

const parseDoseIds = (searchParams: URLSearchParams) =>
  searchParams
    .getAll("doseIds")
    .map((doseId) => Number(doseId))
    .filter((doseId) => Number.isInteger(doseId) && doseId > 0);

const parseMedicineId = (searchParams: URLSearchParams) => {
  const medicineId = Number(searchParams.get("medicineId"));
  return Number.isInteger(medicineId) && medicineId > 0 ? medicineId : null;
};

export default function PharmacySearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const medicineId = useMemo(() => parseMedicineId(searchParams), [searchParams]);
  const doseIds = useMemo(() => parseDoseIds(searchParams), [searchParams]);
  const medicineName = searchParams.get("medicineName") ?? "Odabrani lijek";
  const doseStrengths = searchParams.getAll("doseStrengths");

  const pendingTrackSearch = useRef(searchParams.get("trackSearch") === "true");

  const [viewMode, setViewMode] = useState<SearchViewMode>("list");
  const [sort, setSort] = useState<SearchSort>("az");
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [cities, setCities] = useState<City[]>(FALLBACK_CITIES);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [pharmacies, setPharmacies] = useState<PharmacySearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [detailsPharmacyId, setDetailsPharmacyId] = useState<number | null>(null);
  const [detailsPharmacy, setDetailsPharmacy] = useState<PharmacyDetails | null>(
    null
  );
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const detailsRequestId = useRef(0);
  const [medicineDetailsId, setMedicineDetailsId] = useState<number | null>(null);
  const [medicineDetails, setMedicineDetails] = useState<MedicineDetails | null>(
    null
  );
  const [isMedicineDetailsLoading, setIsMedicineDetailsLoading] = useState(false);
  const [medicineDetailsError, setMedicineDetailsError] = useState("");
  const medicineDetailsRequestId = useRef(0);
  const [alternatives, setAlternatives] = useState<MedicationAlternative[]>([]);
  const [isAlternativesLoading, setIsAlternativesLoading] = useState(false);
  const [alternativesError, setAlternativesError] = useState("");
  const [selectedAlternative, setSelectedAlternative] =
    useState<MedicationAlternative | null>(null);
  const [selectedAlternativeDoses, setSelectedAlternativeDoses] = useState<
    MedicationDose[]
  >([]);
  const [selectedAlternativeDoseIds, setSelectedAlternativeDoseIds] = useState<
    number[]
  >([]);
  const [isAlternativeDosesLoading, setIsAlternativeDosesLoading] =
    useState(false);
  const [alternativeDosesError, setAlternativeDosesError] = useState("");
  const alternativesRequestId = useRef(0);
  const alternativeDosesRequestId = useRef(0);

  const shouldShowDetailsPanel =
    isDetailsLoading || Boolean(detailsError) || Boolean(detailsPharmacy);
  const shouldShowMedicineDetailsPanel =
    isMedicineDetailsLoading ||
    Boolean(medicineDetailsError) ||
    Boolean(medicineDetails);

  const closeDetailsPanel = useCallback(() => {
    detailsRequestId.current += 1;
    setDetailsPharmacyId(null);
    setDetailsPharmacy(null);
    setDetailsError("");
    setIsDetailsLoading(false);
  }, []);

  const closeMedicineDetailsPanel = useCallback(() => {
    medicineDetailsRequestId.current += 1;
    setMedicineDetailsId(null);
    setMedicineDetails(null);
    setMedicineDetailsError("");
    setIsMedicineDetailsLoading(false);
  }, []);

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocationError("Browser ne podržava geolokaciju.");
      return;
    }

    setIsLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        setLocationError("Nije moguće dobiti lokaciju korisnika.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60000,
        timeout: 10000,
      }
    );
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

  const loadPharmacies = useCallback(
    async (signal?: AbortSignal) => {
      if (doseIds.length === 0) {
        setPharmacies([]);
        setSearchError("Nijesu odabrane doze lijeka za pretragu.");
        return;
      }

      setIsSearchLoading(true);
      setSearchError("");

      try {
        const trackSearch = pendingTrackSearch.current;
        pendingTrackSearch.current = false;

        const params = buildPharmacySearchParams({
          doseIds,
          sort,
          filters,
          userLocation,
          trackSearch,
        });

        const response = await fetch(
          apiUrl(`/api/v1/pharmacies/search?${params.toString()}`),
          { signal }
        );

        if (!response.ok) {
          setPharmacies([]);
          setSearchError(await getErrorMessage(response));
          return;
        }

        const data = (await response.json()) as PharmacySearchApiResponse;
        setPharmacies(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        if (isAbortError(error) || signal?.aborted) {
          return;
        }

        setPharmacies([]);
        setSearchError("Došlo je do greške pri učitavanju apoteka.");
      } finally {
        if (!signal?.aborted) {
          setIsSearchLoading(false);
        }
      }
    },
    [doseIds, filters, sort, userLocation]
  );

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void loadPharmacies(controller.signal);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [loadPharmacies]);

  useEffect(() => {
    if (!userLocation && sort === "distance") {
      setSort("az");
    }
  }, [sort, userLocation]);

  useEffect(() => {
    alternativesRequestId.current += 1;
    alternativeDosesRequestId.current += 1;
    setAlternatives([]);
    setAlternativesError("");
    setIsAlternativesLoading(false);
    setSelectedAlternative(null);
    setSelectedAlternativeDoses([]);
    setSelectedAlternativeDoseIds([]);
    setAlternativeDosesError("");
    setIsAlternativeDosesLoading(false);
    closeMedicineDetailsPanel();
  }, [closeMedicineDetailsPanel, medicineId]);

  const handleFilterChange = <Key extends keyof SearchFilters>(
    key: Key,
    value: SearchFilters[Key]
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
    closeDetailsPanel();
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSort("az");
    closeDetailsPanel();
  };

  const mapDetailsToMedicine = (
    details: MedicationDetailsApiResponse,
    doses: MedicationDosesApiResponse
  ): MedicineDetails => {
    const activeIngredients = Array.isArray(details.data.activeIngredients)
      ? details.data.activeIngredients
      : [];
    const availableDoses = Array.isArray(doses.data)
      ? doses.data.map((dose) => dose.strength)
      : [];

    return {
      id: details.data.id,
      name: details.data.name,
      description: details.data.description,
      img_url: details.data.img_url || undefined,
      doses: ["Sve", ...availableDoses],
      activeSubstance:
        activeIngredients.length > 0
          ? activeIngredients.map((item) => item.name).join(", ")
          : "Nije dostupno",
      warning: DEFAULT_WARNING,
      activeIngredients,
    };
  };

  const loadMedicineDetails = useCallback(
    async (selectedMedicineId: number) => {
      if (medicineDetailsId === selectedMedicineId) {
        closeMedicineDetailsPanel();
        return;
      }

      const requestId = medicineDetailsRequestId.current + 1;
      medicineDetailsRequestId.current = requestId;

      closeDetailsPanel();
      setMedicineDetailsId(selectedMedicineId);
      setMedicineDetails(null);
      setMedicineDetailsError("");
      setIsMedicineDetailsLoading(true);

      try {
        const [detailsResponse, dosesResponse] = await Promise.all([
          fetch(apiUrl(`/api/v1/medication/${selectedMedicineId}`)),
          fetch(apiUrl(`/api/v1/medication/${selectedMedicineId}/doses`)),
        ]);

        if (requestId !== medicineDetailsRequestId.current) {
          return;
        }

        if (!detailsResponse.ok) {
          setMedicineDetailsError(await getErrorMessage(detailsResponse));
          return;
        }

        if (!dosesResponse.ok) {
          setMedicineDetailsError(await getErrorMessage(dosesResponse));
          return;
        }

        const detailsData =
          (await detailsResponse.json()) as MedicationDetailsApiResponse;
        const dosesData =
          (await dosesResponse.json()) as MedicationDosesApiResponse;

        if (requestId !== medicineDetailsRequestId.current) {
          return;
        }

        setMedicineDetails(mapDetailsToMedicine(detailsData, dosesData));
      } catch {
        if (requestId === medicineDetailsRequestId.current) {
          setMedicineDetailsError(
            "Došlo je do greške pri učitavanju detalja lijeka."
          );
        }
      } finally {
        if (requestId === medicineDetailsRequestId.current) {
          setIsMedicineDetailsLoading(false);
        }
      }
    },
    [closeDetailsPanel, closeMedicineDetailsPanel, medicineDetailsId]
  );

  const loadAlternatives = useCallback(async () => {
    if (!medicineId) {
      setAlternativesError("Nije moguće pronaći alternative za odabrani lijek.");
      return;
    }

    const requestId = alternativesRequestId.current + 1;
    alternativesRequestId.current = requestId;

    setIsAlternativesLoading(true);
    setAlternativesError("");
    setSelectedAlternative(null);
    setSelectedAlternativeDoses([]);
    setSelectedAlternativeDoseIds([]);
    setAlternativeDosesError("");

    try {
      const response = await fetch(
        apiUrl(`/api/v1/medication/${medicineId}/alternatives`)
      );

      if (requestId !== alternativesRequestId.current) {
        return;
      }

      if (!response.ok) {
        setAlternatives([]);
        setAlternativesError(await getErrorMessage(response));
        return;
      }

      const data = (await response.json()) as MedicationAlternativesApiResponse;
      const normalizedAlternatives = Array.isArray(data.data)
        ? data.data.filter(
            (medicine) =>
              typeof medicine.id === "number" &&
              typeof medicine.name === "string" &&
              medicine.name.trim() &&
              medicine.id !== medicineId &&
              medicine.isActive !== false &&
              medicine.isActive !== 0
          )
        : [];

      setAlternatives(normalizedAlternatives);

      if (normalizedAlternatives.length === 0) {
        setAlternativesError(
          data.message || "Nema dostupnih alternativa za ovaj lijek."
        );
      }
    } catch {
      if (requestId === alternativesRequestId.current) {
        setAlternatives([]);
        setAlternativesError("Došlo je do greške pri učitavanju alternativa.");
      }
    } finally {
      if (requestId === alternativesRequestId.current) {
        setIsAlternativesLoading(false);
      }
    }
  }, [medicineId]);

  const loadAlternativeDoses = useCallback(
    async (alternative: MedicationAlternative) => {
      const requestId = alternativeDosesRequestId.current + 1;
      alternativeDosesRequestId.current = requestId;

      setSelectedAlternative(alternative);
      setSelectedAlternativeDoses([]);
      setSelectedAlternativeDoseIds([]);
      setAlternativeDosesError("");
      setIsAlternativeDosesLoading(true);

      try {
        const response = await fetch(
          apiUrl(`/api/v1/medication/${alternative.id}/doses`)
        );

        if (requestId !== alternativeDosesRequestId.current) {
          return;
        }

        if (!response.ok) {
          setAlternativeDosesError(await getErrorMessage(response));
          return;
        }

        const data = (await response.json()) as MedicationDosesApiResponse;
        const doses = Array.isArray(data.data)
          ? data.data.filter(
              (dose) =>
                typeof dose.id === "number" &&
                typeof dose.strength === "string" &&
                dose.strength.trim()
            )
          : [];

        setSelectedAlternativeDoses(doses);

        if (doses.length === 0) {
          setAlternativeDosesError(
            data.message || "Ova alternativa nema dostupnih doza."
          );
        }
      } catch {
        if (requestId === alternativeDosesRequestId.current) {
          setAlternativeDosesError(
            "Došlo je do greške pri učitavanju doza alternative."
          );
        }
      } finally {
        if (requestId === alternativeDosesRequestId.current) {
          setIsAlternativeDosesLoading(false);
        }
      }
    },
    []
  );

  const handleAlternativeDoseClick = (doseId: number) => {
    setSelectedAlternativeDoseIds((current) =>
      current.includes(doseId)
        ? current.filter((selectedDoseId) => selectedDoseId !== doseId)
        : [...current, doseId]
    );
  };

  const handleSearchAlternative = () => {
    if (!selectedAlternative || selectedAlternativeDoseIds.length === 0) {
      return;
    }

    const selectedDoses = selectedAlternativeDoses.filter((dose) =>
      selectedAlternativeDoseIds.includes(dose.id)
    );

    const params = new URLSearchParams();
    params.set("medicineId", String(selectedAlternative.id));
    params.set("medicineName", selectedAlternative.name);
    params.set("trackSearch", "true");

    selectedDoses.forEach((dose) => {
      params.append("doseIds", String(dose.id));
      params.append("doseStrengths", dose.strength);
    });

    closeDetailsPanel();
    pendingTrackSearch.current = true;
    router.push(`/api/v1/pharmacies/search?${params.toString()}`);
  };

  const handleSortChange = (value: SearchSort) => {
    if (value === "distance" && !userLocation) {
      requestLocation();
      return;
    }

    setSort(value);
    closeDetailsPanel();
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;

    if (filters.name.trim()) count += 1;
    if (filters.address.trim()) count += 1;
    if (filters.cities.length > 0) count += 1;
    if (filters.openNow) count += 1;
    if (filters.onDuty) count += 1;
    if (filters.radiusEnabled) count += 1;

    return count;
  }, [filters]);

  const selectedCityLabel =
    filters.cities.length === 0
      ? "all"
      : filters.cities.length === 1
        ? filters.cities[0]
        : `${filters.cities.length} grada`;

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
      closeMedicineDetailsPanel();

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
    [closeDetailsPanel, closeMedicineDetailsPanel, detailsPharmacyId]
  );

  const handleRetry = () => {
    void loadPharmacies();
  };

  const countLabel = pharmacies.length === 1 ? "apoteka" : "apoteka";

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <Link
              href="/api/v1/medications"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Nazad na pretragu
            </Link>
            <div className="mt-4 flex items-start gap-3">
              <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Search className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                  {medicineName}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {doseStrengths.length > 0
                    ? `Doze: ${doseStrengths.join(", ")}`
                    : "Rezultati za odabrane doze"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={requestLocation}
              disabled={isLocating}
              className={`hidden h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition sm:inline-flex ${
                userLocation
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
              } disabled:cursor-wait disabled:opacity-70`}
            >
              <LocateFixed className="h-4 w-4" />
              {userLocation ? "Lokacija uključena" : "Koristi lokaciju"}
            </button>
            <div className="hidden sm:block">
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          </div>
        </div>

        <MobileSearchControls
          activeFiltersCount={activeFiltersCount}
          selectedCityLabel={selectedCityLabel}
          sort={sort}
          userLocation={userLocation}
          isLocating={isLocating}
          isPinned={isMobileFiltersOpen}
          viewMode={viewMode}
          showSort={viewMode === "list"}
          onOpenFilters={() => setIsMobileFiltersOpen(true)}
          onRequestLocation={requestLocation}
          onSortChange={handleSortChange}
          onViewModeChange={setViewMode}
        />
        {isMobileFiltersOpen && <div className="h-28 xl:hidden" />}

        <div
          className={`flex flex-col gap-6 xl:flex-row xl:items-start ${
            viewMode === "map" ? "xl:min-h-[calc(100vh-15rem)]" : ""
          }`}
        >
          <div className="hidden space-y-4 xl:sticky xl:top-24 xl:block xl:w-[300px] xl:flex-none">
            <SearchFilterPanel
              filters={filters}
              cities={cities}
              isCitiesLoading={isCitiesLoading}
              userLocation={userLocation}
              isLocating={isLocating}
              locationError={locationError}
              onFilterChange={handleFilterChange}
              onRequestLocation={requestLocation}
              onResetFilters={handleResetFilters}
            />
          </div>

          <div className="min-w-0 flex-1">
            <section
              className={`min-w-0 xl:sticky xl:top-24 xl:flex xl:flex-col ${
                viewMode === "map"
                  ? "xl:h-[calc(100vh-7rem)]"
                  : "xl:max-h-[calc(100vh-7rem)]"
              }`}
            >
              <div className="mb-5 flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between xl:flex-none">
                <div>
                  <p className="text-sm font-semibold text-blue-600">
                    {isSearchLoading
                      ? "Učitavanje rezultata..."
                      : `${pharmacies.length} ${countLabel} za prikaz`}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Dostupnost lijeka
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {viewMode === "map"
                      ? "Mapa prikazuje iste apoteke sa lokacijama, dozama i brzim otvaranjem detalja."
                      : "Lista prikazuje apoteke koje imaju odabranu dozu na stanju."}
                  </p>
                </div>

                {viewMode === "list" && (
                  <label className="hidden w-full items-center gap-2 sm:flex sm:w-auto">
                    <span className="text-sm font-semibold text-slate-500">
                      Sortiraj:
                    </span>
                    <select
                      value={sort}
                      onChange={(event) =>
                        handleSortChange(event.target.value as SearchSort)
                      }
                      className="h-11 min-w-36 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="az">A-Z</option>
                      <option value="distance" disabled={!userLocation}>
                        Udaljenost
                      </option>
                    </select>
                  </label>
                )}
              </div>

              <div
                className={`${
                  viewMode === "map"
                    ? "xl:min-h-0 xl:flex-1 xl:overflow-hidden"
                    : "xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:pb-2 xl:pr-2"
                }`}
              >
                {viewMode === "map" ? (
                  <MapPlaceholder
                    pharmacies={pharmacies}
                    userLocation={userLocation}
                  />
                ) : isSearchLoading ? (
                  <LoadingList />
                ) : searchError ? (
                  <ErrorState error={searchError} onRetry={handleRetry} />
                ) : pharmacies.length === 0 ? (
                  <EmptyState
                    medicineId={medicineId}
                    hasActiveFilters={activeFiltersCount > 0}
                    alternatives={alternatives}
                    isAlternativesLoading={isAlternativesLoading}
                    alternativesError={alternativesError}
                    selectedAlternative={selectedAlternative}
                    selectedAlternativeDoses={selectedAlternativeDoses}
                    selectedAlternativeDoseIds={selectedAlternativeDoseIds}
                    isAlternativeDosesLoading={isAlternativeDosesLoading}
                    alternativeDosesError={alternativeDosesError}
                    onLoadAlternatives={loadAlternatives}
                    onSelectAlternative={(alternative) =>
                      void loadAlternativeDoses(alternative)
                    }
                    onToggleAlternativeDose={handleAlternativeDoseClick}
                    onSearchAlternative={handleSearchAlternative}
                    onResetFilters={handleResetFilters}
                    onLoadMedicineDetails={(selectedMedicineId) =>
                      void loadMedicineDetails(selectedMedicineId)
                    }
                  />
                ) : (
                  <div className="grid gap-4 animate-fade-in">
                    {pharmacies.map((pharmacy) => (
                      <PharmacySearchCard
                        key={pharmacy.id}
                        pharmacy={pharmacy}
                        detailsPharmacyId={detailsPharmacyId}
                        onToggleDetails={(pharmacyId) =>
                          void loadPharmacyDetails(pharmacyId)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {viewMode !== "map" && shouldShowDetailsPanel && (
            <div className="hidden xl:sticky xl:top-24 xl:block xl:w-[390px] xl:flex-none">
              <PharmacyDetailsPanel
                pharmacy={detailsPharmacy}
                isLoading={isDetailsLoading}
                error={detailsError}
                onClose={closeDetailsPanel}
              />
            </div>
          )}

          {viewMode !== "map" && shouldShowMedicineDetailsPanel && (
            <div className="hidden xl:sticky xl:top-24 xl:block xl:w-[390px] xl:flex-none">
              {isMedicineDetailsLoading ? (
                <div className="rounded-[28px] border border-blue-200/80 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-blue-600">
                    Učitavanje detalja lijeka...
                  </p>
                </div>
              ) : medicineDetailsError ? (
                <div className="rounded-[28px] border border-red-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-red-600">
                    Detalji lijeka nijesu dostupni.
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {medicineDetailsError}
                  </p>
                  <button
                    type="button"
                    onClick={closeMedicineDetailsPanel}
                    className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Zatvori
                  </button>
                </div>
              ) : (
                medicineDetails && (
                  <MedicineDetailsPanel
                    medicine={medicineDetails}
                    onClose={closeMedicineDetailsPanel}
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>

      {viewMode !== "map" && shouldShowDetailsPanel && (
        <MobilePharmacyDetailsOverlay
          pharmacy={detailsPharmacy}
          isLoading={isDetailsLoading}
          error={detailsError}
          onClose={closeDetailsPanel}
        />
      )}

      {viewMode !== "map" && medicineDetails && (
        <MobileMedicineDetailsOverlay
          medicine={medicineDetails}
          onClose={closeMedicineDetailsPanel}
        />
      )}

      {isMobileFiltersOpen && (
        <div className="fixed inset-x-4 top-36 z-40 xl:hidden animate-fade-in">
          <div className="max-h-[70vh] overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]">
            <div className="mb-4 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Pretraga apoteka
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Filteri
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={requestLocation}
                  disabled={isLocating}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-full border px-3 text-sm font-semibold transition ${
                    userLocation
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-600"
                  } disabled:cursor-wait disabled:opacity-70`}
                  aria-label={userLocation ? "Lokacija aktivna" : "Moja lokacija"}
                >
                  <LocateFixed className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
                  aria-label="Zatvori filtere"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <SearchFilterPanel
              filters={filters}
              cities={cities}
              isCitiesLoading={isCitiesLoading}
              userLocation={userLocation}
              isLocating={isLocating}
              locationError={locationError}
              onFilterChange={handleFilterChange}
              onRequestLocation={requestLocation}
              onResetFilters={handleResetFilters}
              variant="mobile"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingList() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex animate-pulse gap-4">
            <div className="h-10 w-10 rounded-2xl bg-slate-200" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-2/5 rounded bg-slate-200" />
              <div className="h-4 w-4/5 rounded bg-slate-100" />
              <div className="h-4 w-1/2 rounded bg-slate-100" />
              <div className="flex gap-2">
                <div className="h-7 w-16 rounded-full bg-slate-100" />
                <div className="h-7 w-20 rounded-full bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-red-50 p-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Nije moguće učitati rezultate.
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <RotateCw className="h-4 w-4" />
            Pokušaj ponovo
          </button>
        </div>
      </div>
    </div>
  );
}

type EmptyStateProps = {
  medicineId: number | null;
  hasActiveFilters: boolean;
  alternatives: MedicationAlternative[];
  isAlternativesLoading: boolean;
  alternativesError: string;
  selectedAlternative: MedicationAlternative | null;
  selectedAlternativeDoses: MedicationDose[];
  selectedAlternativeDoseIds: number[];
  isAlternativeDosesLoading: boolean;
  alternativeDosesError: string;
  onLoadAlternatives: () => void;
  onSelectAlternative: (alternative: MedicationAlternative) => void;
  onToggleAlternativeDose: (doseId: number) => void;
  onSearchAlternative: () => void;
  onResetFilters: () => void;
  onLoadMedicineDetails: (medicineId: number) => void;
};

function EmptyState({
  medicineId,
  hasActiveFilters,
  alternatives,
  isAlternativesLoading,
  alternativesError,
  selectedAlternative,
  selectedAlternativeDoses,
  selectedAlternativeDoseIds,
  isAlternativeDosesLoading,
  alternativeDosesError,
  onLoadAlternatives,
  onSelectAlternative,
  onToggleAlternativeDose,
  onSearchAlternative,
  onResetFilters,
  onLoadMedicineDetails,
}: EmptyStateProps) {
  const hasLoadedAlternatives =
    alternatives.length > 0 || Boolean(alternativesError);
  const canSearchAlternative =
    Boolean(selectedAlternative) && selectedAlternativeDoseIds.length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-in">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-slate-100 p-2 text-slate-500">
          <AlertCircle className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-slate-900">
            Nema apoteka za prikaz.
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {hasActiveFilters
              ? "Nema rezultata za odabrani lijek sa trenutnim filterima."
              : "Nema rezultata za odabrani lijek i dozu."}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onLoadAlternatives}
              disabled={!medicineId || isAlternativesLoading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {isAlternativesLoading ? (
                <RotateCw className="h-4 w-4 animate-spin" />
              ) : (
                <Pill className="h-4 w-4" />
              )}
              {isAlternativesLoading ? "Učitavanje..." : "Prikaži alternative"}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
              >
                <X className="h-4 w-4" />
                Očisti filtere
              </button>
            )}
          </div>

          {!medicineId && (
            <p className="mt-3 text-sm font-semibold text-amber-700">
              Lijek nije dostupan u URL parametrima, pa alternative nije moguće
              učitati sa ove stranice.
            </p>
          )}

          {hasLoadedAlternatives && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              {alternativesError && (
                <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                  {alternativesError}
                </p>
              )}

              {alternatives.length > 0 && (
                <>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Odaberite alternativni lijek
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {alternatives.map((alternative) => {
                      const selected = selectedAlternative?.id === alternative.id;

                      return (
                        <article
                          key={alternative.id}
                          className={`rounded-2xl border p-4 transition ${
                            selected
                              ? "border-blue-300 bg-blue-50 shadow-sm shadow-blue-100"
                              : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                                selected
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {selected ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <Pill className="h-4 w-4" />
                              )}
                            </span>
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-slate-900">
                                {alternative.name}
                              </h3>
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                {alternative.description ||
                                  "Opis alternative nije dostupan."}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => onSelectAlternative(alternative)}
                              aria-pressed={selected}
                              className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
                                selected
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                              }`}
                            >
                              {selected && <CheckCircle2 className="h-4 w-4" />}
                              Odaberi
                            </button>

                            <button
                              type="button"
                              onClick={() => onLoadMedicineDetails(alternative.id)}
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                            >
                              <Info className="h-4 w-4" />
                              Detalji
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </>
              )}

              {selectedAlternative && (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">
                    Doze za {selectedAlternative.name}
                  </p>

                  {isAlternativeDosesLoading ? (
                    <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                      <RotateCw className="h-4 w-4 animate-spin" />
                      Učitavanje doza...
                    </p>
                  ) : alternativeDosesError ? (
                    <p className="mt-3 text-sm font-semibold text-amber-700">
                      {alternativeDosesError}
                    </p>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedAlternativeDoses.map((dose) => {
                        const selected = selectedAlternativeDoseIds.includes(
                          dose.id
                        );

                        return (
                          <button
                            key={dose.id}
                            type="button"
                            onClick={() => onToggleAlternativeDose(dose.id)}
                            aria-pressed={selected}
                            className={`min-h-10 rounded-full border px-3 py-1.5 text-sm font-bold transition ${
                              selected
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:text-emerald-700"
                            }`}
                          >
                            {dose.strength}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={onSearchAlternative}
                    disabled={!canSearchAlternative || isAlternativeDosesLoading}
                    className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <Search className="h-4 w-4" />
                    Pretraži ovu alternativu
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

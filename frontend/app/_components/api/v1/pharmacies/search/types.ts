import { City, PharmacyDetailsApiResponse } from "../duty/types";

export type PharmacySearchDose = {
  doseId: number;
  strength: string;
  lastUpdated?: string | null;
};

export type PharmacySearchResult = {
  id: number;
  name: string;
  address: string;
  city: string;
  latitude: number | string | null;
  longitude: number | string | null;
  distance?: number | string | null;
  isOpenNow: boolean;
  isOnDuty: boolean;
  openUntil: string | null;
  availabilitySource: "exception" | "duty" | "working_hours" | null;
  doses: PharmacySearchDose[];
};

export type PharmacySearchApiResponse = {
  success?: boolean;
  data: PharmacySearchResult[];
  count?: number;
  message?: string;
};

export type SearchViewMode = "list" | "map";

export type SearchSort = "az" | "distance";

export type SearchFilters = {
  name: string;
  address: string;
  cities: string[];
  openNow: boolean;
  onDuty: boolean;
  radiusEnabled: boolean;
  radius: number;
};

export type UserLocation = {
  latitude: number;
  longitude: number;
};

export type { City, PharmacyDetailsApiResponse };

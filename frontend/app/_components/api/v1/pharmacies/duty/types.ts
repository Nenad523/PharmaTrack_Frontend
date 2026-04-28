export const ALL_CITIES_VALUE = "all";

export type City = {
  id: number;
  name: string;
};

export type DutyPharmacy = {
  id: number;
  name: string;
  address: string;
  city: string;
  phone?: string | null;
  dutyStart: string;
  dutyEnd: string;
};

export type WorkingHours = {
  day_of_week: string;
  open_time: string;
  close_time: string;
};

export type PharmacyDetails = {
  id: number;
  name: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  isOnDuty: boolean;
  phones: string[];
  workingHours: WorkingHours[];
  dutySchedule: {
    startDatetime: string;
    endDatetime: string;
  } | null;
};

export type CitiesApiResponse = {
  success?: boolean;
  data: City[];
  count?: number;
  message?: string;
};

export type DutyPharmaciesApiResponse = {
  success?: boolean;
  data: DutyPharmacy[];
  count?: number;
  message?: string;
};

export type PharmacyDetailsApiResponse = {
  success?: boolean;
  data: {
    id: number;
    name: string;
    address: string;
    city: string;
    latitude: number | string | null;
    longitude: number | string | null;
    isActive: boolean | number;
    isOnDuty: boolean;
    phones?: string[];
    workingHours?: WorkingHours[];
    dutySchedule?: {
      startDatetime: string;
      endDatetime: string;
    } | null;
  };
};

export const FALLBACK_CITIES: City[] = [
  { id: 1, name: "Podgorica" },
  { id: 2, name: "Nikšić" },
  { id: 3, name: "Herceg Novi" },
  { id: 4, name: "Budva" },
  { id: 5, name: "Bar" },
  { id: 6, name: "Ulcinj" },
  { id: 7, name: "Kotor" },
  { id: 8, name: "Tivat" },
  { id: 9, name: "Cetinje" },
  { id: 10, name: "Bijelo Polje" },
  { id: 11, name: "Berane" },
  { id: 12, name: "Pljevlja" },
  { id: 13, name: "Danilovgrad" },
  { id: 14, name: "Mojkovac" },
  { id: 15, name: "Kolašin" },
];

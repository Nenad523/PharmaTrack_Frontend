export type AdminNotice = {
  type: "success" | "error" | "info";
  message: string;
};

export type ActiveIngredient = {
  id: number;
  name: string;
};

export type MedicationDose = {
  id: number;
  strength: string;
};

export type MedicationSearchResult = {
  id: number;
  name: string;
  description: string | null;
  img_url?: string | null;
};

export type MedicationDetails = MedicationSearchResult & {
  activeIngredients: ActiveIngredient[];
};

export type MedicationPayload = {
  name: string;
  description?: string;
};

export type MedicationDetailsResponse = {
  success?: boolean;
  data: MedicationDetails;
};

export type MedicationSearchResponse = {
  success?: boolean;
  data?: MedicationSearchResult[];
  count?: number;
  message?: string;
};

export type MedicationDosesResponse = {
  success?: boolean;
  data?: MedicationDose[];
  count?: number;
  message?: string;
};

export type IngredientsResponse = {
  success?: boolean;
  data?: ActiveIngredient[];
  count?: number;
};

export type ActiveIngredient = {
  id: number;
  name: string;
};

export type Medicine = {
  id: number;
  name: string;
  description: string;
  doses: string[];
  activeSubstance: string;
  warning: string;
};

export type MedicineSearchResult = {
  id: number;
  name: string;
  description: string;
  img_url?: string;
};

export type MedicineDetails = Medicine & {
  activeIngredients: ActiveIngredient[];
};

export type MedicationDetailsApiResponse = {
  success: boolean;
  data: {
    id: number;
    name: string;
    description: string;
    img_url: string;
    activeIngredients?: ActiveIngredient[];
  };
};

export type MedicationSearchApiResponse = {
  success?: boolean;
  data: MedicineSearchResult[];
  count?: number;
  message?: string;
};

export type MedicationDosesApiResponse = {
  success?: boolean;
  data: {
    id: number;
    strength: string;
  }[];
  count?: number;
  message?: string;
};

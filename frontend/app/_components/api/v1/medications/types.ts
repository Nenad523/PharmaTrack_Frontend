export type Medicine = {
  id: number;
  name: string;
  description: string;
  doses: string[];
  activeSubstance: string;
  warning: string;
};

export type MedicationDetailsApiResponse = {
  success: boolean;
  data: {
    id: number;
    name: string;
    description: string;
    img_url: string;
    activeIngredients: {
      id: number;
      name: string;
    }[];
  };
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

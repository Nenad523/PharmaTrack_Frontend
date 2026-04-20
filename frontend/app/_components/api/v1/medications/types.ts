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
  img_url: string;
};

export type MedicineDetails = {
  id: number;
  name: string;
  description: string;
  img_url: string;
  activeIngredients: { id: number; name: string }[];
};

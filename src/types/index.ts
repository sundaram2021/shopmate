export interface Product {
  objectID: string;
  name: string;
  description?: string;
  brand?: string;
  categories?: string[];
  hierarchicalCategories?: {
    lvl0?: string;
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
  };
  type?: string;
  price?: number;
  price_range?: string;
  image: string;
  url?: string;
  free_shipping?: boolean;
  popularity?: number;
  rating?: number;
  [key: string]: unknown;
}

export interface QuickAction {
  id: string;
  label: string;
  query: string;
}

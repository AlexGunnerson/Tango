export type AvailabilityScore = 
  | '1-Everyone Has It'
  | '2 - 9/10 people have it'
  | '3 - 5/10 people have it'
  | '4 - Seasonal';

export interface Material {
  id: string;
  material: string;
  isFeatured: boolean;
  alternative1?: string;
  alternative2?: string;
  alternative3?: string;
  availabilityScore: AvailabilityScore;
  icon?: string;
  checked?: boolean; // For UI state
  createdAt: string;
  updatedAt: string;
}

export interface GameConfigMaterial {
  id: string;
  gameConfigId: string;
  materialId: string;
  isRequired: boolean;
  quantity: number;
  quantityType: 'TOTAL' | 'PER_USER';
  notes?: string;
  createdAt: string;
}

export interface GameMaterialAlternative {
  id: string;
  gameConfigMaterialId: string;
  alternativeMaterialId: string;
  isAcceptable: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialWithAlternatives {
  id: string;
  name: string;
  alternatives: string[];
  availabilityScore: AvailabilityScore;
  icon?: string;
  checked?: boolean;
}

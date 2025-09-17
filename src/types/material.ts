export type AvailabilityScore = 
  | '1-Everyone Has It'
  | '2 - 9/10 people have it'
  | '3 - 5/10 people have it'
  | '4 - Seasonal';

export interface Material {
  id: string;
  material: string;
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
  createdAt: string;
}

export interface MaterialWithAlternatives {
  id: string;
  name: string;
  alternatives: string[];
  availabilityScore: AvailabilityScore;
  icon?: string;
  checked?: boolean;
}

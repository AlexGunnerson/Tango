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

export interface GameMaterial {
  id: string;
  gameId: string;
  materialId: string;
  quantityRequired: number;
  quantityType: 'TOTAL' | 'PER_USER';
  notes?: string;
  alternative1: boolean;
  alternative2: boolean;
  alternative3: boolean;
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

export interface UserMaterial {
  id: string;
  userId: string;
  materialId: string;
  quantityAvailable: number | null; // null = "has some", number = exact quantity
  createdAt: string;
  updatedAt: string;
}

export interface UserMaterialWithDetails extends UserMaterial {
  material: Material; // JOIN with materials table
}

export interface AvailableGame {
  gameId: string;
  gameTitle: string;
  gameDescription: string;
  minPlayers: number;
  maxPlayers: number;
  canPlayWithPlayerCount: boolean;
  materialsNeeded: number;
  userHasMaterials: number;
}

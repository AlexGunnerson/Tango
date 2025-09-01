// Common utility types and interfaces used throughout the app
import type { User } from './user';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface FilterOptions {
  categories?: string[];
  themes?: string[];
  requiredItems?: string[];
  difficulty?: string;
  minPlayers?: number;
  maxPlayers?: number;
  isPremium?: boolean;
  searchQuery?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface ScreenProps extends NavigationProps {
  // Add common screen props here
}

export interface ComponentProps {
  className?: string;
  testID?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface Timer {
  duration: number; // in seconds
  remainingTime: number;
  isRunning: boolean;
  isPaused: boolean;
}

export interface MediaFile {
  id: string;
  uri: string;
  type: 'image' | 'video';
  createdAt: string;
  gameSessionId?: string;
  gameId?: string;
}

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export interface Punishment {
  id: string;
  title: string;
  description: string;
  category: PunishmentCategory;
  duration?: number; // in seconds for timed punishments
  isActive: boolean;
}

// Type guards
export const isApiError = (response: any): response is ApiResponse => {
  return response && typeof response.success === 'boolean';
};

export const isValidUser = (user: any): user is User => {
  return user && typeof user.id === 'string' && typeof user.email === 'string';
};

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & 
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

// Re-export commonly used types from other modules
export type { User, UserPreferences, UserStats } from './user';
export type { 
  Game, 
  GameSession, 
  Player, 
  GameMode, 
  GameCategory, 
  GameSessionStatus 
} from './game';

// Enums
export enum PunishmentCategory {
  SPEECH = 'speech',
  PERFORMANCE = 'performance',
  TASK = 'task',
  SILLY = 'silly'
}

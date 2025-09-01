export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  isPremium: boolean;
  subscriptionType?: SubscriptionType;
  subscriptionExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  autoStartGames: boolean;
  preferredGameCategories: string[];
  language: string;
  theme: AppTheme;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  favoriteGameMode: string;
  longestWinStreak: number;
  currentWinStreak: number;
  totalPlayTime: number; // in minutes
  achievementsUnlocked: string[];
  lastPlayedAt?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  deviceId: string;
  isActive: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export interface UserProfile {
  user: User;
  recentGames: GameHistory[];
  achievements: Achievement[];
  friends: Friend[];
}

export interface GameHistory {
  id: string;
  gameId: string;
  gameTitle: string;
  gameMode: string;
  playedAt: string;
  duration: number;
  result: GameResult;
  score: number;
  opponents: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: AchievementRarity;
}

export interface Friend {
  id: string;
  displayName: string;
  avatar?: string;
  isOnline: boolean;
  lastSeenAt: string;
  gamesPlayedTogether: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  isLoading: boolean;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  displayName: string;
}

export interface SocialAuthProvider {
  provider: 'google' | 'apple' | 'facebook';
  token: string;
}

// Enums
export enum SubscriptionType {
  FREE = 'free',
  PREMIUM = 'premium',
  PREMIUM_PLUS = 'premium_plus'
}

export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export enum GameResult {
  WIN = 'win',
  LOSS = 'loss',
  DRAW = 'draw'
}

export enum AchievementRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

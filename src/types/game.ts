export interface Game {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  theme?: GameTheme;
  requiredItems: string[];
  minPlayers: number;
  maxPlayers: number;
  estimatedDuration: number; // in minutes
  difficulty: GameDifficulty;
  instructions: string;
  videoUrl?: string;
  hasTimer: boolean;
  timerDuration?: number; // in seconds
  gameType: GameType;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GameSession {
  id: string;
  gameMode: GameMode;
  players: Player[];
  games: Game[];
  currentGameIndex: number;
  currentRound: number;
  maxRounds: number;
  scores: PlayerScore[];
  status: GameSessionStatus;
  punishment?: string;
  startedAt: string;
  completedAt?: string;
  handicaps: PlayerHandicap[];
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  teamId?: string;
}

export interface PlayerScore {
  playerId: string;
  gameId: string;
  score: number;
  won: boolean;
  round: number;
}

export interface PlayerHandicap {
  playerId: string;
  gameId: string;
  handicapType: HandicapType;
  description: string;
}

export interface Team {
  id: string;
  name: string;
  playerIds: string[];
  color: string;
}

export interface Tournament {
  id: string;
  name: string;
  participants: TournamentParticipant[];
  bracket: TournamentBracket;
  currentRound: number;
  status: TournamentStatus;
  createdAt: string;
  completedAt?: string;
}

export interface TournamentParticipant {
  id: string;
  name: string;
  isTeam: boolean;
  teamId?: string;
}

export interface TournamentBracket {
  rounds: TournamentRound[];
}

export interface TournamentRound {
  roundNumber: number;
  matches: TournamentMatch[];
}

export interface TournamentMatch {
  id: string;
  participant1: TournamentParticipant;
  participant2: TournamentParticipant;
  winner?: TournamentParticipant;
  status: MatchStatus;
  gameSessionId?: string;
}

// Enums
export enum GameCategory {
  CREATIVE = 'creative',
  PHYSICAL = 'physical',
  FOODIE = 'foodie',
  MENTAL = 'mental',
  PARTY = 'party'
}

export enum GameTheme {
  CHRISTMAS = 'christmas',
  HALLOWEEN = 'halloween',
  SUMMER = 'summer',
  WINTER = 'winter',
  BIRTHDAY = 'birthday',
  HOLIDAY = 'holiday'
}

export enum GameDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum GameType {
  COMPETITIVE = 'competitive',
  COOPERATIVE = 'cooperative',
  TEAM_VS_TEAM = 'team_vs_team',
  SOLO = 'solo'
}

export enum GameMode {
  ONE_VS_ONE = '1v1',
  TWO_VS_TWO = '2v2',
  COOP = 'coop',
  TOURNAMENT = 'tournament'
}

export enum GameSessionStatus {
  SETUP = 'setup',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum HandicapType {
  TIME_REDUCTION = 'time_reduction',
  EXTRA_CHALLENGE = 'extra_challenge',
  ITEM_RESTRICTION = 'item_restriction'
}

export enum TournamentStatus {
  SETUP = 'setup',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum MatchStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

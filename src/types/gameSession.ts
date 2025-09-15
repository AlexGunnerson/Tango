// Game Session specific types for 1v1 flow state management
export interface GameSessionState {
  // Session metadata
  sessionId: string;
  gameMode: '1v1' | '2v2' | 'coop' | 'tournament';
  status: GameSessionStatus;
  
  // Players
  player1: GamePlayer;
  player2: GamePlayer;
  
  // Game flow
  selectedGames: string[]; // Array of 5 game IDs for best-of-5
  currentGameIndex: number;
  currentRound: number;
  maxRounds: number; // Always 5 for 1v1 (best of 5, first to 3 wins)
  
  // Game configuration
  punishment?: string;
  availableItems: string[];
  
  // Session timestamps
  startedAt: Date;
  completedAt?: Date;
}

export interface GamePlayer {
  id: string;
  name: string;
  originalName: string; // For display purposes when names get modified for handicaps
  score: number;
  wins: GameRoundResult[];
  currentHandicap?: PlayerHandicap;
}

export interface GameRoundResult {
  gameId: string;
  gameTitle: string;
  round: number;
  won: boolean;
  completedAt: Date;
  handicapApplied?: PlayerHandicap;
}

export interface PlayerHandicap {
  type: HandicapType;
  description: string;
  gameId: string;
  round: number;
}

export enum GameSessionStatus {
  SETUP = 'setup',
  PLAYER_SELECTION = 'player_selection',
  PUNISHMENT_SELECTION = 'punishment_selection',
  ITEM_GATHERING = 'item_gathering',
  GAME_INSTRUCTIONS = 'game_instructions',
  GAMEPLAY = 'gameplay',
  SCORING = 'scoring',
  GAME_COMPLETE = 'game_complete',
  CANCELLED = 'cancelled'
}

export enum HandicapType {
  TIME_REDUCTION = 'time_reduction',
  EXTRA_CHALLENGE = 'extra_challenge',
  ITEM_RESTRICTION = 'item_restriction'
}

// Events for state changes
export interface GameSessionEvent {
  type: GameSessionEventType;
  timestamp: Date;
  data?: any;
}

export enum GameSessionEventType {
  SESSION_STARTED = 'session_started',
  PLAYER_ADDED = 'player_added',
  PUNISHMENT_SELECTED = 'punishment_selected',
  ITEMS_CONFIRMED = 'items_confirmed',
  GAME_STARTED = 'game_started',
  ROUND_COMPLETED = 'round_completed',
  HANDICAP_APPLIED = 'handicap_applied',
  SESSION_COMPLETED = 'session_completed',
  SESSION_CANCELLED = 'session_cancelled'
}

// Service interface
export interface GameLogicService {
  // Session management
  createSession(gameMode: '1v1' | '2v2' | 'coop' | 'tournament'): GameSessionState;
  getSession(): GameSessionState | null;
  resetSession(): void;
  
  // Player management
  setPlayers(player1Name: string, player2Name: string): Promise<void>;
  getPlayerScore(playerId: string): number;
  getLeadingPlayer(): GamePlayer | null;
  
  // Game flow
  setPunishment(punishment: string): void;
  setAvailableItems(items: string[]): void;
  selectGames(): Promise<string[]>; // Select 5 random games based on available items
  getCurrentGame(): string | null;
  getNextGameInstructions(): string; // Returns screen name for next game instructions
  
  // Round management
  completeRound(winnerId: string): Promise<void>;
  isGameComplete(): boolean;
  getWinner(): GamePlayer | null;
  
  // Handicap system
  checkHandicapCondition(): boolean;
  applyHandicap(playerId: string, gameId: string): Promise<PlayerHandicap>;
  getPlayerHandicap(playerId: string): PlayerHandicap | null;
  
  // Navigation helpers
  getNextScreenForCurrentState(): string;
  canProceedToNextRound(): boolean;
  
  // State subscription
  subscribe(callback: (state: GameSessionState) => void): () => void;
  emit(event: GameSessionEvent): void;
}

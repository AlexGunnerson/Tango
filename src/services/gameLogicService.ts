import { 
  GameSessionState, 
  GamePlayer, 
  GameSessionStatus, 
  HandicapType, 
  PlayerHandicap,
  GameRoundResult,
  GameSessionEvent,
  GameSessionEventType,
  GameLogicService 
} from '../types/gameSession';
import { supabaseService, GameFilters } from './supabaseService';
import { networkService } from './networkService';
import { offlineStorageService, OfflineGameSession } from './offlineStorageService';
import { Game } from '../types/game';
import { v4 as uuidv4 } from 'uuid';

class GameLogicServiceImpl implements GameLogicService {
  private currentSession: GameSessionState | null = null;
  private subscribers: ((state: GameSessionState) => void)[] = [];
  private eventHistory: GameSessionEvent[] = [];
  private supabaseSessionId: string | null = null;

  // Helper method for improved item matching logic with database alternatives
  private async doesGameMatchAvailableItems(game: Game, availableItems: string[], playerCount: number = 2): Promise<boolean> {
    if (availableItems.length === 0) return true;
    
    try {
      // Get detailed material requirements for this game
      const requirements = await supabaseService.getGameMaterialRequirements(game.id);
      
      return requirements.every(req => {
        // Calculate total quantity needed
        const totalQuantityNeeded = req.quantity_type === 'PER_USER' 
          ? req.quantity_required * playerCount 
          : req.quantity_required;
        
        // Check if user has the primary material
        if (this.hasEnoughMaterial(availableItems, req.material_name, totalQuantityNeeded)) {
          return true;
        }
        
        // Check alternatives if they're allowed for this game
        const allowedAlternatives = [];
        if (req.alternative_1_allowed && req.alternative_1) {
          allowedAlternatives.push(req.alternative_1);
        }
        if (req.alternative_2_allowed && req.alternative_2) {
          allowedAlternatives.push(req.alternative_2);
        }
        if (req.alternative_3_allowed && req.alternative_3) {
          allowedAlternatives.push(req.alternative_3);
        }
        
        return allowedAlternatives.length > 0 && allowedAlternatives.some(alt => 
          this.hasEnoughMaterial(availableItems, alt, totalQuantityNeeded)
        );
      });
    } catch (error) {
      console.error('Error checking game material requirements:', error);
      // Fallback to legacy string-based matching
      return this.doesGameMatchAvailableItemsLegacy(game, availableItems);
    }
  }

  // Legacy matching logic as fallback
  private doesGameMatchAvailableItemsLegacy(game: Game, availableItems: string[]): boolean {
    if (availableItems.length === 0) return true;
    
    return game.requiredItems.every(requiredItem => {
      return availableItems.some(availableItem => {
        const required = requiredItem.toLowerCase().trim();
        const available = availableItem.toLowerCase().trim();
        
        // Exact match
        if (available === required) return true;
        
        // Partial match (current logic)
        if (available.includes(required) || required.includes(available)) return true;
        
        // Handle common alternatives
        const alternatives: { [key: string]: string[] } = {
          'spoon': ['spoon', 'utensil', 'silverware', 'cutlery'],
          'bowl': ['bowl', 'container', 'dish'],
          'paper': ['paper', 'sheet', 'notebook', 'pad'],
          'pen': ['pen', 'pencil', 'marker', 'writing utensil', 'something to write with'],
          'pencil': ['pen', 'pencil', 'marker', 'writing utensil', 'something to write with'],
          'coins': ['coins', 'pennies', 'change', 'money'],
          'pennies': ['coins', 'pennies', 'change', 'money'],
        };
        
        // Check if required item has alternatives that match available items
        const requiredAlternatives = alternatives[required] || [];
        if (requiredAlternatives.some(alt => available.includes(alt.toLowerCase()))) return true;
        
        // Check if available item has alternatives that match required items
        for (const [key, alts] of Object.entries(alternatives)) {
          if (available.includes(key) && alts.some(alt => required.includes(alt.toLowerCase()))) {
            return true;
          }
        }
        
        return false;
      });
    });
  }

  // Helper to check if user has enough of a specific material
  private hasEnoughMaterial(availableItems: string[], materialName: string, quantityNeeded: number): boolean {
    // For now, we assume if the user has the item, they have enough
    // In the future, you could extend this to track quantities
    
    const materialLower = materialName.toLowerCase().trim();
    
    const result = availableItems.some(item => {
      const itemLower = item.toLowerCase().trim();
      
      // Exact match (most reliable)
      if (itemLower === materialLower) return true;
      
      // Only allow "contains" matching if the shorter string is completely contained in the longer one
      // AND the difference in length is reasonable (to avoid false positives like "Paper" matching "Paper Cup")
      if (itemLower.includes(materialLower)) {
        // User has "Plastic Cup", game needs "Cup" - allow this
        return itemLower.length - materialLower.length <= 10;
      }
      
      if (materialLower.includes(itemLower)) {
        // User has "Paper", game needs "Paper Cup" - DON'T allow this (false positive)
        // Only allow if the item is a reasonable substring (like "Cup" in "Paper Cup")
        return materialLower.length - itemLower.length <= 3;
      }
      
      return false;
    });
    
    // Debug logging
    console.log(`🔍 hasEnoughMaterial: "${materialName}" in [${availableItems.join(', ')}] = ${result}`);
    
    return result;
  }

  // Utility method to shuffle an array
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Session management
  createSession(gameMode: '1v1' | '2v2' | 'coop' | 'tournament'): GameSessionState {
    const sessionId = uuidv4(); // Generate proper UUID instead of custom format
    
    this.currentSession = {
      sessionId,
      gameMode,
      status: GameSessionStatus.SETUP,
      player1: {
        id: 'player1',
        name: '',
        originalName: '',
        score: 0,
        wins: [],
        currentHandicap: undefined
      },
      player2: {
        id: 'player2',
        name: '',
        originalName: '',
        score: 0,
        wins: [],
        currentHandicap: undefined
      },
      selectedGames: [],
      currentGameIndex: 0,
      currentRound: 1,
      maxRounds: 5, // Best of 5 for 1v1
      availableItems: [],
      startedAt: new Date()
    };

    this.emit({
      type: GameSessionEventType.SESSION_STARTED,
      timestamp: new Date(),
      data: { sessionId, gameMode }
    });

    return this.currentSession;
  }

  getSession(): GameSessionState | null {
    return this.currentSession;
  }

  resetSession(): void {
    this.currentSession = null;
    this.supabaseSessionId = null;
    this.eventHistory = [];
    this.notifySubscribers();
  }

  // Player management
  async setPlayers(player1Name: string, player2Name: string): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session. Create a session first.');
    }

    this.currentSession.player1.name = player1Name;
    this.currentSession.player1.originalName = player1Name;
    this.currentSession.player2.name = player2Name;
    this.currentSession.player2.originalName = player2Name;
    this.currentSession.status = GameSessionStatus.PLAYER_SELECTION;

    // Create players in Supabase if online
    if (networkService.isOnline()) {
      try {
        console.log('🌐 Creating players in Supabase...');
        const player1 = await supabaseService.createPlayer({ name: player1Name });
        const player2 = await supabaseService.createPlayer({ name: player2Name });
        
        this.currentSession.player1.id = player1.id;
        this.currentSession.player2.id = player2.id;
        
        console.log('✅ Players created in Supabase:', player1.id, player2.id);
      } catch (error) {
        console.error('❌ Failed to create players in Supabase:', error);
        // Generate UUID fallbacks so game session creation doesn't fail
        this.currentSession.player1.id = `player1_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.currentSession.player2.id = `player2_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log('🔄 Using fallback player IDs:', this.currentSession.player1.id, this.currentSession.player2.id);
      }
    } else {
      console.log('📱 Offline: Players will be synced later');
      // Generate UUID fallbacks for offline mode
      this.currentSession.player1.id = `player1_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.currentSession.player2.id = `player2_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      // Queue for sync when online
      await this.queueSyncOperation('CREATE_PLAYER', { name: player1Name });
      await this.queueSyncOperation('CREATE_PLAYER', { name: player2Name });
    }

    this.emit({
      type: GameSessionEventType.PLAYER_ADDED,
      timestamp: new Date(),
      data: { player1Name, player2Name }
    });

    this.notifySubscribers();
  }

  getPlayerScore(playerId: string): number {
    if (!this.currentSession) return 0;
    
    if (playerId === 'player1' || playerId === this.currentSession.player1.id) {
      return this.currentSession.player1.score;
    } else if (playerId === 'player2' || playerId === this.currentSession.player2.id) {
      return this.currentSession.player2.score;
    }
    
    return 0;
  }

  getLeadingPlayer(): GamePlayer | null {
    if (!this.currentSession) return null;
    
    const { player1, player2 } = this.currentSession;
    if (player1.score > player2.score) return player1;
    if (player2.score > player1.score) return player2;
    return null; // Tie
  }

  // Game flow
  setPunishment(punishment: string): void {
    if (!this.currentSession) {
      throw new Error('No active session. Create a session first.');
    }

    this.currentSession.punishment = punishment;
    this.currentSession.status = GameSessionStatus.PUNISHMENT_SELECTION;

    this.emit({
      type: GameSessionEventType.PUNISHMENT_SELECTED,
      timestamp: new Date(),
      data: { punishment }
    });

    this.notifySubscribers();
  }

  setAvailableItems(items: string[]): void {
    if (!this.currentSession) {
      throw new Error('No active session. Create a session first.');
    }

    this.currentSession.availableItems = items;
    this.currentSession.status = GameSessionStatus.ITEM_GATHERING;

    this.emit({
      type: GameSessionEventType.ITEMS_CONFIRMED,
      timestamp: new Date(),
      data: { items }
    });

    this.notifySubscribers();
  }

  async selectGames(userId?: string): Promise<string[]> {
    if (!this.currentSession) {
      throw new Error('No active session. Create a session first.');
    }

    try {
      let selectedGames: Game[] = [];

      if (networkService.isOnline()) {
        // Online: Use item-based filtering to select random games
        console.log('🌐 Online: Selecting random games based on gathered items');
        console.log('🎒 Available items:', this.currentSession.availableItems);
        
        const filters: GameFilters = {
          maxPlayers: 2,
          minPlayers: 2,
          availableItems: this.currentSession.availableItems,
          isPremium: false // For now, only use free games
        };

        // Get all games that match the available items, then randomly select 5
        selectedGames = await supabaseService.getRandomGames(5, filters);
        
        // Get total count for user feedback
        const totalAvailable = await supabaseService.getAvailableGamesCount(this.currentSession.availableItems);
        console.log(`🎯 Selected ${selectedGames.length} random games from ${totalAvailable} available games:`, selectedGames.map(g => g.title));
        
        // Debug: Double-check each selected game immediately
        console.log('🔍 Double-checking selected games:');
        for (const game of selectedGames) {
          const matches = await this.doesGameMatchAvailableItems(game, this.currentSession.availableItems, 2);
          console.log(`  - ${game.title}: ${matches ? '✅ VALID' : '❌ INVALID'}`);
          if (!matches) {
            const requirements = await supabaseService.getGameMaterialRequirements(game.id);
            console.log(`    Required: ${requirements.map(r => r.material_name).join(', ')}`);
            console.log(`    Available: ${this.currentSession.availableItems.join(', ')}`);
          }
        }

        // Create Supabase session if not exists
        if (!this.supabaseSessionId) {
          await this.createSupabaseSession();
        }
      } else {
        // Offline: Use cached games filtered by available items
        console.log('📱 Offline: Selecting random games from cached games based on gathered items');
        console.log('🎒 Available items:', this.currentSession.availableItems);
        
        const cachedGames = await offlineStorageService.getCachedGames();
        
        if (cachedGames.length === 0) {
          throw new Error('No cached games available for offline play. Please connect to internet first.');
        }

        // Filter cached games based on player count, premium status, and available items
        const filteredGames = [];
        for (const game of cachedGames) {
          if (
            game.maxPlayers >= 2 && 
            game.minPlayers <= 2 &&
            !game.isPremium
          ) {
            // Check if game can be played with available items
            const matches = await this.doesGameMatchAvailableItems(game, this.currentSession.availableItems, 2);
            if (matches) {
              filteredGames.push(game);
            }
          }
        }

        if (filteredGames.length === 0) {
          throw new Error(`No games available with the selected items: ${this.currentSession.availableItems.join(', ')}`);
        }

        // Randomly select up to 5 games from the filtered games
        selectedGames = this.shuffleArray(filteredGames).slice(0, 5);
        
        console.log(`🎯 Selected ${selectedGames.length} random games from ${filteredGames.length} available cached games:`, selectedGames.map(g => g.title));
      }

      // Validation: Ensure all selected games can be played with available items
      if (this.currentSession.availableItems.length > 0) {
        const invalidGames = [];
        for (const game of selectedGames) {
          const matches = await this.doesGameMatchAvailableItems(game, this.currentSession.availableItems, 2);
          if (!matches) {
            invalidGames.push(game);
            
            // Debug: Show what materials this game actually requires
            try {
              const requirements = await supabaseService.getGameMaterialRequirements(game.id);
              console.warn(`⚠️ Game "${game.title}" requires materials:`, requirements.map(r => r.material_name));
              console.warn(`⚠️ User has items:`, this.currentSession.availableItems);
            } catch (err) {
              console.warn(`⚠️ Could not get requirements for "${game.title}"`);
            }
          }
        }
        
        if (invalidGames.length > 0) {
          console.warn('⚠️ Some selected games require unavailable items:', invalidGames.map(g => g.title));
          // Remove invalid games and try to find replacements
          selectedGames = selectedGames.filter(game => !invalidGames.includes(game));
          
          if (selectedGames.length === 0) {
            throw new Error('No games can be played with the selected items. Please select more items.');
          }
        }
      }

      if (selectedGames.length === 0) {
        throw new Error('No suitable games found. Please check your item selection.');
      }

      this.currentSession.selectedGames = selectedGames.map(game => game.id);
      this.currentSession.status = GameSessionStatus.GAME_INSTRUCTIONS;

      // Save session offline
      await this.saveSessionOffline();

      this.notifySubscribers();
      return this.currentSession.selectedGames;
    } catch (error) {
      console.error('Error selecting games:', error);
      throw new Error(`Failed to select games: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getCurrentGame(): string | null {
    if (!this.currentSession || this.currentSession.selectedGames.length === 0) {
      return null;
    }

    const currentGame = this.currentSession.selectedGames[this.currentSession.currentGameIndex] || null;
    
    return currentGame;
  }

  async getCurrentGameTimerDuration(): Promise<number> {
    const currentGameId = this.getCurrentGame();
    
    if (!currentGameId) {
      return 90; // Default fallback timer duration (90 seconds)
    }

    try {
      const game = await supabaseService.getGameById(currentGameId);
      
      if (game && game.timerDuration !== null && game.timerDuration !== undefined) {
        return game.timerDuration;
      }
      return 90; // Default fallback if no timer duration specified
    } catch (error) {
      console.error('🎮 GameLogicService - Error fetching game timer duration:', error);
      return 90; // Default fallback on error
    }
  }

  async getGameTimerDurationByTitle(gameTitle: string): Promise<number> {
    
    try {
      const game = await supabaseService.getGameByTitle(gameTitle);
      
      if (game && game.timerDuration !== null && game.timerDuration !== undefined) {
        return game.timerDuration;
      }
      return 90; // Default fallback if no timer duration specified
    } catch (error) {
      console.error('🎮 GameLogicService - Error fetching game timer duration by title:', error);
      return 90; // Default fallback on error
    }
  }

  async getGameTimerDurationById(gameId: string): Promise<number> {
    
    try {
      const game = await supabaseService.getGameById(gameId);
      
      if (game && game.timerDuration !== null && game.timerDuration !== undefined) {
        return game.timerDuration;
      }
      return 90; // Default fallback if no timer duration specified
    } catch (error) {
      console.error('🎮 GameLogicService - Error fetching game timer duration by ID:', error);
      return 90; // Default fallback on error
    }
  }

  getNextGameInstructions(): string {
    if (!this.currentSession) return 'GameInstructionsScreen1';
    
    const gameIndex = this.currentSession.currentGameIndex;
    const instructionScreens = [
      'GameInstructionsScreen1',
      'GameInstructionsScreen2', 
      'GameInstructionsScreen3',
      'GameInstructionsScreen4',
      'GameInstructionsScreen5'
    ];

    return instructionScreens[gameIndex] || 'GameInstructionsScreen1';
  }

  // Round management
  async completeRound(winnerId: string): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session. Create a session first.');
    }

    const winner = winnerId === 'player1' ? this.currentSession.player1 : this.currentSession.player2;
    const loser = winnerId === 'player1' ? this.currentSession.player2 : this.currentSession.player1;
    
    // Update scores
    winner.score += 1;

    // Record the win
    const currentGameId = this.getCurrentGame();
    let currentGame: Game | null = null;
    
    try {
      if (currentGameId) {
        currentGame = await supabaseService.getGameById(currentGameId);
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
      // Continue with null game - we'll use a fallback title
    }
    
    const roundResult: GameRoundResult = {
      gameId: currentGameId || '',
      gameTitle: currentGame?.title || 'Unknown Game',
      round: this.currentSession.currentRound,
      won: true,
      completedAt: new Date(),
      handicapApplied: winner.currentHandicap
    };

    winner.wins.push(roundResult);

    // Move to next game
    this.currentSession.currentGameIndex += 1;
    this.currentSession.currentRound += 1;

    // Clear handicaps after round completion
    this.currentSession.player1.currentHandicap = undefined;
    this.currentSession.player2.currentHandicap = undefined;

    this.emit({
      type: GameSessionEventType.ROUND_COMPLETED,
      timestamp: new Date(),
      data: { 
        winnerId, 
        round: this.currentSession.currentRound - 1,
        gameId: currentGameId,
        newScore: winner.score 
      }
    });

    // Check if game is complete
    if (this.isGameComplete()) {
      this.currentSession.status = GameSessionStatus.GAME_COMPLETE;
      this.currentSession.completedAt = new Date();
      
      this.emit({
        type: GameSessionEventType.SESSION_COMPLETED,
        timestamp: new Date(),
        data: { winner: this.getWinner() }
      });
    } else {
      this.currentSession.status = GameSessionStatus.GAME_INSTRUCTIONS;
    }

    // Save session offline
    await this.saveSessionOffline();

    // Update Supabase session if online
    if (networkService.isOnline() && this.supabaseSessionId) {
      try {
        console.log('🌐 Updating game session in Supabase...');
        
        await supabaseService.updateGameSession(this.supabaseSessionId, {
          player1_score: this.currentSession.player1.score,
          player2_score: this.currentSession.player2.score,
          current_game_index: this.currentSession.currentGameIndex,
          current_round: this.currentSession.currentRound,
          status: this.currentSession.status === GameSessionStatus.GAME_COMPLETE ? 'game_complete' : 'gameplay',
          winner_id: this.isGameComplete() ? this.getWinner()?.id : undefined,
          completed_at: this.currentSession.completedAt?.toISOString(),
        });
        
        // Create match history if game is complete
        if (this.isGameComplete()) {
          console.log('🌐 Creating match history in Supabase...');
          await supabaseService.createMatchHistory(this.supabaseSessionId);
        }
        
        console.log('✅ Game session updated in Supabase');
      } catch (error) {
        console.error('❌ Failed to update game session in Supabase:', error);
        // Continue with local session even if Supabase fails
      }
    } else if (!networkService.isOnline()) {
      // Queue sync operation if offline
      await this.queueSyncOperation('UPDATE_SESSION', {
        id: this.currentSession.sessionId,
        updates: {
          player1_score: this.currentSession.player1.score,
          player2_score: this.currentSession.player2.score,
          current_round: this.currentSession.currentRound,
          status: this.currentSession.status,
          winner_id: this.isGameComplete() ? this.getWinner()?.id : null,
          completed_at: this.currentSession.completedAt?.toISOString(),
        }
      });
    }

    this.notifySubscribers();
  }

  isGameComplete(): boolean {
    if (!this.currentSession) return false;
    
    const { player1, player2 } = this.currentSession;
    return player1.score >= 3 || player2.score >= 3;
  }

  getWinner(): GamePlayer | null {
    if (!this.currentSession || !this.isGameComplete()) return null;
    
    const { player1, player2 } = this.currentSession;
    if (player1.score >= 3) return player1;
    if (player2.score >= 3) return player2;
    return null;
  }

  // Handicap system
  checkHandicapCondition(): boolean {
    if (!this.currentSession) return false;
    
    const { player1, player2 } = this.currentSession;
    const scoreDifference = Math.abs(player1.score - player2.score);
    return scoreDifference >= 2;
  }

  async applyHandicap(playerId: string, gameId: string): Promise<PlayerHandicap> {
    if (!this.currentSession) {
      throw new Error('No active session. Create a session first.');
    }

    const player = playerId === 'player1' ? this.currentSession.player1 : this.currentSession.player2;
    
    let game: Game | null = null;
    try {
      game = await supabaseService.getGameById(gameId);
    } catch (error) {
      console.error('Error fetching game for handicap:', error);
      // Continue without game details
    }
    
    // For now, implement a simple time reduction handicap
    const handicap: PlayerHandicap = {
      type: HandicapType.TIME_REDUCTION,
      description: `${player.originalName} has 15 seconds less time due to their 2-game lead`,
      gameId,
      round: this.currentSession.currentRound
    };

    player.currentHandicap = handicap;

    this.emit({
      type: GameSessionEventType.HANDICAP_APPLIED,
      timestamp: new Date(),
      data: { playerId, handicap }
    });

    this.notifySubscribers();
    return handicap;
  }

  getPlayerHandicap(playerId: string): PlayerHandicap | null {
    if (!this.currentSession) return null;
    
    const player = playerId === 'player1' ? this.currentSession.player1 : this.currentSession.player2;
    return player.currentHandicap || null;
  }

  // Navigation helpers
  getNextScreenForCurrentState(): string {
    if (!this.currentSession) return 'Home';
    
    switch (this.currentSession.status) {
      case GameSessionStatus.SETUP:
        return 'PlayerSelection';
      case GameSessionStatus.PLAYER_SELECTION:
        return 'PunishmentSelection';
      case GameSessionStatus.PUNISHMENT_SELECTION:
        return 'ItemGathering';
      case GameSessionStatus.ITEM_GATHERING:
        return this.getNextGameInstructions();
      case GameSessionStatus.GAME_INSTRUCTIONS:
        return this.getNextGameInstructions();
      case GameSessionStatus.GAMEPLAY:
        return 'Scoring';
      case GameSessionStatus.SCORING:
        return this.isGameComplete() ? 'Winner' : this.getNextGameInstructions();
      case GameSessionStatus.GAME_COMPLETE:
        return 'Winner';
      default:
        return 'Home';
    }
  }

  canProceedToNextRound(): boolean {
    if (!this.currentSession) return false;
    
    return this.currentSession.status === GameSessionStatus.SCORING && !this.isGameComplete();
  }

  // State subscription
  subscribe(callback: (state: GameSessionState) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  emit(event: GameSessionEvent): void {
    this.eventHistory.push(event);
    // Event logged for debugging if needed
  }

  // Private helper methods
  private async createSupabaseSession(): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    try {
      console.log('🌐 Creating game session in Supabase...');
      
      const sessionData = {
        player1_id: this.currentSession.player1.id,
        player2_id: this.currentSession.player2.id,
        punishment_id: undefined, // TODO: Convert punishment name to ID when needed
        available_items: this.currentSession.availableItems,
        selected_games: this.currentSession.selectedGames,
        current_game_index: this.currentSession.currentGameIndex,
        current_round: this.currentSession.currentRound,
        player1_score: this.currentSession.player1.score,
        player2_score: this.currentSession.player2.score,
        status: 'setup',
      };

      const session = await supabaseService.createGameSession(sessionData);
      this.supabaseSessionId = session.id;
      
      console.log('✅ Game session created in Supabase:', session.id);
    } catch (error) {
      console.error('❌ Failed to create game session in Supabase:', error);
      throw error;
    }
  }

  // Offline session management
  private async saveSessionOffline(): Promise<void> {
    if (!this.currentSession) return;

    try {
      const offlineSession: OfflineGameSession = {
        id: this.currentSession.sessionId,
        sessionState: { ...this.currentSession },
        createdAt: this.currentSession.startedAt.toISOString(),
        updatedAt: new Date().toISOString(),
        completed: this.currentSession.status === GameSessionStatus.COMPLETED,
        synced: networkService.isOnline() && !!this.supabaseSessionId,
      };

      await offlineStorageService.saveOfflineSession(offlineSession);
      console.log('📱 Session saved offline:', this.currentSession.sessionId);
    } catch (error) {
      console.error('Failed to save session offline:', error);
      // Don't throw error - offline saving is best effort
    }
  }

  private async queueSyncOperation(type: string, data: any): Promise<void> {
    if (networkService.isOnline()) {
      // If online, no need to queue
      return;
    }

    try {
      await offlineStorageService.addToSyncQueue({
        type: type as any,
        data,
        maxRetries: 3,
      });
      console.log('📱 Queued sync operation:', type);
    } catch (error) {
      console.error('Failed to queue sync operation:', error);
      // Don't throw error - sync queuing is best effort
    }
  }

  private notifySubscribers(): void {
    if (this.currentSession) {
      this.subscribers.forEach(callback => callback(this.currentSession!));
    }
  }

  // Debug methods
  getEventHistory(): GameSessionEvent[] {
    return [...this.eventHistory];
  }

  getSessionSummary(): object {
    if (!this.currentSession) return {};
    
    return {
      sessionId: this.currentSession.sessionId,
      status: this.currentSession.status,
      round: this.currentSession.currentRound,
      scores: {
        [this.currentSession.player1.name]: this.currentSession.player1.score,
        [this.currentSession.player2.name]: this.currentSession.player2.score
      },
      currentGame: this.getCurrentGame(),
      isComplete: this.isGameComplete(),
      winner: this.getWinner()?.name || null
    };
  }
}

// Export singleton instance
export const gameLogicService = new GameLogicServiceImpl();

// Export the class for testing
export { GameLogicServiceImpl };

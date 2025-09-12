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
import { getRandomGames, getGameById } from '../data/games';

class GameLogicServiceImpl implements GameLogicService {
  private currentSession: GameSessionState | null = null;
  private subscribers: ((state: GameSessionState) => void)[] = [];
  private eventHistory: GameSessionEvent[] = [];

  // Session management
  createSession(gameMode: '1v1' | '2v2' | 'coop' | 'tournament'): GameSessionState {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
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
    this.eventHistory = [];
    this.notifySubscribers();
  }

  // Player management
  setPlayers(player1Name: string, player2Name: string): void {
    if (!this.currentSession) {
      throw new Error('No active session. Create a session first.');
    }

    this.currentSession.player1.name = player1Name;
    this.currentSession.player1.originalName = player1Name;
    this.currentSession.player2.name = player2Name;
    this.currentSession.player2.originalName = player2Name;
    this.currentSession.status = GameSessionStatus.PLAYER_SELECTION;

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

  selectGames(): string[] {
    if (!this.currentSession) {
      throw new Error('No active session. Create a session first.');
    }

    // Select 5 random games based on available items and 1v1 compatibility
    const selectedGames = getRandomGames(5, {
      maxPlayers: 2,
      minPlayers: 2,
      availableItems: this.currentSession.availableItems,
      isPremium: false // For now, only use free games
    });

    this.currentSession.selectedGames = selectedGames.map(game => game.id);
    this.currentSession.status = GameSessionStatus.GAME_INSTRUCTIONS;

    this.notifySubscribers();
    return this.currentSession.selectedGames;
  }

  getCurrentGame(): string | null {
    if (!this.currentSession || this.currentSession.selectedGames.length === 0) {
      return null;
    }

    return this.currentSession.selectedGames[this.currentSession.currentGameIndex] || null;
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
  completeRound(winnerId: string): void {
    if (!this.currentSession) {
      throw new Error('No active session. Create a session first.');
    }

    const winner = winnerId === 'player1' ? this.currentSession.player1 : this.currentSession.player2;
    const loser = winnerId === 'player1' ? this.currentSession.player2 : this.currentSession.player1;
    
    // Update scores
    winner.score += 1;

    // Record the win
    const currentGameId = this.getCurrentGame();
    const currentGame = currentGameId ? getGameById(currentGameId) : null;
    
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

  applyHandicap(playerId: string, gameId: string): PlayerHandicap {
    if (!this.currentSession) {
      throw new Error('No active session. Create a session first.');
    }

    const player = playerId === 'player1' ? this.currentSession.player1 : this.currentSession.player2;
    const game = getGameById(gameId);
    
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
    console.log('🎮 Game Logic Service Event:', event);
  }

  // Private helper methods
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

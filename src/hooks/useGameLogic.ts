import { useState, useEffect, useCallback } from 'react';
import { gameLogicService } from '../services/gameLogicService';
import { GameSessionState, GamePlayer, PlayerHandicap } from '../types/gameSession';

/**
 * React hook for managing 1v1 game logic and state
 * Provides a clean interface to the GameLogicService for React components
 */
export const useGameLogic = () => {
  const [sessionState, setSessionState] = useState<GameSessionState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to session state changes
  useEffect(() => {
    const unsubscribe = gameLogicService.subscribe((state) => {
      setSessionState(state);
    });

    // Initialize with current session if exists
    const currentSession = gameLogicService.getSession();
    if (currentSession) {
      setSessionState(currentSession);
    }

    return unsubscribe;
  }, []);

  // Session management
  const createSession = useCallback((gameMode: '1v1' | '2v2' | 'coop' | 'tournament' = '1v1') => {
    try {
      setIsLoading(true);
      setError(null);
      const session = gameLogicService.createSession(gameMode);
      setSessionState(session);
      return session;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetSession = useCallback(() => {
    gameLogicService.resetSession();
    setSessionState(null);
    setError(null);
  }, []);

  // Player management
  const setPlayers = useCallback(async (player1Name: string, player2Name: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await gameLogicService.setPlayers(player1Name, player2Name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set players');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Game flow
  const setPunishment = useCallback((punishment: string) => {
    try {
      setError(null);
      gameLogicService.setPunishment(punishment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set punishment');
    }
  }, []);

  const setAvailableItems = useCallback((items: string[]) => {
    try {
      setError(null);
      gameLogicService.setAvailableItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set available items');
    }
  }, []);

  const selectGames = useCallback(async () => {
    try {
      setError(null);
      return await gameLogicService.selectGames();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select games');
      return [];
    }
  }, []);

  // Round management
  const completeRound = useCallback(async (winnerId: string) => {
    try {
      setError(null);
      await gameLogicService.completeRound(winnerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete round');
    }
  }, []);

  // Handicap system
  const applyHandicap = useCallback(async (playerId: string, gameId: string) => {
    try {
      setError(null);
      return await gameLogicService.applyHandicap(playerId, gameId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply handicap');
      return null;
    }
  }, []);

  // Computed values
  const player1 = sessionState?.player1 || null;
  const player2 = sessionState?.player2 || null;
  const currentGameId = sessionState ? gameLogicService.getCurrentGame() : null;
  const isGameComplete = sessionState ? gameLogicService.isGameComplete() : false;
  const winner = sessionState ? gameLogicService.getWinner() : null;
  const leadingPlayer = sessionState ? gameLogicService.getLeadingPlayer() : null;
  const hasHandicapCondition = sessionState ? gameLogicService.checkHandicapCondition() : false;
  const nextScreen = sessionState ? gameLogicService.getNextScreenForCurrentState() : 'Home';
  const canProceedToNextRound = sessionState ? gameLogicService.canProceedToNextRound() : false;

  // Helper functions
  const getPlayerScore = useCallback((playerId: string) => {
    return gameLogicService.getPlayerScore(playerId);
  }, []);

  const getPlayerHandicap = useCallback((playerId: string) => {
    return gameLogicService.getPlayerHandicap(playerId);
  }, []);

  const getNextGameInstructions = useCallback(() => {
    return gameLogicService.getNextGameInstructions();
  }, []);

  const getCurrentGameTimerDuration = useCallback(async () => {
    return await gameLogicService.getCurrentGameTimerDuration();
  }, []);

  const getGameTimerDurationByTitle = useCallback(async (gameTitle: string) => {
    return await gameLogicService.getGameTimerDurationByTitle(gameTitle);
  }, []);

  const getGameTimerDurationById = useCallback(async (gameId: string) => {
    return await gameLogicService.getGameTimerDurationById(gameId);
  }, []);

  // Debug helpers
  const getSessionSummary = useCallback(() => {
    return gameLogicService.getSessionSummary();
  }, []);

  const getEventHistory = useCallback(() => {
    return gameLogicService.getEventHistory();
  }, []);

  return {
    // State
    sessionState,
    isLoading,
    error,
    
    // Session management
    createSession,
    resetSession,
    
    // Player management
    setPlayers,
    player1,
    player2,
    
    // Game flow
    setPunishment,
    setAvailableItems,
    selectGames,
    
    // Round management
    completeRound,
    isGameComplete,
    winner,
    leadingPlayer,
    
    // Handicap system
    hasHandicapCondition,
    applyHandicap,
    getPlayerHandicap,
    
    // Navigation helpers
    nextScreen,
    canProceedToNextRound,
    getNextGameInstructions,
    getCurrentGameTimerDuration,
    getGameTimerDurationByTitle,
    getGameTimerDurationById,
    
    // Computed values
    currentGameId,
    
    // Helper functions
    getPlayerScore,
    
    // Debug helpers
    getSessionSummary,
    getEventHistory,
    
    // Direct service access (for advanced use cases)
    service: gameLogicService
  };
};

import { useState, useEffect, useCallback } from 'react';
import { supabaseService, GameFilters, CreatePlayerData, CreateGameSessionData, UpdateGameSessionData, PlayerStats } from '../services/supabaseService';
import { Game } from '../types/game';

/**
 * React hook for Supabase operations
 * Provides a clean interface to the SupabaseService for React components
 */
export const useSupabase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // Health check on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const healthy = await supabaseService.healthCheck();
        setIsConnected(healthy);
      } catch (err) {
        setIsConnected(false);
        setError('Failed to connect to database');
      }
    };

    checkConnection();
  }, []);

  // Game Configuration Methods
  const getGameConfigs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const games = await supabaseService.getGameConfigs();
      return games;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch game configs';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getGameById = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const game = await supabaseService.getGameById(id);
      return game;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch game';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getGamesByFilters = useCallback(async (filters: GameFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const games = await supabaseService.getGamesByFilters(filters);
      return games;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch filtered games';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRandomGames = useCallback(async (count: number, filters?: GameFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const games = await supabaseService.getRandomGames(count, filters);
      return games;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch random games';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Player Management Methods
  const createPlayer = useCallback(async (playerData: CreatePlayerData) => {
    try {
      setIsLoading(true);
      setError(null);
      const player = await supabaseService.createPlayer(playerData);
      return player;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create player';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPlayerById = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const player = await supabaseService.getPlayerById(id);
      return player;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch player';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOrCreatePlayer = useCallback(async (name: string, email?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const player = await supabaseService.getOrCreatePlayer(name, email);
      return player;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get or create player';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPlayerStats = useCallback(async (playerId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await supabaseService.getPlayerStats(playerId);
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch player stats';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Punishment Methods
  const getPunishments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const punishments = await supabaseService.getPunishments();
      return punishments;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch punishments';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRandomPunishment = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const punishment = await supabaseService.getRandomPunishment();
      return punishment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch random punishment';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPunishmentById = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const punishment = await supabaseService.getPunishmentById(id);
      return punishment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch punishment';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Game Session Methods
  const createGameSession = useCallback(async (sessionData: CreateGameSessionData) => {
    try {
      setIsLoading(true);
      setError(null);
      const session = await supabaseService.createGameSession(sessionData);
      return session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create game session';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getGameSession = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const session = await supabaseService.getGameSession(id);
      return session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch game session';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateGameSession = useCallback(async (id: string, updates: UpdateGameSessionData) => {
    try {
      setIsLoading(true);
      setError(null);
      await supabaseService.updateGameSession(id, updates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update game session';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Match History Methods
  const getPlayerMatchHistory = useCallback(async (playerId: string, limit?: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const history = await supabaseService.getPlayerMatchHistory(playerId, limit);
      return history;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch match history';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Utility Methods
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      const healthy = await supabaseService.healthCheck();
      setIsConnected(healthy);
      if (!healthy) {
        setError('Database connection failed');
      } else {
        setError(null);
      }
      return healthy;
    } catch (err) {
      setIsConnected(false);
      setError('Database connection failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    isLoading,
    error,
    isConnected,

    // Game Configuration Methods
    getGameConfigs,
    getGameById,
    getGamesByFilters,
    getRandomGames,

    // Player Management Methods
    createPlayer,
    getPlayerById,
    getOrCreatePlayer,
    getPlayerStats,

    // Punishment Methods
    getPunishments,
    getRandomPunishment,
    getPunishmentById,

    // Game Session Methods
    createGameSession,
    getGameSession,
    updateGameSession,

    // Match History Methods
    getPlayerMatchHistory,

    // Utility Methods
    clearError,
    checkConnection,

    // Direct service access (for advanced use cases)
    service: supabaseService
  };
};

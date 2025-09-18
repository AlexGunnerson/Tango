import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game } from '../types/game';
import { GameSessionState } from '../types/gameSession';

// Storage keys
const STORAGE_KEYS = {
  GAMES: '@tango/games',
  PUNISHMENTS: '@tango/punishments',
  OFFLINE_SESSIONS: '@tango/offline_sessions',
  SYNC_QUEUE: '@tango/sync_queue',
  LAST_SYNC: '@tango/last_sync',
  CACHED_PLAYERS: '@tango/cached_players',
} as const;

// Types for offline data
export interface OfflineGameSession {
  id: string;
  sessionState: GameSessionState;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  synced: boolean;
}

export interface SyncOperation {
  id: string;
  type: 'CREATE_SESSION' | 'UPDATE_SESSION' | 'CREATE_MATCH_HISTORY' | 'CREATE_PLAYER';
  data: any;
  createdAt: string;
  retryCount: number;
  maxRetries: number;
}

export interface CachedPlayer {
  id: string;
  name: string;
  createdAt: string;
  synced: boolean;
}

class OfflineStorageService {
  // Helper method for improved item matching logic (offline version)
  private async doesGameMatchAvailableItems(game: Game, availableItems: string[], playerCount: number = 2): Promise<boolean> {
    if (availableItems.length === 0) return true;
    
    // For offline mode, we fall back to the legacy string-based matching
    // since we don't have access to the database alternatives
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

  // Game Configuration Methods
  async cacheGames(games: Game[]): Promise<void> {
    try {
      const gamesData = {
        games,
        cachedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(gamesData));
      console.log('📱 Cached games for offline use:', games.length);
    } catch (error) {
      console.error('Failed to cache games:', error);
      throw error;
    }
  }

  async getCachedGames(): Promise<Game[]> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.GAMES);
      if (!cached) return [];
      
      const gamesData = JSON.parse(cached);
      return gamesData.games || [];
    } catch (error) {
      console.error('Failed to get cached games:', error);
      return [];
    }
  }

  async cachePunishments(punishments: any[]): Promise<void> {
    try {
      const punishmentsData = {
        punishments,
        cachedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.PUNISHMENTS, JSON.stringify(punishmentsData));
      console.log('📱 Cached punishments for offline use:', punishments.length);
    } catch (error) {
      console.error('Failed to cache punishments:', error);
      throw error;
    }
  }

  async getCachedPunishments(): Promise<any[]> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.PUNISHMENTS);
      if (!cached) return [];
      
      const punishmentsData = JSON.parse(cached);
      return punishmentsData.punishments || [];
    } catch (error) {
      console.error('Failed to get cached punishments:', error);
      return [];
    }
  }

  async getCachedAvailableGamesCount(selectedItems: string[]): Promise<number> {
    try {
      const cachedGames = await this.getCachedGames();
      
      if (cachedGames.length === 0) {
        return 0;
      }

      // Filter cached games based on criteria similar to online filtering
      const filteredGames = [];
      for (const game of cachedGames) {
        if (
          game.maxPlayers >= 2 && 
          game.minPlayers <= 2 &&
          !game.isPremium
        ) {
          // Use improved item matching logic
          const matches = await this.doesGameMatchAvailableItems(game, selectedItems, 2);
          if (matches) {
            filteredGames.push(game);
          }
        }
      }

      return filteredGames.length;
    } catch (error) {
      console.error('Failed to get cached available games count:', error);
      return 0;
    }
  }

  // Offline Session Management
  async saveOfflineSession(session: OfflineGameSession): Promise<void> {
    try {
      const sessions = await this.getOfflineSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_SESSIONS, JSON.stringify(sessions));
      console.log('📱 Saved offline session:', session.id);
    } catch (error) {
      console.error('Failed to save offline session:', error);
      throw error;
    }
  }

  async getOfflineSessions(): Promise<OfflineGameSession[]> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_SESSIONS);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Failed to get offline sessions:', error);
      return [];
    }
  }

  async getOfflineSession(sessionId: string): Promise<OfflineGameSession | null> {
    try {
      const sessions = await this.getOfflineSessions();
      return sessions.find(s => s.id === sessionId) || null;
    } catch (error) {
      console.error('Failed to get offline session:', error);
      return null;
    }
  }

  async deleteOfflineSession(sessionId: string): Promise<void> {
    try {
      const sessions = await this.getOfflineSessions();
      const filteredSessions = sessions.filter(s => s.id !== sessionId);
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_SESSIONS, JSON.stringify(filteredSessions));
      console.log('📱 Deleted offline session:', sessionId);
    } catch (error) {
      console.error('Failed to delete offline session:', error);
      throw error;
    }
  }

  // Sync Queue Management
  async addToSyncQueue(operation: Omit<SyncOperation, 'id' | 'createdAt' | 'retryCount'>): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      const newOperation: SyncOperation = {
        ...operation,
        id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        retryCount: 0,
      };
      
      queue.push(newOperation);
      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
      console.log('📱 Added to sync queue:', newOperation.type, newOperation.id);
    } catch (error) {
      console.error('Failed to add to sync queue:', error);
      throw error;
    }
  }

  async getSyncQueue(): Promise<SyncOperation[]> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Failed to get sync queue:', error);
      return [];
    }
  }

  async removeFromSyncQueue(operationId: string): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      const filteredQueue = queue.filter(op => op.id !== operationId);
      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(filteredQueue));
      console.log('📱 Removed from sync queue:', operationId);
    } catch (error) {
      console.error('Failed to remove from sync queue:', error);
      throw error;
    }
  }

  async updateSyncOperation(operationId: string, updates: Partial<SyncOperation>): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      const operationIndex = queue.findIndex(op => op.id === operationId);
      
      if (operationIndex >= 0) {
        queue[operationIndex] = { ...queue[operationIndex], ...updates };
        await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
        console.log('📱 Updated sync operation:', operationId);
      }
    } catch (error) {
      console.error('Failed to update sync operation:', error);
      throw error;
    }
  }

  // Player Cache Management
  async cachePlayer(player: CachedPlayer): Promise<void> {
    try {
      const players = await this.getCachedPlayers();
      const existingIndex = players.findIndex(p => p.id === player.id);
      
      if (existingIndex >= 0) {
        players[existingIndex] = player;
      } else {
        players.push(player);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.CACHED_PLAYERS, JSON.stringify(players));
      console.log('📱 Cached player:', player.name);
    } catch (error) {
      console.error('Failed to cache player:', error);
      throw error;
    }
  }

  async getCachedPlayers(): Promise<CachedPlayer[]> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_PLAYERS);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Failed to get cached players:', error);
      return [];
    }
  }

  async getCachedPlayer(playerId: string): Promise<CachedPlayer | null> {
    try {
      const players = await this.getCachedPlayers();
      return players.find(p => p.id === playerId) || null;
    } catch (error) {
      console.error('Failed to get cached player:', error);
      return null;
    }
  }

  // Sync Status Management
  async setLastSyncTime(timestamp: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp);
    } catch (error) {
      console.error('Failed to set last sync time:', error);
      throw error;
    }
  }

  async getLastSyncTime(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch (error) {
      console.error('Failed to get last sync time:', error);
      return null;
    }
  }

  // Utility Methods
  async clearAllOfflineData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.GAMES),
        AsyncStorage.removeItem(STORAGE_KEYS.PUNISHMENTS),
        AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_SESSIONS),
        AsyncStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE),
        AsyncStorage.removeItem(STORAGE_KEYS.LAST_SYNC),
        AsyncStorage.removeItem(STORAGE_KEYS.CACHED_PLAYERS),
      ]);
      console.log('📱 Cleared all offline data');
    } catch (error) {
      console.error('Failed to clear offline data:', error);
      throw error;
    }
  }

  async getStorageInfo(): Promise<{
    gamesCount: number;
    punishmentsCount: number;
    offlineSessionsCount: number;
    syncQueueLength: number;
    cachedPlayersCount: number;
    lastSync: string | null;
  }> {
    try {
      const [games, punishments, sessions, queue, players, lastSync] = await Promise.all([
        this.getCachedGames(),
        this.getCachedPunishments(),
        this.getOfflineSessions(),
        this.getSyncQueue(),
        this.getCachedPlayers(),
        this.getLastSyncTime(),
      ]);

      return {
        gamesCount: games.length,
        punishmentsCount: punishments.length,
        offlineSessionsCount: sessions.length,
        syncQueueLength: queue.length,
        cachedPlayersCount: players.length,
        lastSync,
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return {
        gamesCount: 0,
        punishmentsCount: 0,
        offlineSessionsCount: 0,
        syncQueueLength: 0,
        cachedPlayersCount: 0,
        lastSync: null,
      };
    }
  }
}

// Create and export a singleton instance
export const offlineStorageService = new OfflineStorageService();
export default offlineStorageService;

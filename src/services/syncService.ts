import { networkService, NetworkStatus } from './networkService';
import { offlineStorageService, SyncOperation, OfflineGameSession } from './offlineStorageService';
import { supabaseService } from './supabaseService';
import { gameLogicService } from './gameLogicService';

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'completed';

class SyncService {
  private syncStatus: SyncStatus = 'idle';
  private syncListeners: ((status: SyncStatus, progress?: { current: number; total: number }) => void)[] = [];
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) return;
    
    // Subscribe to network status changes
    networkService.subscribe((status: NetworkStatus) => {
      if (status === 'online') {
        console.log('📡 Network back online, starting sync...');
        this.startSync();
      }
    });

    this.isInitialized = true;
    console.log('🔄 Sync service initialized');
  }

  public subscribe(callback: (status: SyncStatus, progress?: { current: number; total: number }) => void): () => void {
    this.syncListeners.push(callback);
    
    // Immediately call with current status
    callback(this.syncStatus);

    // Return unsubscribe function
    return () => {
      this.syncListeners = this.syncListeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(status: SyncStatus, progress?: { current: number; total: number }) {
    this.syncStatus = status;
    this.syncListeners.forEach(listener => listener(status, progress));
  }

  public getSyncStatus(): SyncStatus {
    return this.syncStatus;
  }

  public async startSync(): Promise<void> {
    if (!networkService.isOnline()) {
      console.log('📡 Cannot sync: offline');
      return;
    }

    if (this.syncStatus === 'syncing') {
      console.log('🔄 Sync already in progress');
      return;
    }

    try {
      this.notifyListeners('syncing');
      console.log('🔄 Starting sync process...');

      // Step 1: Sync cached data to ensure we have latest
      await this.syncCachedData();

      // Step 2: Process sync queue
      await this.processSyncQueue();

      // Step 3: Sync offline sessions
      await this.syncOfflineSessions();

      // Step 4: Update last sync time
      await offlineStorageService.setLastSyncTime(new Date().toISOString());

      this.notifyListeners('completed');
      console.log('✅ Sync completed successfully');

    } catch (error) {
      console.error('❌ Sync failed:', error);
      this.notifyListeners('error');
      throw error;
    }
  }

  private async syncCachedData(): Promise<void> {
    try {
      console.log('🔄 Syncing cached data...');
      
      // Fetch and cache latest games
      const games = await supabaseService.getGameConfigs();
      await offlineStorageService.cacheGames(games);

      // Fetch and cache latest punishments
      const punishments = await supabaseService.getPunishments();
      await offlineStorageService.cachePunishments(punishments);

      console.log('✅ Cached data synced');
    } catch (error) {
      console.error('❌ Failed to sync cached data:', error);
      throw error;
    }
  }

  private async processSyncQueue(): Promise<void> {
    try {
      const queue = await offlineStorageService.getSyncQueue();
      if (queue.length === 0) {
        console.log('📭 Sync queue is empty');
        return;
      }

      console.log(`🔄 Processing ${queue.length} sync operations...`);

      for (let i = 0; i < queue.length; i++) {
        const operation = queue[i];
        this.notifyListeners('syncing', { current: i + 1, total: queue.length });

        try {
          await this.processSyncOperation(operation);
          await offlineStorageService.removeFromSyncQueue(operation.id);
          console.log(`✅ Sync operation completed: ${operation.type}`);
        } catch (error) {
          console.error(`❌ Sync operation failed: ${operation.type}`, error);
          
          // Increment retry count
          const newRetryCount = operation.retryCount + 1;
          if (newRetryCount >= operation.maxRetries) {
            console.error(`❌ Max retries reached for operation: ${operation.id}`);
            await offlineStorageService.removeFromSyncQueue(operation.id);
          } else {
            await offlineStorageService.updateSyncOperation(operation.id, {
              retryCount: newRetryCount,
            });
          }
        }
      }

      console.log('✅ Sync queue processed');
    } catch (error) {
      console.error('❌ Failed to process sync queue:', error);
      throw error;
    }
  }

  private async processSyncOperation(operation: SyncOperation): Promise<void> {
    switch (operation.type) {
      case 'CREATE_SESSION':
        await supabaseService.createGameSession(operation.data);
        break;
      
      case 'UPDATE_SESSION':
        await supabaseService.updateGameSession(operation.data.id, operation.data.updates);
        break;
      
      case 'CREATE_MATCH_HISTORY':
        await supabaseService.createMatchHistory(operation.data.sessionId);
        break;
      
      case 'CREATE_PLAYER':
        await supabaseService.createPlayer(operation.data);
        break;
      
      default:
        console.warn('Unknown sync operation type:', operation.type);
    }
  }

  private async syncOfflineSessions(): Promise<void> {
    try {
      const offlineSessions = await offlineStorageService.getOfflineSessions();
      const unsyncedSessions = offlineSessions.filter(session => !session.synced);

      if (unsyncedSessions.length === 0) {
        console.log('📭 No unsynced sessions');
        return;
      }

      console.log(`🔄 Syncing ${unsyncedSessions.length} offline sessions...`);

      for (const session of unsyncedSessions) {
        try {
          // Create or update the session in Supabase
          const sessionData = {
            player1_id: session.sessionState.player1?.id || '',
            player2_id: session.sessionState.player2?.id || '',
            punishment_id: undefined, // TODO: Convert punishment string to ID
            player1_score: session.sessionState.player1?.score || 0,
            player2_score: session.sessionState.player2?.score || 0,
            current_game_index: session.sessionState.currentGameIndex || 0,
            current_round: session.sessionState.currentRound || 1,
            status: session.completed ? 'game_complete' : 'gameplay',
            winner_id: undefined, // TODO: Implement winner tracking
            completed_at: session.completed ? session.updatedAt : null,
            selected_games: session.sessionState.selectedGames || [],
          };

          // Try to update first, then create if not exists
          try {
            await supabaseService.updateGameSession(session.id, sessionData);
          } catch (updateError) {
            // If update fails, try to create
            await supabaseService.createGameSession({
              ...sessionData,
              id: session.id,
            });
          }

          // Mark as synced
          const updatedSession: OfflineGameSession = {
            ...session,
            synced: true,
            updatedAt: new Date().toISOString(),
          };
          await offlineStorageService.saveOfflineSession(updatedSession);

          console.log(`✅ Synced offline session: ${session.id}`);
        } catch (error) {
          console.error(`❌ Failed to sync session ${session.id}:`, error);
        }
      }

      console.log('✅ Offline sessions synced');
    } catch (error) {
      console.error('❌ Failed to sync offline sessions:', error);
      throw error;
    }
  }

  // Manual sync trigger
  public async forcSync(): Promise<void> {
    await this.startSync();
  }

  // Get sync statistics
  public async getSyncStats(): Promise<{
    lastSync: string | null;
    pendingOperations: number;
    unsyncedSessions: number;
    cachedGames: number;
    cachedPunishments: number;
  }> {
    try {
      const [storageInfo, syncQueue, offlineSessions] = await Promise.all([
        offlineStorageService.getStorageInfo(),
        offlineStorageService.getSyncQueue(),
        offlineStorageService.getOfflineSessions(),
      ]);

      const unsyncedSessions = offlineSessions.filter(session => !session.synced);

      return {
        lastSync: storageInfo.lastSync,
        pendingOperations: syncQueue.length,
        unsyncedSessions: unsyncedSessions.length,
        cachedGames: storageInfo.gamesCount,
        cachedPunishments: storageInfo.punishmentsCount,
      };
    } catch (error) {
      console.error('Failed to get sync stats:', error);
      return {
        lastSync: null,
        pendingOperations: 0,
        unsyncedSessions: 0,
        cachedGames: 0,
        cachedPunishments: 0,
      };
    }
  }

  // Clear all sync data (for debugging/reset)
  public async clearSyncData(): Promise<void> {
    try {
      await offlineStorageService.clearAllOfflineData();
      this.notifyListeners('idle');
      console.log('🗑️ All sync data cleared');
    } catch (error) {
      console.error('Failed to clear sync data:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const syncService = new SyncService();
export default syncService;

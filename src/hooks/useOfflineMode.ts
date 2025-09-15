import { useState, useEffect, useCallback } from 'react';
import { networkService, NetworkStatus } from '../services/networkService';
import { syncService, SyncStatus } from '../services/syncService';
import { offlineStorageService } from '../services/offlineStorageService';

export interface OfflineModeState {
  networkStatus: NetworkStatus;
  syncStatus: SyncStatus;
  syncProgress?: { current: number; total: number };
  isOnline: boolean;
  isOffline: boolean;
  canSync: boolean;
}

export interface OfflineModeActions {
  forceSync: () => Promise<void>;
  getSyncStats: () => Promise<any>;
  clearOfflineData: () => Promise<void>;
}

/**
 * React hook for managing offline mode functionality
 * Provides network status, sync status, and offline capabilities
 */
export const useOfflineMode = (): OfflineModeState & OfflineModeActions => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('unknown');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number } | undefined>();

  // Subscribe to network status changes
  useEffect(() => {
    const unsubscribeNetwork = networkService.subscribe((status: NetworkStatus) => {
      setNetworkStatus(status);
      console.log('📡 Network status changed:', status);
    });

    return unsubscribeNetwork;
  }, []);

  // Subscribe to sync status changes
  useEffect(() => {
    const unsubscribeSync = syncService.subscribe((status: SyncStatus, progress?: { current: number; total: number }) => {
      setSyncStatus(status);
      setSyncProgress(progress);
      console.log('🔄 Sync status changed:', status, progress);
    });

    return unsubscribeSync;
  }, []);

  // Actions
  const forceSync = useCallback(async () => {
    try {
      await syncService.forcSync();
    } catch (error) {
      console.error('Failed to force sync:', error);
      throw error;
    }
  }, []);

  const getSyncStats = useCallback(async () => {
    try {
      return await syncService.getSyncStats();
    } catch (error) {
      console.error('Failed to get sync stats:', error);
      throw error;
    }
  }, []);

  const clearOfflineData = useCallback(async () => {
    try {
      await syncService.clearSyncData();
    } catch (error) {
      console.error('Failed to clear offline data:', error);
      throw error;
    }
  }, []);

  // Computed values
  const isOnline = networkStatus === 'online';
  const isOffline = networkStatus === 'offline';
  const canSync = isOnline && syncStatus !== 'syncing';

  return {
    // State
    networkStatus,
    syncStatus,
    syncProgress,
    isOnline,
    isOffline,
    canSync,

    // Actions
    forceSync,
    getSyncStats,
    clearOfflineData,
  };
};
